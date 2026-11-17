import SushiCharacter from '../components/SushiCharacter';
import Button from '../components/ui/Button';
import MuteToggle from '../components/ui/MuteToggle';
import ScreenShell from '../components/ui/ScreenShell';

export default function Menu({ onSelectMode, muted, onToggleMute }) {
  return (
    <ScreenShell className="items-center justify-center overflow-hidden">
      <MuteToggle muted={muted} onToggle={onToggleMute} />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center animate-menu-in">
        <div className="mb-2">
          <SushiCharacter type="salmon" size={200} mood="idle" />
        </div>

        <h1 className="font-display text-5xl tracking-wide text-ink sm:text-6xl">Shushi</h1>
        <p className="mt-3 max-w-sm text-lg text-ink/65">
          Cuenta piezas, compite en batalla y guarda tus récords.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3">
          <Button className="w-full py-5 text-xl" onClick={() => onSelectMode('solo')}>
            Modo solitario
          </Button>
          <Button
            variant="secondary"
            className="w-full py-5 text-xl"
            onClick={() => onSelectMode('battle')}
          >
            Modo batalla
          </Button>
          <Button
            variant="ghost"
            className="w-full py-4 text-lg"
            onClick={() => onSelectMode('stats')}
          >
            Estadísticas
          </Button>
        </div>

        <p className="mt-10 text-sm font-semibold text-ink/45">
          Creado por <span className="text-nori">Miguel Sarmiento</span>
        </p>
      </div>
    </ScreenShell>
  );
}
