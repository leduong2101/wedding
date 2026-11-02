import test from 'node:test';
import assert from 'node:assert/strict';

const countdown = await import('../js/countdown.js').catch(() => ({}));
const config = await import('../js/config.js').catch(() => ({}));

test('countdown behavior is available', () => {
  assert.equal(typeof countdown.getCountdown, 'function');
});

test('reception countdown uses 10:00 UTC, not the viewing device timezone', () => {
  assert.ok(config.wedding, 'approved event configuration exists');
  assert.equal(new Date(config.wedding.event.date).toISOString(), '2026-11-29T10:00:00.000Z');
});

test('one day before reception has exactly one day remaining', () => {
  assert.deepEqual(countdown.getCountdown('2026-11-29T17:00:00+07:00', Date.parse('2026-11-28T10:00:00Z')),
    { days: 1, hours: 0, minutes: 0, seconds: 0, complete: false });
});

test('remaining time is broken into days, hours, minutes and seconds', () => {
  assert.deepEqual(countdown.getCountdown('2026-11-29T17:00:00+07:00', Date.parse('2026-11-27T07:55:54Z')),
    { days: 2, hours: 2, minutes: 4, seconds: 6, complete: false });
});

for (const now of ['2026-11-29T10:00:00Z', '2026-12-01T10:00:00Z']) {
  test(`countdown never goes negative at ${now}`, () => {
    assert.deepEqual(countdown.getCountdown('2026-11-29T17:00:00+07:00', Date.parse(now)),
      { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true });
  });
}
