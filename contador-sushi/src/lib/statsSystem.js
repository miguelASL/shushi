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
    playerNames: {
      p1: 'Jugador 1',
      p2: 'Jugador 2',
      p3: 'Jugador 3',
      p4: 'Jugador 4',
    },
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
      p3: raw.playerNames?.p3 || base.playerNames.p3,
      p4: raw.playerNames?.p4 || base.playerNames.p4,
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

  savePlayerNames(names) {
    const list = Array.isArray(names) ? names : [names?.p1, names?.p2, names?.p3, names?.p4];
    return StatsSystem.update((s) => {
      s.playerNames = {
        p1: (list[0] || 'Jugador 1').slice(0, 20),
        p2: (list[1] || 'Jugador 2').slice(0, 20),
        p3: (list[2] || s.playerNames.p3 || 'Jugador 3').slice(0, 20),
        p4: (list[3] || s.playerNames.p4 || 'Jugador 4').slice(0, 20),
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

  recordBattle({ players, winnerIndexes }) {
    return StatsSystem.update((s) => {
      const list = players || [];
      const total = list.reduce((sum, p) => sum + (p.count || 0), 0);
      s.totalSushi += total;
      s.totalBattles += 1;
      const winners = winnerIndexes || [];
      if (winners.length === 1) s.wins += 1;
      list.forEach((p) => {
        if (p.type && s.byType[p.type] !== undefined) s.byType[p.type] += p.count || 0;
      });
      s.history.unshift({
        mode: 'battle',
        players: list.map((p) => ({
          name: p.name,
          type: p.type,
          count: p.count,
        })),
        // legacy fields for old history rows
        counts: Object.fromEntries(list.map((p, i) => [`p${i + 1}`, p.count])),
        names: Object.fromEntries(list.map((p, i) => [`p${i + 1}`, p.name])),
        winner: winners.length === 1 ? winners[0] + 1 : 0,
        winnerIndexes: winners,
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
