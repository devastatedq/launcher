import { useEffect, useState } from 'react';
import { User } from '@/shared/types';
import Sidebar, { TabId, TAB_LABELS } from '../components/Sidebar';
import NewsCarousel from '../components/NewsCarousel';
import PlayButton from '../components/PlayButton';
import ProgressBar from '../components/ProgressBar';
import SettingsModal from '../components/SettingsModal';
import WindowControls from '../components/WindowControls';

const ONLINE = '12 487';

interface UpdateState {
  state: 'checking' | 'available' | 'none' | 'downloading' | 'ready';
  version?: string;
  percent?: number;
}

interface Props {
  user: User;
}

export default function MainScreen({ user }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ramAllocation, setRamAllocation] = useState(8192);
  const [activeTab, setActiveTab] = useState<TabId>('news');
  const [slide, setSlide] = useState(0);
  const [verifyFiles, setVerifyFiles] = useState(true);
  const [version, setVersion] = useState('1.0.1');
  const [update, setUpdate] = useState<UpdateState | null>(null);

  useEffect(() => {
    const savedRam = localStorage.getItem('ramAllocation');
    if (savedRam) setRamAllocation(Number(savedRam));

    const onProgress = (data: any) => {
      setProgress(data.progress ?? 0);
      setStatus(data.status ?? '');
    };
    const onGameStatus = (value: string) => setStatus(value);
    const onUpdate = (data: UpdateState) => setUpdate(data);

    window.electron?.on('download:progress', onProgress);
    window.electron?.on('game:status', onGameStatus);
    window.electron?.on('launcher:update', onUpdate);

    window.electron?.invoke('app:version').then((v: string) => setVersion(v)).catch(() => {});
    window.electron
      ?.invoke('launcher:update-state')
      .then((s: UpdateState | null) => {
        if (s) setUpdate(s);
      })
      .catch(() => {});

    checkAndDownload();

    return () => {
      window.electron?.off('download:progress', onProgress);
      window.electron?.off('game:status', onGameStatus);
      window.electron?.off('launcher:update', onUpdate);
    };
  }, []);

  const checkAndDownload = async () => {
    setDownloading(true);
    setStatus('Проверка обновлений...');

    if (!window.electron) {
      setStatus('Лаунчер доступен только в приложении');
      setDownloading(false);
      return;
    }

    const result = await window.electron.invoke('game:download');

    if (result.success) {
      setReady(true);
      setStatus('Готов к запуску');
    } else {
      setStatus('Ошибка загрузки: ' + result.error);
    }

    setDownloading(false);
  };

  const handlePlay = async () => {
    if (!ready || downloading || !window.electron) return;

    setStatus('Запуск игры...');
    const result = await window.electron.invoke('game:launch', {
      username: user.username,
      ram: ramAllocation,
    });

    if (!result.success) {
      setStatus('Ошибка запуска: ' + result.error);
    }
  };

  const handleSaveSettings = (newRam: number) => {
    setRamAllocation(newRam);
    localStorage.setItem('ramAllocation', newRam.toString());
  };

  const initial = user.username?.[0]?.toUpperCase() ?? 'T';

  return (
    <div className="t9-screen t9-screen--main">
      <div className="t9-drag" onDoubleClick={() => window.electron?.invoke('window:toggle-maximize')} />
      <WindowControls />

      <div className="t9-main-frame">
        <div className="t9-player">
          <div className="t9-avatar">{initial}</div>
          <div className="t9-player-meta">
            <div className="t9-player-name">
              {user.username}
              <span className="t9-online-dot" />
            </div>
            <div className="t9-player-online">Онлайн: {ONLINE}</div>
          </div>
          <div className="t9-player-crest">♛</div>
        </div>

        <div className="t9-logo">
          <span className="t9-logo-text">TRIMIRA</span>
        </div>

        <Sidebar active={activeTab} onChange={setActiveTab} onSettings={() => setShowSettings(true)} />

        <div className="t9-content">
          {activeTab === 'news' ? (
            <NewsCarousel slide={slide} onChange={setSlide} />
          ) : (
            <div className="t9-placeholder">
              <div className="t9-placeholder-title">{TAB_LABELS[activeTab]}</div>
              <div className="t9-placeholder-sub">Раздел в разработке</div>
            </div>
          )}
        </div>

        <div className="t9-play-zone">
          <PlayButton onClick={handlePlay} disabled={!ready || downloading} loading={downloading} />
          <ProgressBar progress={progress} status={status} />
        </div>

        {update &&
          (update.state === 'available' ||
            update.state === 'downloading' ||
            update.state === 'ready') && (
            <div className="t9-update">
              {update.state === 'ready' ? (
                <button
                  className="t9-update-btn"
                  onClick={() => window.electron?.invoke('launcher:update-restart')}
                >
                  Обновление {update.version} готово — перезапустить
                </button>
              ) : (
                <span>
                  {update.state === 'downloading'
                    ? `Загрузка обновления… ${update.percent ?? 0}%`
                    : `Доступно обновление${update.version ? ` ${update.version}` : ''}…`}
                </span>
              )}
            </div>
          )}

        <footer className="t9-bottombar">
          <span className="t9-version">Версия: {version}</span>

          <label className="t9-check">
            <input
              type="checkbox"
              checked={verifyFiles}
              onChange={(e) => setVerifyFiles(e.target.checked)}
            />
            <span className="t9-box" />
            <span>Проверить целостность файлов</span>
          </label>

          <div className="t9-foot-right">
            <span className="t9-online">
              <span className="t9-online-dot" />
              Онлайн: {ONLINE}
            </span>
            <button className="t9-stats-btn" title="Статистика">
              ▥
            </button>
          </div>
        </footer>
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          currentRam={ramAllocation}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}
