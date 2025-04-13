import { PulseLoader } from 'react-spinners';

import './Timetable.css';

export interface TimetableData {
  title: string;
}

export default function Timetable({ data }: { data?: TimetableData }) {
  return data ? (
    <div className="timetable">
      <h1>{data.title}</h1>
      <span className="divider"></span>
    </div>
  ) : (
    <div className="loading">
      <PulseLoader size={'20px'} color={'#fafafa'} />
    </div>
  );
}
