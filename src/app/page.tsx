'use client';

import { useState } from 'react';
import Card from './_components/Card';
import Clock from './_components/Clock';
import Announcements from './_components/Announcements';

export default function Home() {
  const [firstCard, setFirstCards] = useState({});
  const [secondCard, setSecondCards] = useState({});
  const [thirdCard, setThirdCards] = useState({});

  return (
    <div className="standard-grid">
      <Card>
        <></>
      </Card>
      <Card>
        <></>
      </Card>
      <Card>
        <></>
      </Card>
      <Card>
        <Announcements />
        <Clock />
      </Card>
    </div>
  );
}
