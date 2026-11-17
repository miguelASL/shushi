import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

const END_QUIPS = [
  '¡Se acabó el sushi… por ahora!',
  'Cuentas cerradas. Barrigas contentas.',
  'Fin del combate. Wasabi en alto.',
  '¡Tabla limpia! A revisar el marcador.',
];

const PLAYER_META = [
  {
    color: '#2F6FED',
    ring: 'ring-[#2F6FED]/40',
    border: 'border-[#2F6FED]/40',
    focus: 'focus:border-[#2F6FED]',
    text: 'text-[#2F6FED]',
    bgWin: 'bg-[#2F6FED]',
    bar: 'bg-[#2F6FED]',
    accent: 'blue',
    bumpKey: 'a',
    undoKey: 'z',
    keysLabel: 'A / Z',
    variant: 'player1',
  },
  {
    color: '#FF6B4A',
    ring: 'ring-salmon/40',
    border: 'border-salmon/40',
    focus: 'focus:border-salmon',
    text: 'text-salmon',
    bgWin: 'bg-salmon',
    bar: 'bg-salmon',
    accent: 'salmon',
    bumpKey: 's',
    undoKey: 'x',
    keysLabel: 'S / X',
    variant: 'player2',
  },
  {
    color: '#1F4D3A',
    ring: 'ring-nori/40',
    border: 'border-nori/40',
    focus: 'focus:border-nori',
    text: 'text-nori',
    bgWin: 'bg-nori',
    bar: 'bg-nori',
    accent: 'salmon',
    bumpKey: 'k',
    undoKey: ',',
    keysLabel: 'K / ,',
    variant: 'player3',
  },
  {
    color: '#E8A838',
    ring: 'ring-gold/40',
    border: 'border-gold/40',
    focus: 'focus:border-gold',
    text: 'text-gold',
    bgWin: 'bg-gold',
    bar: 'bg-gold',
    accent: 'salmon',
    bumpKey: 'l',
    undoKey: 'm',
    keysLabel: 'L / M',
    variant: 'player4',
  },
];

function defaultSlot(index, savedNames = {}) {
  const key = `p${index + 1}`;
  return {
    name: savedNames[key] || `Jugador ${index + 1}`,
    type: null,
  };
}

function getWinners(players) {
  if (!players.length) return [];
  const max = Math.max(...players.map((p) => p.count));
  if (max === 0) return [];
  return players.map((p, i) => (p.count === max ? i : -1)).filter((i) => i >= 0);
}

function BattleSetup({ onSelect, onBack, muted, onToggleMute }) {
  const saved = StatsSystem.getStats().playerNames;
  const [slots, setSlots] = useState(() => [
    defaultSlot(0, saved),
    defaultSlot(1, saved),
  ]);

  const canStart = slots.length >= MIN_PLAYERS && slots.every((s) => s.type);

  const updateSlot = (index, patch) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addPlayer = () => {
    if (slots.length >= MAX_PLAYERS) return;
    setSlots((prev) => [...prev, defaultSlot(prev.length, saved)]);
  };

  const removePlayer = (index) => {
    if (slots.length <= MIN_PLAYERS) return;
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScreenShell className="items-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={onBack}>
        ← Volver
      </button>

      <div className="mx-auto mt-14 w-full max-w-6xl animate-menu-in">
        <h1 className="mb-2 text-center font-display text-3xl text-ink sm:text-4xl">Batalla</h1>
        <p className="mb-4 text-center text-ink/60">
          De 2 a 4 jugadores. Contad a vuestro ritmo.
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-bold text-ink/50">{slots.length} jugadores</span>
          <Button
            variant="ghost"
            className="text-sm"
            disabled={slots.length >= MAX_PLAYERS}
            onClick={addPlayer}
          >
            + Añadir jugador
          </Button>
        </div>

        <div
          className={`grid gap-4 ${
            slots.length === 2
              ? 'md:grid-cols-2'
              : slots.length === 3
                ? 'md:grid-cols-3'
                : 'md:grid-cols-2 xl:grid-cols-4'
          }`}
        >
          {slots.map((slot, index) => {
            const meta = PLAYER_META[index];
            return (
              <div key={index} className="rounded-3xl bg-rice/70 p-4 shadow-soft">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className={`text-lg font-extrabold ${meta.text}`}>
                    Jugador {index + 1}
                  </h2>
                  {slots.length > MIN_PLAYERS && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-ink/40 hover:text-salmon"
                      onClick={() => removePlayer(index)}
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <label className="sr-only" htmlFor={`p${index}-name`}>
                  Nombre jugador {index + 1}
                </label>
                <input
                  id={`p${index}-name`}
                  value={slot.name}
                  maxLength={20}
                  onChange={(e) => updateSlot(index, { name: e.target.value })}
                  className={`mb-3 w-full rounded-xl border-2 bg-white px-3 py-2 text-center font-bold text-ink focus:outline-none ${meta.border} ${meta.focus}`}
                />
                <p className="mb-2 text-center text-xs text-ink/40">Teclas: {meta.keysLabel}</p>
                <SushiPicker
                  selected={slot.type}
                  onSelect={(type) => updateSlot(index, { type })}
                  accent={meta.accent}
                  columns="grid-cols-2"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            disabled={!canStart}
            className="px-12 text-lg"
            onClick={() =>
              onSelect(
                slots.map((s, i) => ({
                  name: (s.name || `Jugador ${i + 1}`).trim().slice(0, 20) || `Jugador ${i + 1}`,
                  type: s.type,
                }))
              )
            }
          >
            ¡Comenzar batalla!
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

function LeadBar({ players }) {
  const total = players.reduce((sum, p) => sum + p.count, 0);
  const winners = getWinners(players);
  const leadText =
    total === 0
      ? 'Empate a cero'
      : winners.length > 1
        ? `Empate arriba · ${winners.map((i) => players[i].name).join(' / ')}`
        : `Va ganando ${players[winners[0]].name}`;

  const max = Math.max(...players.map((p) => p.count), 0);
  const margin =
    winners.length === 1
      ? max - Math.max(...players.filter((_, i) => i !== winners[0]).map((p) => p.count), 0)
      : 0;

  return (
    <div className="mx-auto mb-6 w-full max-w-2xl">
      <p className="mb-2 text-center text-sm font-bold text-ink/60" aria-live="polite">
        {leadText}
        {margin > 0 && <span className="text-ink/40"> · ventaja {margin}</span>}
      </p>
      <div className="flex h-3 overflow-hidden rounded-full bg-mist" role="img" aria-label={leadText}>
        {players.map((p, i) => {
          const pct = total === 0 ? 100 / players.length : (p.count / total) * 100;
          return (
            <div
              key={i}
              className={`h-full transition-all duration-300 ${PLAYER_META[i].bar}`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function BattleEnding({ quip, players }) {
  return (
    <ScreenShell className="relative items-center justify-center overflow-hidden">
      <Confetti active count={36} />
      <div className="relative z-10 px-4 text-center animate-celebrate">
        <p className="font-display text-5xl text-ink sm:text-6xl">¡Fin!</p>
        <p className="mt-3 text-lg font-semibold text-ink/65">{quip}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 font-display text-2xl">
          {players.map((p, i) => (
            <span key={i} className="inline-flex items-center">
              <span className={PLAYER_META[i].text}>
                {p.name} {p.count}
              </span>
              {i < players.length - 1 && <span className="ml-2 text-ink/25">·</span>}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink/45">Preparando el resultado…</p>
      </div>
    </ScreenShell>
  );
}

function BattleResults({ players, onReset, onBack, muted, onToggleMute }) {
  const winners = useMemo(() => getWinners(players), [players]);
  const isTie = winners.length !== 1;
  const total = players.reduce((sum, p) => sum + p.count, 0);
  const max = Math.max(...players.map((p) => p.count), 0);
  const margin =
    winners.length === 1
      ? max - Math.max(...players.filter((_, i) => i !== winners[0]).map((p) => p.count), 0)
      : 0;

  useEffect(() => {
    if (isTie) SoundSystem.playTie();
    else SoundSystem.playWin();
  }, [isTie]);

  return (
    <ScreenShell className="relative items-center justify-center overflow-hidden">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <Confetti active />
      <div className="relative z-10 w-full max-w-5xl text-center animate-celebrate">
        {isTie ? (
          <>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">¡Empate!</h1>
            <p className="mt-2 text-ink/60">
              {winners.length > 1
                ? winners.map((i) => players[i].name).join(' · ')
                : 'Misma hambre, mismo honor'}
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">¡Ganador!</h1>
            <p className="mt-2 text-2xl font-extrabold text-salmon">
              {players[winners[0]].name}
            </p>
            {margin > 0 && (
              <p className="mt-1 text-sm font-semibold text-ink/50">
                Ventaja de {margin} {margin === 1 ? 'pieza' : 'piezas'}
              </p>
            )}
          </>
        )}
        <p className="mt-3 text-sm font-semibold text-ink/45">
          {total} piezas en total · {players.length} jugadores
        </p>

        <div
          className={`mt-8 grid gap-4 ${
            players.length <= 2
              ? 'sm:grid-cols-2'
              : players.length === 3
                ? 'sm:grid-cols-3'
                : 'sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {players.map((p, i) => {
            const won = winners.length === 1 && winners[0] === i;
            const meta = PLAYER_META[i];
            return (
              <div
                key={i}
                className={`rounded-3xl p-5 ${
                  won ? `animate-winner-glow text-white ${meta.bgWin}` : 'bg-rice/80'
                }`}
              >
                <SushiCharacter type={p.type} size={110} mood={won ? 'excited' : 'idle'} />
                <p className="mt-2 font-bold">{p.name}</p>
                <p className="text-sm opacity-70">{SUSHI_TYPES[p.type]?.name}</p>
                <p className="font-display text-4xl">{p.count}</p>
              </div>
            );
          })}
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

export default function Battle({ onBack, muted, onToggleMute }) {
  const [stage, setStage] = useState('select');
  const [players, setPlayers] = useState([]);
  const [battleActive, setBattleActive] = useState(true);
  const [flash, setFlash] = useState('');
  const [endQuip, setEndQuip] = useState('');
  const finishedRef = useRef(false);
  const countsRef = useRef([]);
  const streakRef = useRef([]);

  const showFlash = (text) => {
    setFlash(text);
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlash(''), 1600);
  };

  const finishBattle = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setBattleActive(false);

    const snapshot = players.map((p, i) => ({
      ...p,
      count: countsRef.current[i] ?? p.count,
    }));
    const winners = getWinners(snapshot);
    StatsSystem.recordBattle({
      players: snapshot.map((p) => ({
        name: p.name,
        type: p.type,
        count: p.count,
      })),
      winnerIndexes: winners,
    });
    setPlayers(snapshot);
    setEndQuip(END_QUIPS[Math.floor(Math.random() * END_QUIPS.length)]);
    SoundSystem.playBattleEnd();
    setTimeout(() => SoundSystem.playBurp(), 500);
    setStage('ending');
  }, [players]);

  useEffect(() => {
    if (stage !== 'ending') return undefined;
    const t = setTimeout(() => setStage('finished'), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  const bump = useCallback(
    (index) => {
      if (!battleActive) return;
      const now = Date.now();
      const streakState = streakRef.current[index] || { streak: 0, at: 0 };
      const nextStreak =
        now - streakState.at <= STREAK_WINDOW_MS ? streakState.streak + 1 : 1;
      streakRef.current[index] = { streak: nextStreak, at: now };

      setPlayers((prev) => {
        const next = prev.map((p, i) => {
          if (i !== index) return p;
          const count = p.count + 1;
          countsRef.current[i] = count;
          const streakMsg = getStreakMessage(nextStreak);
          if (streakMsg) {
            SoundSystem.playStreak(nextStreak);
            showFlash(`${p.name}: ${streakMsg}`);
          } else if (MILESTONES.includes(count)) {
            SoundSystem.playMilestone();
            showFlash(`${p.name}: ¡${count}!`);
          }
          return {
            ...p,
            count,
            streak: nextStreak,
            mood: nextStreak >= 5 ? 'excited' : 'happy',
            spark: true,
          };
        });
        return next;
      });

      SoundSystem.playEat();
      if (navigator.vibrate) navigator.vibrate(nextStreak >= 5 ? [10, 30, 10] : 10);
      window.setTimeout(() => {
        setPlayers((prev) =>
          prev.map((p, i) => (i === index ? { ...p, mood: 'idle', spark: false } : p))
        );
      }, 450);
    },
    [battleActive]
  );

  const undo = useCallback(
    (index) => {
      if (!battleActive) return;
      streakRef.current[index] = { streak: 0, at: 0 };
      setPlayers((prev) =>
        prev.map((p, i) => {
          if (i !== index) return p;
          const count = Math.max(0, p.count - 1);
          countsRef.current[i] = count;
          return { ...p, count, streak: 0 };
        })
      );
    },
    [battleActive]
  );

  useEffect(() => {
    if (stage !== 'battle' || !battleActive) return undefined;
    const onKey = (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      players.forEach((_, index) => {
        const meta = PLAYER_META[index];
        if (!meta) return;
        if (k === meta.bumpKey) bump(index);
        if (k === meta.undoKey) undo(index);
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, battleActive, players, bump, undo]);

  const handleBack = () => {
    const anyCount = players.some((p) => p.count > 0);
    if (
      stage === 'battle' &&
      battleActive &&
      anyCount &&
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
        onSelect={(slots) => {
          const next = slots.map((s) => ({
            name: s.name,
            type: s.type,
            count: 0,
            streak: 0,
            mood: 'idle',
            spark: false,
          }));
          StatsSystem.savePlayerNames(next.map((p) => p.name));
          countsRef.current = next.map(() => 0);
          streakRef.current = next.map(() => ({ streak: 0, at: 0 }));
          finishedRef.current = false;
          setPlayers(next);
          setBattleActive(true);
          setFlash('');
          setStage('battle');
        }}
      />
    );
  }

  if (stage === 'ending') {
    return <BattleEnding quip={endQuip} players={players} />;
  }

  if (stage === 'finished') {
    return (
      <BattleResults
        players={players}
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

  const winners = getWinners(players);
  const keysHint = players
    .map((_, i) => `P${i + 1}: ${PLAYER_META[i].keysLabel}`)
    .join(' · ');

  return (
    <ScreenShell className="items-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={handleBack}>
        ← Volver
      </button>

      <div className="mx-auto mt-12 w-full max-w-6xl">
        <div className="mb-4 text-center">
          <h1 className="font-display text-3xl text-ink">Batalla</h1>
          <p className="mt-2 text-sm text-ink/50">{keysHint}</p>
        </div>

        <LeadBar players={players} />

        {flash && (
          <p
            className="mb-4 text-center font-display text-2xl text-nori animate-celebrate"
            aria-live="polite"
          >
            {flash}
          </p>
        )}

        <div
          className={`grid gap-4 ${
            players.length === 2
              ? 'sm:grid-cols-2'
              : players.length === 3
                ? 'sm:grid-cols-3'
                : 'sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {players.map((p, index) => {
            const meta = PLAYER_META[index];
            const leading = winners.length === 1 && winners[0] === index;
            return (
              <div
                key={index}
                className={`flex flex-col items-center rounded-3xl bg-rice/70 p-4 shadow-soft transition ring-4 sm:p-5 ${
                  leading ? meta.ring : 'ring-transparent'
                }`}
              >
                <h3 className={`text-lg font-extrabold sm:text-xl ${meta.text}`}>{p.name}</h3>
                <p className={`font-display text-5xl tabular-nums sm:text-6xl ${meta.text}`} aria-live="polite">
                  {p.count}
                </p>
                {p.streak >= 2 && (
                  <p className="text-sm font-extrabold text-gold">Racha x{p.streak}</p>
                )}
                <div className="relative my-2">
                  {p.spark && (
                    <Sparkles
                      className="absolute -left-2 -top-2 animate-ping"
                      style={{ color: meta.color }}
                    />
                  )}
                  <SushiCharacter type={p.type} size={players.length > 2 ? 110 : 140} mood={p.mood} />
                </div>
                <Button
                  variant={meta.variant}
                  className="w-full max-w-[200px] py-4 text-lg"
                  disabled={!battleActive}
                  onClick={() => bump(index)}
                >
                  +1 Comer
                </Button>
                <button
                  type="button"
                  className="btn-ghost mt-2 text-sm"
                  disabled={!battleActive || p.count === 0}
                  onClick={() => undo(index)}
                  aria-label={`Deshacer último de ${p.name}`}
                >
                  −1 Deshacer
                </button>
              </div>
            );
          })}
        </div>

        {battleActive && players.some((p) => p.count > 0) && (
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
