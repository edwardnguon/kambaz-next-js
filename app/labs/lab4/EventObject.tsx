"use client"
import { useState } from "react";
export default function EventObject() {
  const [event, setEvent] = useState<any>(null);
  const handleClick = (e: any) => {
    e.preventDefault();
    setEvent({
      type: e.type,
      clientX: e.clientX,
      clientY: e.clientY,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
    });
  };
  return (
    <div id="wd-event-object">
      <h2>Event Object</h2>
      <button onClick={handleClick}
        id="wd-event-object-click"
        className="btn btn-primary">
        Display Event Info
      </button>
      {event && (
        <pre>{JSON.stringify(event, null, 2)}</pre>
      )}
      <hr />
    </div>
  );
}
