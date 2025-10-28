export const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
