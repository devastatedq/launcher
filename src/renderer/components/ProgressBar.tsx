interface Props {
  progress: number;
  status: string;
}

export default function ProgressBar({ progress, status }: Props) {
  const value = Math.max(0, Math.min(100, progress));

  return (
    <div className="t9-progress">
      <div className="t9-progress-track">
        <div className="t9-progress-fill" style={{ width: `${value}%` }} />
      </div>
      <div className="t9-progress-text">{status || 'Готов к запуску'}</div>
    </div>
  );
}
