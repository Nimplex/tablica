'use client';

import { useState } from 'react';
import Card from './_components/Card';
import Timetable, { TimetableData } from './_components/Timetable';
import Announcements from './_components/Announcements';
import Clock from './_components/Clock';
import Weather from './_components/Weather';

export default function Home() {
  const [firstCard, setFirstCards] = useState<TimetableData | null>(null);
  const [secondCard, setSecondCards] = useState<TimetableData | null>(null);
  const [thirdCard, setThirdCards] = useState<TimetableData | null>(null);

  return (
    <div className="standard-grid">
      <Card>
        <Timetable data={firstCard} background="#8D94BAce" />
        <Weather />
      </Card>
      <Card>
        <Timetable data={secondCard} background="#9A7AA0ce" />
      </Card>
      <Card>
        <Timetable data={thirdCard} background="#87677Bce" />
      </Card>
      <Card>
        <Announcements />
        <Clock />
      </Card>
    </div>
  );
}
