import { SUSHI_TYPES } from '../../data/sushiTypes';
import SushiCharacter from '../SushiCharacter';

export default function SushiPicker({
  selected,
  onSelect,
  accent = 'salmon',
  columns = 'grid-cols-2 sm:grid-cols-4',
}) {
  const ring =
    accent === 'blue'
      ? 'ring-[#2F6FED] bg-[#2F6FED]/10'
      : 'ring-salmon bg-salmon/10';

  return (
    <div className={`grid ${columns} gap-3`}>
      {Object.entries(SUSHI_TYPES).map(([key, sushi]) => {
        const isOn = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            aria-pressed={isOn}
            aria-label={sushi.name}
            className={`flex flex-col items-center rounded-2xl border-2 p-3 transition ${
              isOn
                ? `scale-[1.03] border-transparent shadow-soft ring-4 ${ring}`
                : 'border-ink/10 bg-rice/80 hover:border-ink/25 hover:bg-rice'
            }`}
          >
            <SushiCharacter type={key} size={88} mood={isOn ? 'happy' : 'idle'} />
            <span className="mt-1 text-center text-xs font-bold leading-tight text-ink">
              {sushi.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
