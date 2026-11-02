import test from 'node:test';
import assert from 'node:assert/strict';

const rsvp = await import('../js/rsvp.js').catch(() => ({}));

test('attending RSVP includes normalized name and total party size', () => {
  assert.equal(typeof rsvp.createRsvpPayload, 'function');
  assert.deepEqual([...rsvp.createRsvpPayload('  Anh Minh & gia đình  ', 'yes', '3')], [
    ['name', 'Anh Minh & gia đình'], ['attendance', 'yes'], ['count', '3'],
  ]);
});

test('declined RSVP always sends a zero party size', () => {
  assert.equal(rsvp.createRsvpPayload('Chị Lan', 'no', '8').get('count'), '0');
});

test('RSVP rejects blank names, missing attendance and counts outside 1–10', () => {
  for (const args of [[' ', 'yes', '1'], ['Lan', '', '1'], ['Lan', 'maybe', '1'], ...['0', '11', '1.5', '2 people', ''].map(count => ['Lan', 'yes', count])]) {
    assert.throws(() => rsvp.createRsvpPayload(...args), /Vui lòng/);
  }
});

test('submission sends a simple form POST and waits for explicit saved acknowledgment', async () => {
  const payload = new URLSearchParams({ name: 'Lan', attendance: 'yes', count: '1' });
  let request;
  await rsvp.submitRsvp(payload, async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ ok: true }) };
  });
  assert.match(request.url, /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/);
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.credentials, 'omit');
  assert.equal(request.options.body, payload);
  assert.notEqual(request.options.mode, 'no-cors');
});

test('server rejection, HTTP failures, malformed responses and network errors never count as saved', async () => {
  for (const fetcher of [
    async () => ({ ok: true, json: async () => ({ ok: false }) }),
    async () => ({ ok: false, json: async () => ({ ok: true }) }),
    async () => ({ ok: true, json: async () => ({ ok: 'true' }) }),
    async () => ({ ok: true, json: async () => { throw Error('Not JSON'); } }),
    async () => { throw Error('Offline'); },
  ]) await assert.rejects(rsvp.submitRsvp(new URLSearchParams(), fetcher));
});

test('a slow submission is aborted rather than left pending forever', async () => {
  await assert.rejects(rsvp.submitRsvp(new URLSearchParams(), async (url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(Error('Aborted')), { once: true });
  }), 10));
});
