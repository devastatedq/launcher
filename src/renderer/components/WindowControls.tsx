function send(channel: string) {
  if (window.electron) void window.electron.invoke(channel);
}

export default function WindowControls() {
  return (
    <div className="t9-wincontrols">
      <button className="t9-winbtn" title="Свернуть" onClick={() => send('window:minimize')}>
        —
      </button>
      <button
        className="t9-winbtn t9-winbtn--close"
        title="Закрыть"
        onClick={() => send('window:close')}
      >
        ✕
      </button>
    </div>
  );
}
