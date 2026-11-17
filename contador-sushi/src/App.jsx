import { useEffect, useState } from 'react';
import { SoundSystem } from './lib/soundSystem';
import { StatsSystem } from './lib/statsSystem';
import Menu from './screens/Menu';
import Solo from './screens/Solo';
import Battle from './screens/Battle';
import Stats from './screens/Stats';

export default function App() {
  const [mode, setMode] = useState('menu');
  const [muted, setMuted] = useState(() => StatsSystem.getStats().muted);

  useEffect(() => {
    SoundSystem.setMuted(muted);
  }, [muted]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      StatsSystem.setMuted(next);
      SoundSystem.setMuted(next);
      return next;
    });
  };

  const shared = { muted, onToggleMute: toggleMute };

  return (
    <>
      {mode === 'menu' && <Menu onSelectMode={setMode} {...shared} />}
      {mode === 'solo' && <Solo onBack={() => setMode('menu')} {...shared} />}
      {mode === 'battle' && <Battle onBack={() => setMode('menu')} {...shared} />}
      {mode === 'stats' && <Stats onBack={() => setMode('menu')} {...shared} />}
    </>
  );
}
