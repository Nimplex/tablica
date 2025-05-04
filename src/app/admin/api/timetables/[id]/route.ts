import { NextRequest, NextResponse } from 'next/server';
import { Timetable, TimetableEntry } from '@/lib/models/Timetable';
import { requireAuth } from '@/lib/auth/requireAuth';
import { safeParseJSON } from '@/lib/safeParse';
import { Color } from '@/lib/interpolateColor';
import timetableValidator from './validator';

export interface TimetableRequestBody {
  title: string;
  color: Color;
  entries: {
    id: number | null;
    date: string;
    absentTeacher: string;
    changes: string[];
  }[];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth(req);
  if (!user)
    return NextResponse.json({ errors: ['Invalid token'] }, { status: 401 });

  const { data: json, error: parseError } =
    await safeParseJSON<TimetableRequestBody>(req);

  if (parseError || !json) {
    return NextResponse.json({ errors: [parseError] }, { status: 400 });
  }

  const errors = timetableValidator.validate(json as TimetableRequestBody);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { id } = await params;

  const timetableId = parseInt(id);

  if (isNaN(timetableId)) {
    return NextResponse.json(
      { errors: ['Invalid timetable ID'] },
      { status: 400 },
    );
  }

  const timetable = Timetable.getById(timetableId);
  if (!timetable) {
    return NextResponse.json(
      { errors: ['Timetable not found'] },
      { status: 404 },
    );
  }

  try {
    timetable.title = json.title;
    timetable.color = ((json.color as string) + 'ce') as Color;
    timetable.editedBy = user.username;
    timetable.editedAt = new Date();

    timetable.entries = json.entries.map(entry => {
      const newEntry = new TimetableEntry(
        null,
        timetableId,
        new Date(entry.date),
        entry.absentTeacher,
        entry.changes,
      );
      newEntry.insert();
      return newEntry;
    });

    timetable.update();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating timetable:', error);
    return NextResponse.json(
      { errors: ['Failed to update timetable'] },
      { status: 500 },
    );
  }
}
