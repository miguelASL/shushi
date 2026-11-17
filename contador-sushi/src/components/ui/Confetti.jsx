import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#FF6B4A', '#E8A838', '#1F4D3A', '#2F6FED', '#FF9AA8', '#FFF8F0'];

export default function Confetti({ active = true, count = 28 }) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return undefined;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [active]);

  const pieces = useMemo(() => {
    if (!visible) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.4,
      color: COLORS[i % COLORS.length],
      size: 8 + Math.random() * 10,
      radius: Math.random() > 0.5 ? '9999px' : '3px',
    }));
  }, [visible, count]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: p.radius,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
