'use client';

import { PulseLoader } from 'react-spinners';

import './Timetable.css';

export interface TimetableEntry {
  date: Date;
  absentTeacher: string;
  changes: string[];
}

export interface TimetableData {
  title: string;
  entries: TimetableEntry[];
}

export default function Timetable({
  data,
  background,
}: {
  data?: TimetableData;
  background: string;
}) {
  return data ? (
    <div className="timetable" style={{ background }}>
      <h1>{data.title}</h1>
      <span className="divider"></span>
      <div className="list">
        {data.entries.map((entry, i) => (
          <div className="entry" key={i}>
            <p>
              <u>
                {entry.date.toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}{' '}
                ({entry.date.toLocaleDateString('pl-PL', { weekday: 'short' })})
              </u>{' '}
              - nb: <span style={{ color: 'red' }}>{entry.absentTeacher}</span>:
            </p>
            <ol>
              {entry.changes.map((change, i) => (
                <li key={i}>
                  <p>{change}</p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="loading" style={{ background }}>
      <PulseLoader size={'20px'} color={'#fafafa'} />
    </div>
  );
}
