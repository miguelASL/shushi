import { SUSHI_KEYS } from '../data/sushiTypes';

const KEY = 'sushiStats';

const emptyByType = () =>
  SUSHI_KEYS.reduce((acc, k) => {
    acc[k] = 0;
    return acc;
  }, {});

function defaults() {
  return {
    totalSushi: 0,
    totalBattles: 0,
    wins: 0,
    bestSolo: 0,
    muted: false,
    playerNames: { p1: 'Jugador 1', p2: 'Jugador 2' },
    byType: emptyByType(),
    history: [],
  };
}

function normalize(raw) {
  const base = defaults();
  if (!raw || typeof raw !== 'object') return base;
  return {
    ...base,
    ...raw,
    byType: { ...emptyByType(), ...(raw.byType || {}) },
    playerNames: {
      p1: raw.playerNames?.p1 || base.playerNames.p1,
      p2: raw.playerNames?.p2 || base.playerNames.p2,
    },
    history: Array.isArray(raw.history) ? raw.history.slice(0, 20) : [],
  };
}

export const StatsSystem = {
  getStats() {
    try {
      const raw = localStorage.getItem(KEY);
      return normalize(raw ? JSON.parse(raw) : null);
    } catch {
      return defaults();
    }
  },

  saveStats(stats) {
    localStorage.setItem(KEY, JSON.stringify(normalize(stats)));
  },

  update(mutator) {
    const stats = StatsSystem.getStats();
    mutator(stats);
    StatsSystem.saveStats(stats);
    return stats;
  },

  setMuted(muted) {
    return StatsSystem.update((s) => {
      s.muted = muted;
    });
  },

  savePlayerNames(p1, p2) {
    return StatsSystem.update((s) => {
      s.playerNames = {
        p1: (p1 || 'Jugador 1').slice(0, 20),
        p2: (p2 || 'Jugador 2').slice(0, 20),
      };
    });
  },

  recordSolo({ count, type }) {
    return StatsSystem.update((s) => {
      s.totalSushi += count;
      if (count > s.bestSolo) s.bestSolo = count;
      if (type && s.byType[type] !== undefined) s.byType[type] += count;
      s.history.unshift({
        mode: 'solo',
        counts: { solo: count },
        type,
        winner: null,
        at: Date.now(),
      });
      s.history = s.history.slice(0, 20);
    });
  },

  recordBattle({ p1Count, p2Count, p1Type, p2Type, winner, names }) {
    return StatsSystem.update((s) => {
      const total = p1Count + p2Count;
      s.totalSushi += total;
      s.totalBattles += 1;
      if (winner !== 0) s.wins += 1;
      if (p1Type && s.byType[p1Type] !== undefined) s.byType[p1Type] += p1Count;
      if (p2Type && s.byType[p2Type] !== undefined) s.byType[p2Type] += p2Count;
      s.history.unshift({
        mode: 'battle',
        counts: { p1: p1Count, p2: p2Count },
        types: { p1: p1Type, p2: p2Type },
        names,
        winner,
        at: Date.now(),
      });
      s.history = s.history.slice(0, 20);
    });
  },

  reset() {
    const muted = StatsSystem.getStats().muted;
    const names = StatsSystem.getStats().playerNames;
    const next = { ...defaults(), muted, playerNames: names };
    StatsSystem.saveStats(next);
    return next;
  },
};
