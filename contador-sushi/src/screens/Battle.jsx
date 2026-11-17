import { useCallback, useEffect, useRef, useState } from 'react';
import { SUSHI_TYPES } from '../data/sushiTypes';
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

const END_QUIPS = [
  '¡Se acabó el sushi… por ahora!',
  'Cuentas cerradas. Barrigas contentas.',
  'Fin del combate. Wasabi en alto.',
  '¡Tabla limpia! A revisar el marcador.',
];

function BattleSetup({ onSelect, onBack, muted, onToggleMute }) {
  const saved = StatsSystem.getStats().playerNames;
  const [player1Sushi, setPlayer1Sushi] = useState(null);
  const [player2Sushi, setPlayer2Sushi] = useState(null);
  const [player1Name, setPlayer1Name] = useState(saved.p1);
  const [player2Name, setPlayer2Name] = useState(saved.p2);

  const canStart = player1Sushi && player2Sushi;

  return (
    <ScreenShell className="items-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={onBack}>
        ← Volver
      </button>

      <div className="mx-auto mt-14 w-full max-w-5xl animate-menu-in">
        <h1 className="mb-2 text-center font-display text-3xl text-ink sm:text-4xl">Batalla</h1>
        <p className="mb-8 text-center text-ink/60">Elige nombres y sushi. Contad a vuestro ritmo.</p>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
          <div className="rounded-3xl bg-rice/70 p-4 shadow-soft">
            <h2 className="mb-3 text-center text-xl font-extrabold text-[#2F6FED]">Jugador 1</h2>
            <label className="sr-only" htmlFor="p1-name">
              Nombre jugador 1
            </label>
            <input
              id="p1-name"
              value={player1Name}
              maxLength={20}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="mb-4 w-full rounded-xl border-2 border-[#2F6FED]/40 bg-white px-3 py-2 text-center font-bold text-ink focus:border-[#2F6FED] focus:outline-none"
            />
            <SushiPicker
              selected={player1Sushi}
              onSelect={setPlayer1Sushi}
              accent="blue"
              columns="grid-cols-2"
            />
          </div>

          <div className="hidden items-center justify-center font-display text-3xl text-ink/30 lg:flex">
            VS
          </div>

          <div className="rounded-3xl bg-rice/70 p-4 shadow-soft">
            <h2 className="mb-3 text-center text-xl font-extrabold text-salmon">Jugador 2</h2>
            <label className="sr-only" htmlFor="p2-name">
              Nombre jugador 2
            </label>
            <input
              id="p2-name"
              value={player2Name}
              maxLength={20}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="mb-4 w-full rounded-xl border-2 border-salmon/40 bg-white px-3 py-2 text-center font-bold text-ink focus:border-salmon focus:outline-none"
            />
            <SushiPicker
              selected={player2Sushi}
              onSelect={setPlayer2Sushi}
              columns="grid-cols-2"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            disabled={!canStart}
            className="px-12 text-lg"
            onClick={() =>
              onSelect({
                p1: player1Sushi,
                p2: player2Sushi,
                name1: player1Name.trim() || 'Jugador 1',
                name2: player2Name.trim() || 'Jugador 2',
              })
            }
          >
            ¡Comenzar batalla!
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

function BattleResults({
  player1Type,
  player2Type,
  player1Name,
  player2Name,
  player1Count,
  player2Count,
  winner,
  onReset,
  onBack,
  muted,
  onToggleMute,
}) {
  useEffect(() => {
    if (winner === 0) SoundSystem.playTie();
    else SoundSystem.playWin();
  }, [winner]);

  const margin = Math.abs(player1Count - player2Count);
  const total = player1Count + player2Count;

  return (
    <ScreenShell className="relative items-center justify-center overflow-hidden">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <Confetti active />
      <div className="relative z-10 w-full max-w-3xl text-center animate-celebrate">
        {winner === 0 ? (
          <>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">¡Empate!</h1>
            <p className="mt-2 text-ink/60">Misma hambre, mismo honor</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">¡Ganador!</h1>
            <p className="mt-2 text-2xl font-extrabold text-salmon">
              {winner === 1 ? player1Name : player2Name}
            </p>
            {margin > 0 && (
              <p className="mt-1 text-sm font-semibold text-ink/50">
                Ventaja de {margin} {margin === 1 ? 'pieza' : 'piezas'}
              </p>
            )}
          </>
        )}
        <p className="mt-3 text-sm font-semibold text-ink/45">
          {total} piezas en total entre los dos
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div
            className={`rounded-3xl p-5 ${
              winner === 1 ? 'animate-winner-glow bg-[#2F6FED] text-white' : 'bg-rice/80'
            }`}
          >
            <SushiCharacter type={player1Type} size={120} mood={winner === 1 ? 'excited' : 'idle'} />
            <p className="mt-2 font-bold">{player1Name}</p>
            <p className="text-sm opacity-70">{SUSHI_TYPES[player1Type].name}</p>
            <p className="font-display text-5xl">{player1Count}</p>
          </div>
          <div className="font-display text-2xl text-ink/30">VS</div>
          <div
            className={`rounded-3xl p-5 ${
              winner === 2 ? 'animate-winner-glow bg-salmon text-white' : 'bg-rice/80'
            }`}
          >
            <SushiCharacter type={player2Type} size={120} mood={winner === 2 ? 'excited' : 'idle'} />
            <p className="mt-2 font-bold">{player2Name}</p>
            <p className="text-sm opacity-70">{SUSHI_TYPES[player2Type].name}</p>
            <p className="font-display text-5xl">{player2Count}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={onReset}>Nueva batalla</Button>
          <Button variant="ghost" onClick={onBack}>
            Menú
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

function LeadBar({ p1, p2, name1, name2 }) {
  const total = p1 + p2;
  const p1Pct = total === 0 ? 50 : Math.round((p1 / total) * 100);
  const lead =
    p1 === p2 ? 'Empate' : p1 > p2 ? `Va ganando ${name1}` : `Va ganando ${name2}`;

  return (
    <div className="mx-auto mb-6 w-full max-w-xl">
      <p className="mb-2 text-center text-sm font-bold text-ink/60" aria-live="polite">
        {lead}
        {p1 !== p2 && (
          <span className="text-ink/40"> · diferencia {Math.abs(p1 - p2)}</span>
        )}
      </p>
      <div className="flex h-3 overflow-hidden rounded-full bg-mist" role="img" aria-label={lead}>
        <div
          className="h-full bg-[#2F6FED] transition-all duration-300"
          style={{ width: `${p1Pct}%` }}
        />
        <div
          className="h-full bg-salmon transition-all duration-300"
          style={{ width: `${100 - p1Pct}%` }}
        />
      </div>
    </div>
  );
}

function BattleEnding({ quip, p1, p2, name1, name2 }) {
  return (
    <ScreenShell className="relative items-center justify-center overflow-hidden">
      <Confetti active count={36} />
      <div className="relative z-10 text-center animate-celebrate">
        <p className="font-display text-5xl text-ink sm:text-6xl">¡Fin!</p>
        <p className="mt-3 text-lg font-semibold text-ink/65">{quip}</p>
        <p className="mt-6 font-display text-3xl text-ink/80">
          <span className="text-[#2F6FED]">{name1} {p1}</span>
          <span className="mx-3 text-ink/30">·</span>
          <span className="text-salmon">{name2} {p2}</span>
        </p>
        <p className="mt-4 text-sm text-ink/45">Preparando el resultado…</p>
      </div>
    </ScreenShell>
  );
}

export default function Battle({ onBack, muted, onToggleMute }) {
  const [stage, setStage] = useState('select');
  const [player1Type, setPlayer1Type] = useState(null);
  const [player2Type, setPlayer2Type] = useState(null);
  const [player1Name, setPlayer1Name] = useState('Jugador 1');
  const [player2Name, setPlayer2Name] = useState('Jugador 2');
  const [player1Count, setPlayer1Count] = useState(0);
  const [player2Count, setPlayer2Count] = useState(0);
  const [mood1, setMood1] = useState('idle');
  const [mood2, setMood2] = useState('idle');
  const [spark1, setSpark1] = useState(false);
  const [spark2, setSpark2] = useState(false);
  const [streak1, setStreak1] = useState(0);
  const [streak2, setStreak2] = useState(0);
  const [battleActive, setBattleActive] = useState(true);
  const [flash, setFlash] = useState('');
  const [endQuip, setEndQuip] = useState('');
  const finishedRef = useRef(false);
  const countsRef = useRef({ p1: 0, p2: 0 });
  const streakRef = useRef({ p1: 0, p2: 0, t1: 0, t2: 0 });

  const winner =
    player1Count > player2Count ? 1 : player2Count > player1Count ? 2 : 0;

  const showFlash = (text) => {
    setFlash(text);
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlash(''), 1600);
  };

  const finishBattle = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setBattleActive(false);
    const { p1, p2 } = countsRef.current;
    const w = p1 > p2 ? 1 : p2 > p1 ? 2 : 0;
    StatsSystem.recordBattle({
      p1Count: p1,
      p2Count: p2,
      p1Type: player1Type,
      p2Type: player2Type,
      winner: w,
      names: { p1: player1Name, p2: player2Name },
    });
    setEndQuip(END_QUIPS[Math.floor(Math.random() * END_QUIPS.length)]);
    SoundSystem.playBattleEnd();
    setTimeout(() => SoundSystem.playBurp(), 500);
    setStage('ending');
  }, [player1Type, player2Type, player1Name, player2Name]);

  useEffect(() => {
    if (stage !== 'ending') return undefined;
    const t = setTimeout(() => setStage('finished'), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  const bump = useCallback((player) => {
    if (!battleActive) return;
    const now = Date.now();
    const key = player === 1 ? 'p1' : 'p2';
    const tKey = player === 1 ? 't1' : 't2';
    const nextStreak =
      now - streakRef.current[tKey] <= STREAK_WINDOW_MS
        ? streakRef.current[key] + 1
        : 1;
    streakRef.current[key] = nextStreak;
    streakRef.current[tKey] = now;
    if (player === 1) setStreak1(nextStreak);
    else setStreak2(nextStreak);

    const name = player === 1 ? player1Name : player2Name;
    const streakMsg = getStreakMessage(nextStreak);

    if (player === 1) {
      setPlayer1Count((c) => {
        const next = c + 1;
        countsRef.current.p1 = next;
        if (streakMsg) {
          SoundSystem.playStreak(nextStreak);
          showFlash(`${name}: ${streakMsg}`);
        } else if (MILESTONES.includes(next)) {
          SoundSystem.playMilestone();
          showFlash(`${name}: ¡${next}!`);
        }
        return next;
      });
      setMood1(nextStreak >= 5 ? 'excited' : 'happy');
      setSpark1(true);
      setTimeout(() => setMood1('idle'), 400);
      setTimeout(() => setSpark1(false), 650);
    } else {
      setPlayer2Count((c) => {
        const next = c + 1;
        countsRef.current.p2 = next;
        if (streakMsg) {
          SoundSystem.playStreak(nextStreak);
          showFlash(`${name}: ${streakMsg}`);
        } else if (MILESTONES.includes(next)) {
          SoundSystem.playMilestone();
          showFlash(`${name}: ¡${next}!`);
        }
        return next;
      });
      setMood2(nextStreak >= 5 ? 'excited' : 'happy');
      setSpark2(true);
      setTimeout(() => setMood2('idle'), 400);
      setTimeout(() => setSpark2(false), 650);
    }
    SoundSystem.playEat();
    if (navigator.vibrate) navigator.vibrate(nextStreak >= 5 ? [10, 30, 10] : 10);
  }, [battleActive, player1Name, player2Name]);

  const undo = useCallback((player) => {
    if (!battleActive) return;
    if (player === 1) {
      setPlayer1Count((c) => {
        const next = Math.max(0, c - 1);
        countsRef.current.p1 = next;
        return next;
      });
      streakRef.current.p1 = 0;
      streakRef.current.t1 = 0;
      setStreak1(0);
    } else {
      setPlayer2Count((c) => {
        const next = Math.max(0, c - 1);
        countsRef.current.p2 = next;
        return next;
      });
      streakRef.current.p2 = 0;
      streakRef.current.t2 = 0;
      setStreak2(0);
    }
  }, [battleActive]);

  useEffect(() => {
    if (stage !== 'battle' || !battleActive) return undefined;
    const onKey = (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === 'a') bump(1);
      if (k === 'l') bump(2);
      if (k === 'z') undo(1);
      if (k === 'm') undo(2);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, battleActive, bump, undo]);

  const handleBack = () => {
    if (
      stage === 'battle' &&
      battleActive &&
      (player1Count > 0 || player2Count > 0) &&
      !window.confirm('¿Salir de la batalla? Se perderá el conteo actual.')
    ) {
      return;
    }
    onBack();
  };

  if (stage === 'select') {
    return (
      <BattleSetup
        muted={muted}
        onToggleMute={onToggleMute}
        onBack={onBack}
        onSelect={({ p1, p2, name1, name2 }) => {
          setPlayer1Type(p1);
          setPlayer2Type(p2);
          setPlayer1Name(name1);
          setPlayer2Name(name2);
          StatsSystem.savePlayerNames(name1, name2);
          countsRef.current = { p1: 0, p2: 0 };
          streakRef.current = { p1: 0, p2: 0, t1: 0, t2: 0 };
          finishedRef.current = false;
          setPlayer1Count(0);
          setPlayer2Count(0);
          setStreak1(0);
          setStreak2(0);
          setBattleActive(true);
          setFlash('');
          setStage('battle');
        }}
      />
    );
  }

  if (stage === 'ending') {
    return (
      <BattleEnding
        quip={endQuip}
        p1={player1Count}
        p2={player2Count}
        name1={player1Name}
        name2={player2Name}
      />
    );
  }

  if (stage === 'finished') {
    return (
      <BattleResults
        player1Type={player1Type}
        player2Type={player2Type}
        player1Name={player1Name}
        player2Name={player2Name}
        player1Count={player1Count}
        player2Count={player2Count}
        winner={winner}
        onReset={() => {
          finishedRef.current = false;
          setStage('select');
          setBattleActive(true);
        }}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
      />
    );
  }

  return (
    <ScreenShell className="items-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={handleBack}>
        ← Volver
      </button>

      <div className="mx-auto mt-12 w-full max-w-4xl">
        <div className="mb-4 text-center">
          <h1 className="font-display text-3xl text-ink">Batalla</h1>
          <p className="mt-2 text-sm text-ink/50">
            Contar: A / L · Deshacer: Z / M
          </p>
        </div>

        <LeadBar
          p1={player1Count}
          p2={player2Count}
          name1={player1Name}
          name2={player2Name}
        />

        {flash && (
          <p className="mb-4 text-center font-display text-2xl text-nori animate-celebrate" aria-live="polite">
            {flash}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div
            className={`flex flex-col items-center rounded-3xl bg-rice/70 p-5 shadow-soft transition ring-4 ${
              player1Count > player2Count ? 'ring-[#2F6FED]/40' : 'ring-transparent'
            }`}
          >
            <h3 className="text-xl font-extrabold text-[#2F6FED]">{player1Name}</h3>
            <p className="font-display text-6xl text-[#2F6FED] tabular-nums" aria-live="polite">
              {player1Count}
            </p>
            {streak1 >= 2 && (
              <p className="text-sm font-extrabold text-gold">Racha x{streak1}</p>
            )}
            <div className="relative my-3">
              {spark1 && <Sparkles className="absolute -left-2 -top-2 text-[#2F6FED] animate-ping" />}
              <SushiCharacter type={player1Type} size={140} mood={mood1} />
            </div>
            <Button
              variant="player1"
              className="w-full max-w-[220px] py-5 text-xl"
              disabled={!battleActive}
              onClick={() => bump(1)}
            >
              +1 Comer
            </Button>
            <button
              type="button"
              className="btn-ghost mt-2 text-sm"
              disabled={!battleActive || player1Count === 0}
              onClick={() => undo(1)}
              aria-label={`Deshacer último de ${player1Name}`}
            >
              −1 Deshacer
            </button>
          </div>

          <div className="hidden font-display text-3xl text-ink/25 sm:block">VS</div>

          <div
            className={`flex flex-col items-center rounded-3xl bg-rice/70 p-5 shadow-soft transition ring-4 ${
              player2Count > player1Count ? 'ring-salmon/40' : 'ring-transparent'
            }`}
          >
            <h3 className="text-xl font-extrabold text-salmon">{player2Name}</h3>
            <p className="font-display text-6xl text-salmon tabular-nums" aria-live="polite">
              {player2Count}
            </p>
            {streak2 >= 2 && (
              <p className="text-sm font-extrabold text-gold">Racha x{streak2}</p>
            )}
            <div className="relative my-3">
              {spark2 && <Sparkles className="absolute -right-2 -top-2 text-salmon animate-ping" />}
              <SushiCharacter type={player2Type} size={140} mood={mood2} />
            </div>
            <Button
              variant="player2"
              className="w-full max-w-[220px] py-5 text-xl"
              disabled={!battleActive}
              onClick={() => bump(2)}
            >
              +1 Comer
            </Button>
            <button
              type="button"
              className="btn-ghost mt-2 text-sm"
              disabled={!battleActive || player2Count === 0}
              onClick={() => undo(2)}
              aria-label={`Deshacer último de ${player2Name}`}
            >
              −1 Deshacer
            </button>
          </div>
        </div>

        {battleActive && (player1Count > 0 || player2Count > 0) && (
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={finishBattle}>
              Terminar batalla
            </Button>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
