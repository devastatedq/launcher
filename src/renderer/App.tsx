import { useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import { User } from '@/shared/types';
import { loadLauncherAssets } from './assets/launcherAssets';
import type { LauncherAssets } from './assets/launcherAssets';
import bg from '../../resources/backgrounds/bg.png';

const BASE_W = 1600;
const BASE_H = 900;

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scale, setScale] = useState(1);
  const [assets, setAssets] = useState<LauncherAssets>({ newsArt: [] });

  useEffect(() => {
    const resize = () => {
      setScale(Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    let alive = true;
    loadLauncherAssets().then((loaded) => {
      if (alive) setAssets(loaded);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="t9-root">
      <div
        className={`t9-bg ${currentUser ? 't9-bg--clear' : 't9-bg--blur'}`}
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className={`t9-veil ${currentUser ? 't9-veil--clear' : ''}`} />

      <div
        className="t9-stage"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {!currentUser ? (
          <LoginScreen onLogin={setCurrentUser} assets={assets} />
        ) : (
          <MainScreen user={currentUser} assets={assets} />
        )}
      </div>
    </div>
  );
}

export default App;
