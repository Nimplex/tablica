import { useEffect, useState } from 'react';
import { multiInterpolateColor } from '../_utils/interpolateColor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';

import './Clock.css';

function getDayFraction(date: Date) {
  return (
    (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) /
    86400
  );
}

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [gradient, setGradient] = useState({ background: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const gradientRGB = multiInterpolateColor(
      {
        0.0: '#001f3f',
        0.25: '#FFA07A',
        0.5: '#87CEFA',
        0.75: '#FFA07A',
        1.0: '#001f3f',
      },
      getDayFraction(time),
    );

    setGradient({
      background: `linear-gradient(
        0deg,
        rgba(${gradientRGB.join(', ')}, 1) 0%,
        rgba(15, 15, 15, 1) 90%
      )`,
    });
  }, [time]);

  return (
    <div className="clock" style={gradient}>
      <h1>{time.toLocaleTimeString('pl-PL')}</h1>
      <div className="row">
        <FontAwesomeIcon icon={faCalendarDays} />
        <p>
          {time.toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
