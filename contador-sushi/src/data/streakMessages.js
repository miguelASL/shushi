export const STREAK_WINDOW_MS = 1200;

const STREAK_LINES = {
  5: [
    '¡Racha x5! El sushi tiembla',
    '¡Cinco seguidos! Boca turbo',
    'x5 · Sin piedad con el nigiri',
  ],
  8: [
    '¡Racha x8! Maestro del palillo',
    'x8 · El chef te mira raro',
    '¡Ocho! ¿Hay wasabi de más?',
  ],
  10: [
    '¡Racha x10! Leyenda del conveyor',
    'x10 · ¡Nom nom legendario!',
    'Diez seguidos… ¿eres una foca?',
  ],
  15: [
    '¡Racha x15! Modo glotón ON',
    'x15 · El plato pide refuerzos',
    '¡Quince! Alerta de saciedad',
  ],
  20: [
    '¡Racha x20! IMPARABLE',
    'x20 · El sushi se rinde',
    'Veinte… ¿dejas sitio al postre?',
  ],
};

export function getStreakMessage(streak) {
  const exact = STREAK_LINES[streak];
  if (exact) {
    return exact[Math.floor(Math.random() * exact.length)];
  }
  if (streak > 20 && streak % 5 === 0) {
    const lines = STREAK_LINES[20];
    return lines[Math.floor(Math.random() * lines.length)];
  }
  return null;
}
