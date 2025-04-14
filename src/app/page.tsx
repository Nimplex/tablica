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
        <Timetable data={firstCard} background="#8D94BAea" />
      </Card>
      <Card>
        <Timetable data={secondCard} background="#9A7AA0ea" />
      </Card>
      <Card>
        <Timetable data={thirdCard} background="#87677Bea" />
      </Card>
      <Card>
        <Announcements />
        <Clock />
      </Card>
    </div>
  );
}