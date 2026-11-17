export const SUSHI_TYPES = {
  salmon: {
    name: 'Nigiri Salmón',
    description: 'Clásico japonés',
    shape: 'nigiri',
    hasNori: true,
    fish: '#FF6B4A',
    fishDark: '#E84F2F',
    fishLight: '#FFB199',
    accent: '#FF8F73',
  },
  tuna: {
    name: 'Nigiri Atún',
    description: 'Intenso y sabroso',
    shape: 'nigiri',
    hasNori: true,
    fish: '#C23B4B',
    fishDark: '#9E2A38',
    fishLight: '#E87A86',
    accent: '#D45564',
  },
  avocado: {
    name: 'Maki Aguacate',
    description: 'Vegetariano fresco',
    shape: 'maki',
    hasNori: true,
    fish: '#7CB342',
    fishDark: '#558B2F',
    fishLight: '#AED581',
    accent: '#8BC34A',
    center: '#F4E285',
  },
  shrimp: {
    name: 'Nigiri Gamba',
    description: 'Dulce y crujiente',
    shape: 'nigiri',
    hasNori: true,
    fish: '#FF8A80',
    fishDark: '#E57373',
    fishLight: '#FFCDD2',
    accent: '#FFAB91',
  },
  california: {
    name: 'California Roll',
    description: 'El favorito USA',
    shape: 'maki',
    hasNori: false,
    fish: '#FFB74D',
    fishDark: '#F57C00',
    fishLight: '#FFE0B2',
    accent: '#FFA726',
    center: '#E53935',
    outerRice: true,
  },
  temaki: {
    name: 'Temaki',
    description: 'Cono crujiente',
    shape: 'temaki',
    hasNori: true,
    fish: '#FF6B4A',
    fishDark: '#E84F2F',
    fishLight: '#FFB199',
    accent: '#7CB342',
  },
  eel: {
    name: 'Nigiri Anguila',
    description: 'Glaseado especial',
    shape: 'nigiri',
    hasNori: true,
    fish: '#6D4C41',
    fishDark: '#4E342E',
    fishLight: '#A1887F',
    accent: '#E8A838',
    glaze: true,
  },
  cucumber: {
    name: 'Maki Pepino',
    description: 'Light y refrescante',
    shape: 'maki',
    hasNori: true,
    fish: '#43A047',
    fishDark: '#2E7D32',
    fishLight: '#81C784',
    accent: '#66BB6A',
    center: '#C8E6C9',
  },
};

export const SUSHI_KEYS = Object.keys(SUSHI_TYPES);

export function getAppetiteMessage(count) {
  if (count < 5) return '¡Buen comienzo!';
  if (count < 10) return '¡Qué apetito!';
  if (count < 20) return '¡Eres todo un experto!';
  return '¡Nivel maestro sushi!';
}
