export default function MuteToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="btn-ghost absolute right-4 top-4 z-20 text-sm sm:right-6 sm:top-6"
      aria-pressed={muted}
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
    >
      {muted ? 'Sonido off' : 'Sonido on'}
    </button>
  );
}
