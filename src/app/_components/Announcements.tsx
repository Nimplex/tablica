'use client';

import { useState } from 'react';
import './Announcements.css';

export default function Announcements() {
  const [content, setContent] = useState('');

  return (
    <div className="announcements">
      <h1>📢 Głos dyrekcji</h1>
      <span className="divider"></span>
      <div dangerouslySetInnerHTML={{ __html: content }} className="list"></div>
    </div>
  );
}
