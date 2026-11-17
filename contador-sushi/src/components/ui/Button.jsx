const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  player1: 'inline-flex items-center justify-center rounded-2xl bg-[#2F6FED] px-8 py-4 font-bold text-white shadow-soft transition hover:brightness-110 active:scale-[0.97] disabled:opacity-40',
  player2: 'inline-flex items-center justify-center rounded-2xl bg-salmon px-8 py-4 font-bold text-white shadow-lift transition hover:bg-salmon-deep active:scale-[0.97] disabled:opacity-40',
  player3: 'inline-flex items-center justify-center rounded-2xl bg-nori px-8 py-4 font-bold text-white shadow-soft transition hover:bg-nori-light active:scale-[0.97] disabled:opacity-40',
  player4: 'inline-flex items-center justify-center rounded-2xl bg-gold px-8 py-4 font-bold text-ink shadow-soft transition hover:brightness-110 active:scale-[0.97] disabled:opacity-40',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
