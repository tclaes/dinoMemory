const pad = (value: number) => value.toString().padStart(2, '0');

/**
 * Formats a duration in milliseconds as a clock, rounded down to whole seconds:
 * `mm:ss` below one hour, `h:mm:ss` from one hour on.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
