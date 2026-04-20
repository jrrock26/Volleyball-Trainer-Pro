// utils/formatTime.ts
export function formatTime(seconds: number | null): string {
  if (seconds === null || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return `${mm}:${ss}`;
}