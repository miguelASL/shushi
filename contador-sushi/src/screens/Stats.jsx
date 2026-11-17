import { useMemo, useState } from 'react';
import { SUSHI_TYPES } from '../data/sushiTypes';
import SushiCharacter from '../components/SushiCharacter';
import Button from '../components/ui/Button';
import MuteToggle from '../components/ui/MuteToggle';
import ScreenShell from '../components/ui/ScreenShell';
import { StatsSystem } from '../lib/statsSystem';

function formatWhen(ts) {
  try {
    return new Date(ts).toLocaleString('es', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function Stats({ onBack, muted, onToggleMute }) {
  const [stats, setStats] = useState(() => StatsSystem.getStats());

  const topTypes = useMemo(() => {
    return Object.entries(stats.byType || {})
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [stats]);

  const handleReset = () => {
    if (!window.confirm('¿Resetear estadísticas? Se conservan mute y nombres.')) return;
    setStats(StatsSystem.reset());
  };

  return (
    <ScreenShell className="items-center">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn-ghost absolute left-4 top-4 z-20" onClick={onBack}>
        ← Volver
      </button>

      <div className="mx-auto mt-14 w-full max-w-2xl animate-menu-in">
        <h1 className="mb-8 text-center font-display text-3xl text-ink sm:text-4xl">Estadísticas</h1>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: 'Total sushi', value: stats.totalSushi, tone: 'text-salmon' },
            { label: 'Batallas', value: stats.totalBattles, tone: 'text-nori' },
            { label: 'Victorias', value: stats.wins, tone: 'text-gold' },
            { label: 'Mejor solo', value: stats.bestSolo, tone: 'text-[#2F6FED]' },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl bg-rice/80 p-5 text-center shadow-soft">
              <p className={`font-display text-4xl ${card.tone}`}>{card.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink/55">{card.label}</p>
            </div>
          ))}
        </div>

        {topTypes.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-extrabold text-ink">Por tipo</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {topTypes.map(([key, n]) => (
                <div key={key} className="flex flex-col items-center rounded-2xl bg-rice/70 p-3">
                  <SushiCharacter type={key} size={72} />
                  <p className="mt-1 text-center text-xs font-bold">{SUSHI_TYPES[key].name}</p>
                  <p className="font-display text-xl text-salmon">{n}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {stats.history?.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-extrabold text-ink">Historial reciente</h2>
            <ul className="space-y-2">
              {stats.history.slice(0, 8).map((h, i) => (
                <li
                  key={`${h.at}-${i}`}
                  className="flex items-center justify-between rounded-2xl bg-rice/70 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-ink">
                    {h.mode === 'solo'
                      ? `Solo · ${h.counts?.solo ?? 0} piezas`
                      : (() => {
                          const score =
                            Array.isArray(h.players) && h.players.length
                              ? h.players.map((p) => p.count).join('–')
                              : `${h.counts?.p1 ?? 0}–${h.counts?.p2 ?? 0}`;
                          const winners = Array.isArray(h.winnerIndexes)
                            ? h.winnerIndexes
                            : h.winner
                              ? [h.winner - 1]
                              : [];
                          const winnerLabel =
                            winners.length === 1
                              ? ` · gana ${
                                  h.players?.[winners[0]]?.name ||
                                  h.names?.[`p${winners[0] + 1}`] ||
                                  `P${winners[0] + 1}`
                                }`
                              : winners.length > 1
                                ? ' (empate)'
                                : h.winner === 0
                                  ? ' (empate)'
                                  : '';
                          return `Batalla · ${score}${winnerLabel}`;
                        })()}
                  </span>
                  <span className="text-ink/45">{formatWhen(h.at)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={onBack}>
            Volver al menú
          </Button>
          <Button variant="ghost" className="flex-1" onClick={handleReset}>
            Resetear stats
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
