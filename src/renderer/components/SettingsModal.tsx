import { useState } from 'react';

interface Props {
  onClose: () => void;
  currentRam: number;
  onSave: (ram: number) => void;
}

const PRESETS = [2048, 4096, 8192, 16384];

export default function SettingsModal({ onClose, currentRam, onSave }: Props) {
  const [ram, setRam] = useState(currentRam);

  return (
    <div
      className="t9-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="t9-modal t9-ornate">
        <div className="t9-modal-title">Настройки</div>

        <div className="t9-modal-label">Выделенная память (RAM)</div>
        <div className="t9-range-row">
          <input
            type="range"
            min={2048}
            max={16384}
            step={512}
            value={ram}
            onChange={(e) => setRam(Number(e.target.value))}
            className="t9-range"
          />
          <span className="t9-range-value">{(ram / 1024).toFixed(1)} GB</span>
        </div>

        <div className="t9-chips">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              className={`t9-chip ${ram === preset ? 'is-active' : ''}`}
              onClick={() => setRam(preset)}
            >
              {preset / 1024} GB
            </button>
          ))}
        </div>

        <div className="t9-modal-hint">Рекомендуется 4–8 GB для комфортной игры.</div>

        <div className="t9-modal-actions">
          <button
            className="t9-btn t9-btn--red"
            onClick={() => {
              onSave(ram);
              onClose();
            }}
          >
            Сохранить
          </button>
          <button className="t9-btn t9-btn--dark" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
