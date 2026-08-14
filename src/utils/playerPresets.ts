export const PLAYER_COLORS = [
  { name: 'Bleu Sûreté', hex: '#1e3a8a', bgClass: 'bg-blue-900', textClass: 'text-blue-900 dark:text-blue-300', borderClass: 'border-blue-900' },
  { name: 'Sceau Rouge', hex: '#991b1b', bgClass: 'bg-red-800', textClass: 'text-red-800 dark:text-red-300', borderClass: 'border-red-800' },
  { name: 'Vert Impérial', hex: '#166534', bgClass: 'bg-green-800', textClass: 'text-green-800 dark:text-green-300', borderClass: 'border-green-800' },
  { name: 'Cuir Brun', hex: '#78350f', bgClass: 'bg-amber-900', textClass: 'text-amber-900 dark:text-amber-300', borderClass: 'border-amber-900' },
  { name: 'Encre Pourpre', hex: '#581c87', bgClass: 'bg-purple-900', textClass: 'text-purple-900 dark:text-purple-300', borderClass: 'border-purple-900' },
  { name: 'Ardoise Sombre', hex: '#334155', bgClass: 'bg-slate-700', textClass: 'text-slate-700 dark:text-slate-300', borderClass: 'border-slate-700' },
  { name: 'Or Vieilli', hex: '#b45309', bgClass: 'bg-amber-700', textClass: 'text-amber-700 dark:text-amber-300', borderClass: 'border-amber-700' },
  { name: 'Charbon 1910', hex: '#1f2937', bgClass: 'bg-gray-800', textClass: 'text-gray-800 dark:text-gray-300', borderClass: 'border-gray-800' },
];

const RANKS_TITLES = [
  'Inspecteur',
  'Sous-inspecteur',
  'Docteur',
  'Secrétaire',
  'Auxiliaire',
  'Agent',
  'Brigadier',
  'Commissaire',
];

const LAST_NAMES = [
  'Cormier',
  'Valentin',
  'Bertillon',
  'Léontine',
  'Faubert',
  'Dujardin',
  'Chavanne',
  'Pujol',
  'Terrasson',
  'Gaston',
  'Vacher',
  'Bonnot',
  'Delarue',
  'Perreau',
];

export function generateRandomPlayerName(): string {
  const title = RANKS_TITLES[Math.floor(Math.random() * RANKS_TITLES.length)];
  const name = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${title} ${name}`;
}

export function generateRandomRoomId(): string {
  const cities = ['paris', 'lyon', 'marseille', 'lille', 'bordeaux', 'rouen', 'nantes', 'toulouse'];
  const places = ['quai-des-orfevres', 'gare-de-lest', 'batignolles', 'belleville', 'montmartre', 'place-beauvau', 'greffe', 'prefecture'];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const place = places[Math.floor(Math.random() * places.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `brigade-${city}-${num}`;
}

export function getRandomColor(): string {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)].hex;
}
