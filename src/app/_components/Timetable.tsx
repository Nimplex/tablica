'use client';

import { PulseLoader } from 'react-spinners';

import './Timetable.css';
import React from 'react';

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
      <span className="divider" style={{ borderTopColor: '#ffffff12' }}></span>

      <div className="list">
        {data.entries.map((entry, i) => (
          <React.Fragment key={`entry-wrapper-${i}`}>
            {i !== 0 && (
              <span
                className="divider"
                style={{ borderTopColor: '#ffffff12' }}
                key={`divider-${i}`}
              ></span>
            )}
            <div className="entry">
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
                <span style={{ color: '#fc6f6a', fontWeight: '600' }}>
                  {entry.absentTeacher}
                </span>
                :
              </p>
              <ol>
                {entry.changes.map((change, j) => (
                  <li key={`change-${i}-${j}`}>
                    <p>{change}</p>
                  </li>
                ))}
              </ol>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  ) : (
    <div className="timetable-loading" style={{ background: bgStyle }}>
      <PulseLoader size={'20px'} color={'#fafafa'} />
    </div>
  );
}
