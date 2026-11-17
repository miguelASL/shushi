import { useEffect, useRef, useState } from 'react';
import { getAppetiteMessage } from '../data/sushiTypes';
import { getStreakMessage, STREAK_WINDOW_MS } from '../data/streakMessages';
import SushiCharacter from '../components/SushiCharacter';
import Button from '../components/ui/Button';
import Confetti from '../components/ui/Confetti';
import MuteToggle from '../components/ui/MuteToggle';
import ScreenShell from '../components/ui/ScreenShell';
import Sparkles from '../components/ui/Sparkles';
import SushiPicker from '../components/ui/SushiPicker';
import { SoundSystem } from '../lib/soundSystem';
import { StatsSystem } from '../lib/statsSystem';

const MILESTONES = [5, 10, 15, 20, 30, 50];

function SoloSelection({ onSelect, onBack, muted, onToggleMute }) {
  const [selected, setSelected] = useState(null);

  return (
    <ScreenShell className="items-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={onBack}>
        ← Volver
      </button>

      <div className="mx-auto mt-14 w-full max-w-3xl animate-menu-in">
        <h1 className="mb-2 text-center font-display text-3xl text-ink sm:text-4xl">Elige tu sushi</h1>
        <p className="mb-8 text-center text-ink/60">Un personaje para acompañarte en la sesión</p>
        <SushiPicker selected={selected} onSelect={setSelected} />
        <div className="mt-8 flex justify-center">
          <Button disabled={!selected} onClick={() => onSelect(selected)} className="px-12 text-lg">
            ¡Comenzar!
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

function SoloResults({ count, type, onReset, onBack, muted, onToggleMute }) {
  return (
    <ScreenShell className="relative items-center justify-center overflow-hidden">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <Confetti active />
      <div className="relative z-10 flex flex-col items-center text-center animate-celebrate">
        <SushiCharacter type={type} size={180} mood="excited" />
        <h1 className="mt-4 font-display text-4xl text-ink">¡Qué rico!</h1>
        <p className="mt-2 font-display text-6xl text-salmon">{count}</p>
        <p className="mt-1 text-lg text-ink/65">
          {count === 1 ? 'pieza de sushi' : 'piezas de sushi'}
        </p>
        <p className="mt-4 text-xl font-bold text-nori">{getAppetiteMessage(count)}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={onReset}>Comer más</Button>
          <Button variant="ghost" onClick={onBack}>
            Menú
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

export default function Solo({ onBack, muted, onToggleMute }) {
  const [stage, setStage] = useState('select');
  const [selectedType, setSelectedType] = useState('salmon');
  const [count, setCount] = useState(0);
  const [mood, setMood] = useState('idle');
  const [showSparkle, setShowSparkle] = useState(false);
  const [flash, setFlash] = useState('');
  const [streak, setStreak] = useState(0);
  const lastEatRef = useRef(0);
  const streakRef = useRef(0);

  const showFlash = (text) => {
    setFlash(text);
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlash(''), 1600);
  };

  const handleCount = () => {
    const now = Date.now();
    const nextStreak =
      now - lastEatRef.current <= STREAK_WINDOW_MS ? streakRef.current + 1 : 1;
    lastEatRef.current = now;
    streakRef.current = nextStreak;
    setStreak(nextStreak);

    setCount((c) => {
      const next = c + 1;
      const streakMsg = getStreakMessage(nextStreak);
      if (streakMsg) {
        SoundSystem.playStreak(nextStreak);
        showFlash(streakMsg);
      } else if (MILESTONES.includes(next)) {
        SoundSystem.playMilestone();
        showFlash(`¡${next} piezas!`);
      }
      return next;
    });
    setMood(nextStreak >= 5 ? 'excited' : 'happy');
    setShowSparkle(true);
    SoundSystem.playEat();
    if (navigator.vibrate) navigator.vibrate(nextStreak >= 5 ? [12, 40, 12] : 12);
    setTimeout(() => setMood('idle'), 450);
    setTimeout(() => setShowSparkle(false), 700);
  };

  const handleUndo = () => {
    setCount((c) => Math.max(0, c - 1));
    streakRef.current = 0;
    setStreak(0);
    lastEatRef.current = 0;
  };

  const handleFinish = () => {
    StatsSystem.recordSolo({ count, type: selectedType });
    SoundSystem.playBurp();
    setTimeout(() => SoundSystem.playWin(), 350);
    setStage('finished');
  };

  const handleReset = () => {
    setCount(0);
    setMood('idle');
    setFlash('');
    setStreak(0);
    streakRef.current = 0;
    lastEatRef.current = 0;
    setStage('playing');
  };

  useEffect(() => {
    if (stage !== 'playing') return undefined;
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.key === '+') {
        e.preventDefault();
        handleCount();
      }
      if (e.key === 'Backspace' || e.key === '-') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage]);

  if (stage === 'select') {
    return (
      <SoloSelection
        muted={muted}
        onToggleMute={onToggleMute}
        onBack={onBack}
        onSelect={(type) => {
          setSelectedType(type);
          setStage('playing');
        }}
      />
    );
  }

  if (stage === 'finished') {
    return (
      <SoloResults
        count={count}
        type={selectedType}
        onReset={handleReset}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
      />
    );
  }

  return (
    <ScreenShell className="items-center justify-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={onBack}>
        ← Volver
      </button>

      <div className="flex w-full max-w-md flex-col items-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-ink/50">Sushi comidos</p>
        <p className="font-display text-7xl text-salmon tabular-nums" aria-live="polite">
          {count}
        </p>
        {streak >= 2 && (
          <p className="text-sm font-extrabold text-gold" aria-live="polite">
            Racha x{streak}
          </p>
        )}
        {flash && (
          <p className="mt-1 max-w-xs text-center font-display text-lg text-nori animate-celebrate" aria-live="polite">
            {flash}
          </p>
        )}
        <p className="mt-1 text-xs text-ink/45">Espacio = +1 · Backspace = −1 · racha si comes rápido</p>

        <div className="relative my-6">
          {showSparkle && (
            <>
              <Sparkles className="absolute -left-3 -top-2 text-gold animate-ping" size={28} />
              <Sparkles className="absolute -right-3 -top-2 text-gold animate-ping" size={28} />
            </>
          )}
          <SushiCharacter type={selectedType} size={200} mood={mood} showLabel />
        </div>

        <Button className="w-full max-w-xs py-5 text-xl" onClick={handleCount} aria-label="Comer sushi">
          +1 Comer sushi
        </Button>

        {count > 0 && (
          <>
            <button
              type="button"
              className="btn-ghost mt-2"
              onClick={handleUndo}
              aria-label="Deshacer última pieza"
            >
              −1 Deshacer
            </button>
            <Button variant="secondary" className="mt-3 w-full max-w-xs" onClick={handleFinish}>
              Ya estoy lleno
            </Button>
            <p className="mt-6 text-center text-lg font-semibold text-ink/70">
              {getAppetiteMessage(count)}
            </p>
          </>
        )}
      </div>
    </ScreenShell>
  );
}
