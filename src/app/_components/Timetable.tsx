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
  data: TimetableData | null;
  background: string;
}) {
  const bgStyle = `linear-gradient(0deg, ${background} 0%, #0f0f0fee 90%)`;

  return data ? (
    <div className="timetable" style={{ background: bgStyle }}>
      <h1>{data.title}</h1>
      {data.entries.length == 0 && (
        <span
          className="divider"
          style={{ borderTopColor: '#ffffff12' }}
        ></span>
      )}

      <div className="list">
        {data.entries.map((entry, i) => (
          <>
            <span
              className="divider"
              style={{ borderTopColor: '#ffffff12' }}
            ></span>
            <div className="entry" key={i}>
              <p>
                <u>
                  {entry.date.toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  (
                  {entry.date.toLocaleDateString('pl-PL', { weekday: 'short' })}
                  )
                </u>{' '}
                - nb:{' '}
                <span style={{ color: 'red' }}>{entry.absentTeacher}</span>:
              </p>
              <ol>
                {entry.changes.map((change, i) => (
                  <li key={i}>
                    <p>{change}</p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ))}
      </div>
    </div>
  ) : (
    <div className="loading" style={{ background: bgStyle }}>
      <PulseLoader size={'20px'} color={'#fafafa'} />
    </div>
  );
}
