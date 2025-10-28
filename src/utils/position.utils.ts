import { ViewMode } from '@/types/timeline.types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const calculatePosition = (
  date: Date,
  startDate: Date,
  pixelsPerDay: number
): number => {
  const daysSinceStart = (date.getTime() - startDate.getTime()) / MS_PER_DAY;
  return Math.round(daysSinceStart * pixelsPerDay);
};

export const calculateDuration = (
  startDate: Date,
  endDate: Date,
  pixelsPerDay: number
): number => {
  const durationDays = (endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
  return Math.max(1, Math.round(durationDays * pixelsPerDay));
};

export const calculateDateFromPosition = (
  position: number,
  startDate: Date,
  pixelsPerDay: number
): Date => {
  const days = Math.round(position / pixelsPerDay);
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
};

export const generateTimeScale = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
): Array<{ date: Date; label: string }> => {
  const scale: Array<{ date: Date; label: string }> = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    if (viewMode === 'day') {
      scale.push({ date: new Date(current), label: current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }) });
      current.setDate(current.getDate() + 1);
    } else if (viewMode === 'week') {
      scale.push({ date: new Date(current), label: `Week ${getWeekNumber(current)}` });
      current.setDate(current.getDate() + 7);
    } else {
      scale.push({ date: new Date(current), label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
      current.setMonth(current.getMonth() + 1);
    }
  }
  return scale;
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};
