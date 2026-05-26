export const MAX_DETOX_VIOLATIONS = 3;

export function getDetoxRemaining(active, now = Date.now()) {
  if (!active) return 0;
  if (active.paused) return active.pausedRemaining ?? 0;
  return Math.max(0, active.endsAt - now);
}

export function getDetoxProgress(active, durationSec, now = Date.now()) {
  if (!active || !durationSec) return 0;
  const remaining = getDetoxRemaining(active, now);
  return 1 - remaining / (durationSec * 1000);
}
