import Card from './_components/Card';
import TimetableComponent from './_components/Timetable';
import TextPanel from './_components/TextPanel';
import Clock from './_components/Clock';
import Weather from './_components/Weather';

import { BoardConfig } from '@/lib/models/BoardConfig';
import { ensureInitialized } from '@/lib/bootstrap';

export default async function App() {
  ensureInitialized();

  const boardConfig = BoardConfig.get();

  const layout = boardConfig.layout.columns.map((column, i) => (
    <Card key={i}>
      {column.map((element, j) => {
        switch (element.type) {
          case 'clock':
            return (
              <Clock
                displayDay={boardConfig.showWeekdayInClock}
                key={`${i}-${j}`}
              />
            );
          case 'text':
            return <TextPanel id={element.id} key={`${i}-${j}`} />;
          case 'timetable':
            return <TimetableComponent id={element.id} key={`${i}-${j}`} />;
          case 'weather':
            return <Weather key={`${i}-${j}`} />;
        }
      })}
    </Card>
  ));

  return (
    <main id="main-app">
      <div className="standard-grid">{layout}</div>
    </main>
  );
}
