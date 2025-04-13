'use client';

import { useState } from 'react';
import Card from './_components/Card';
import Timetable, { TimetableData } from './_components/Timetable';
import Announcements from './_components/Announcements';
import Clock from './_components/Clock';

export default function Home() {
  const [firstCard, setFirstCards] = useState<TimetableData | null>();
  const [secondCard, setSecondCards] = useState<TimetableData | null>();
  const [thirdCard, setThirdCards] = useState<TimetableData | null>();

  return (
    <div className="standard-grid">
      <Card>
        <Timetable data={firstCard} />
      </Card>
      <Card>
        <Timetable data={secondCard} />
      </Card>
      <Card>
        <Timetable data={thirdCard} />
      </Card>
      <Card>
        <Announcements />
        <Clock />
      </Card>
    </div>
  );
}
