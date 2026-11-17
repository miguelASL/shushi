import { SUSHI_TYPES } from '../data/sushiTypes';

function Face({ mood, cx = 100, cy = 72, scale = 1 }) {
  const happy = mood === 'happy' || mood === 'excited';
  const excited = mood === 'excited';
  const eyeR = 9 * scale;
  const pupil = happy ? 5.2 * scale : 4.2 * scale;
  const gap = 22 * scale;

  return (
    <g className={happy ? 'origin-center animate-eat-bounce' : ''}>
      <g className="origin-center animate-blink" style={{ transformOrigin: `${cx - gap}px ${cy}px` }}>
        <circle cx={cx - gap} cy={cy} r={eyeR} fill="#fff" stroke="#1A1A1A" strokeWidth="2.5" />
        <circle cx={cx - gap + 1} cy={cy + 1} r={pupil} fill="#1A1A1A" />
        <circle cx={cx - gap - 2.5} cy={cy - 2.5} r={2.2} fill="#fff" />
      </g>
      <g className="origin-center animate-blink" style={{ transformOrigin: `${cx + gap}px ${cy}px`, animationDelay: '0.12s' }}>
        <circle cx={cx + gap} cy={cy} r={eyeR} fill="#fff" stroke="#1A1A1A" strokeWidth="2.5" />
        <circle cx={cx + gap + 1} cy={cy + 1} r={pupil} fill="#1A1A1A" />
        <circle cx={cx + gap - 2.5} cy={cy - 2.5} r={2.2} fill="#fff" />
      </g>
      <path
        d={`M${cx - gap - 8} ${cy - eyeR - 4} q ${8 * scale} ${happy ? -6 : -2} ${16 * scale} 0`}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`M${cx + gap - 8} ${cy - eyeR - 4} q ${8 * scale} ${happy ? -6 : -2} ${16 * scale} 0`}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {happy ? (
        <>
          <path
            d={`M${cx - 14} ${cy + 16} Q ${cx} ${cy + 30} ${cx + 14} ${cy + 16}`}
            fill="#FFB4C4"
            stroke="#1A1A1A"
            strokeWidth="2.5"
          />
          <ellipse cx={cx} cy={cy + 24} rx={7} ry={4} fill="#FF6B8A" />
          <circle cx={cx - 28} cy={cy + 10} r={6} fill="#FF9AA8" opacity="0.85" />
          <circle cx={cx + 28} cy={cy + 10} r={6} fill="#FF9AA8" opacity="0.85" />
        </>
      ) : (
        <path
          d={`M${cx - 10} ${cy + 18} Q ${cx} ${cy + 22} ${cx + 10} ${cy + 18}`}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {excited && (
        <>
          <path d={`M${cx - 40} ${cy - 18} l3 -8 3 8`} stroke="#E8A838" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M${cx + 34} ${cy - 22} l3 -8 3 8`} stroke="#E8A838" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function NigiriSvg({ sushi, mood }) {
  return (
    <>
      <ellipse cx="100" cy="148" rx="58" ry="10" fill="#1A1A1A" opacity="0.12" />
      <ellipse cx="100" cy="128" rx="70" ry="28" fill="#FFF8F0" stroke="#1A1A1A" strokeWidth="3" />
      <ellipse cx="100" cy="122" rx="58" ry="18" fill="#F5EDE3" opacity="0.7" />
      {[
        [70, 120],
        [90, 130],
        [115, 118],
        [130, 128],
        [80, 134],
        [108, 136],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#D9CFC3" />
      ))}
      <path
        d="M36 88 C48 52 152 52 164 88 C164 108 140 122 100 122 C60 122 36 108 36 88Z"
        fill={sushi.fish}
        stroke="#1A1A1A"
        strokeWidth="3"
      />
      <path
        d="M52 78 C70 62 130 62 148 78"
        fill="none"
        stroke={sushi.fishLight}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M60 92 C80 84 120 84 140 92"
        fill="none"
        stroke={sushi.fishDark}
        strokeWidth="2"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M68 102 C88 96 112 96 132 102"
        fill="none"
        stroke={sushi.fishDark}
        strokeWidth="1.5"
        opacity="0.25"
        strokeLinecap="round"
      />
      {sushi.glaze && (
        <path
          d="M55 70 C90 58 120 58 145 70"
          fill="none"
          stroke={sushi.accent}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />
      )}
      {sushi.hasNori && (
        <rect x="34" y="100" width="132" height="14" rx="3" fill="#1F4D3A" stroke="#1A1A1A" strokeWidth="2" />
      )}
      <Face mood={mood} cx={100} cy={78} />
    </>
  );
}

function MakiSvg({ sushi, mood }) {
  const outer = sushi.outerRice ? '#FFF8F0' : '#1F4D3A';
  const ring = sushi.outerRice ? '#1F4D3A' : '#FFF8F0';
  return (
    <>
      <ellipse cx="100" cy="168" rx="48" ry="9" fill="#1A1A1A" opacity="0.12" />
      <circle cx="100" cy="100" r="62" fill={outer} stroke="#1A1A1A" strokeWidth="3" />
      {!sushi.outerRice && (
        <circle cx="100" cy="100" r="52" fill="#FFF8F0" stroke="#1A1A1A" strokeWidth="2" />
      )}
      {sushi.outerRice && (
        <circle cx="100" cy="100" r="46" fill="#1F4D3A" stroke="#1A1A1A" strokeWidth="2" />
      )}
      <circle cx="100" cy="100" r={sushi.outerRice ? 34 : 30} fill={ring} opacity={sushi.outerRice ? 1 : 0.95} />
      <circle cx="100" cy="100" r="22" fill={sushi.fish} stroke="#1A1A1A" strokeWidth="2" />
      {sushi.center && <circle cx="100" cy="100" r="10" fill={sushi.center} stroke="#1A1A1A" strokeWidth="1.5" />}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const r = 40;
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={deg}
            cx={100 + Math.cos(rad) * r}
            cy={100 + Math.sin(rad) * r}
            r="2"
            fill={sushi.outerRice ? '#D9CFC3' : '#E8A838'}
            opacity="0.7"
          />
        );
      })}
      <Face mood={mood} cx={100} cy={78} scale={0.95} />
    </>
  );
}

function TemakiSvg({ sushi, mood }) {
  return (
    <>
      <ellipse cx="100" cy="170" rx="42" ry="8" fill="#1A1A1A" opacity="0.12" />
      <path
        d="M100 28 L168 150 Q100 172 32 150 Z"
        fill="#1F4D3A"
        stroke="#1A1A1A"
        strokeWidth="3"
      />
      <path
        d="M100 48 L148 140 Q100 156 52 140 Z"
        fill="#FFF8F0"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path d="M78 70 Q100 86 122 70 L118 118 Q100 128 82 118 Z" fill={sushi.fish} stroke="#1A1A1A" strokeWidth="2" />
      <path d="M88 78 Q100 88 112 78" fill="none" stroke={sushi.fishLight} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="100" cy="58" rx="18" ry="10" fill={sushi.accent} stroke="#1A1A1A" strokeWidth="1.5" opacity="0.9" />
      <Face mood={mood} cx={100} cy={108} scale={0.85} />
    </>
  );
}

export default function SushiCharacter({
  type = 'salmon',
  mood = 'idle',
  size = 180,
  showLabel = false,
  className = '',
}) {
  const sushi = SUSHI_TYPES[type] || SUSHI_TYPES.salmon;
  const happy = mood === 'happy' || mood === 'excited';

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className={`relative ${happy ? 'animate-eat-bounce' : 'animate-float'}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 200 180" width={size} height={size} role="img" aria-label={sushi.name}>
          {sushi.shape === 'maki' && <MakiSvg sushi={sushi} mood={mood} />}
          {sushi.shape === 'temaki' && <TemakiSvg sushi={sushi} mood={mood} />}
          {sushi.shape === 'nigiri' && <NigiriSvg sushi={sushi} mood={mood} />}
        </svg>
      </div>
      {showLabel && (
        <p className="mt-1 text-center text-sm font-bold text-ink/80 animate-wiggle">{sushi.name}</p>
      )}
    </div>
  );
}
