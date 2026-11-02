export function getCountdown(target, now = Date.now()) {
  const remaining = Math.max(0, Math.floor((Date.parse(target) - now) / 1000));
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    complete: remaining === 0,
  };
}
