import { TextPanel as TextPanelModel } from '@/lib/models/TextPanel';

import './TextPanel.css';

export default function TextPanel({ id }: { id: number }) {
  const textPanel = TextPanelModel.getById(id);

  return (
    <div className="text-panel">
      {textPanel ? (
        <>
          <h1>{textPanel.title}</h1>
          <span className="divider"></span>
          <div
            dangerouslySetInnerHTML={{ __html: textPanel.content }}
            className="list"
          ></div>
        </>
      ) : (
        <h1>
          TextPanel {id} nie istnieje w bazie danych, skontaktuj się z
          administratorem
        </h1>
      )}
    </div>
  );
}
