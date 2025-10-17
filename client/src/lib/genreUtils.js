// Genre color utility functions
export const colorKeyToClasses = {
  green: { bg: 'bg-green-200', text: 'text-green-800' },
  emerald: { bg: 'bg-emerald-200', text: 'text-emerald-800' },
  teal: { bg: 'bg-teal-200', text: 'text-teal-800' },
  cyan: { bg: 'bg-cyan-200', text: 'text-cyan-800' },
  sky: { bg: 'bg-sky-200', text: 'text-sky-800' },
  blue: { bg: 'bg-blue-200', text: 'text-blue-800' },
  indigo: { bg: 'bg-indigo-200', text: 'text-indigo-800' },
  violet: { bg: 'bg-violet-200', text: 'text-violet-800' },
  purple: { bg: 'bg-purple-200', text: 'text-purple-800' },
  fuchsia: { bg: 'bg-fuchsia-200', text: 'text-fuchsia-800' },
  pink: { bg: 'bg-pink-200', text: 'text-pink-800' },
  rose: { bg: 'bg-rose-200', text: 'text-rose-800' },
  red: { bg: 'bg-red-200', text: 'text-red-800' },
  orange: { bg: 'bg-orange-200', text: 'text-orange-800' },
  amber: { bg: 'bg-amber-200', text: 'text-amber-800' },
  yellow: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  lime: { bg: 'bg-lime-200', text: 'text-lime-800' },
  stone: { bg: 'bg-stone-200', text: 'text-stone-800' },
  gray: { bg: 'bg-gray-200', text: 'text-gray-800' },
  slate: { bg: 'bg-slate-200', text: 'text-slate-800' },
};

export const getClassesForColor = (colorKey) => {
  if (!colorKey) return { bg: '', text: '' };
  const key = String(colorKey).toLowerCase();
  return colorKeyToClasses[key] || { bg: '', text: '' };
};

export const getGenreChipClasses = (genre) => {
  const classes = getClassesForColor(genre?.color);
  return `${classes.bg} ${classes.text}`.trim();
};
