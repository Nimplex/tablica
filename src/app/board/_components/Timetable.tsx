import { Timetable as TimetableModel } from '@/lib/models/Timetable';

import React from 'react';

import './Timetable.css';

export default function Timetable({ id }: { id: number }) {
  const timetable = TimetableModel.getById(id);

  if (!timetable) {
    return (
      <div className="timetable" style={{ background: 'rgb(15, 15, 15)' }}>
        <h1>
          Timetable {id} nie istnieje w bazie danych, skontaktuj się z
          administratorem
        </h1>
      </div>
    );
  }

  const { title, entries, color } = timetable;

  const bgStyle = `linear-gradient(0deg, ${color} 0%, #0f0f0fee 90%)`;

  return (
    <div className="timetable" style={{ background: bgStyle }}>
      <h1>{title}</h1>
      <span className="divider" style={{ borderTopColor: '#ffffff12' }}></span>

      <div className="list">
        {entries.map((entry, i) => (
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
  );
}
