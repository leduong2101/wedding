import test from 'node:test';
import assert from 'node:assert/strict';

const guests = await import('../js/guests.js').catch(() => ({}));

test('guest-link helpers are available', () => {
  assert.equal(typeof guests.createGuestLink, 'function');
});
test('guest links preserve Vietnamese names and URL punctuation under the project path', () => {
  const link = guests.createGuestLink('  Anh Minh & gia đình + bé An  ', 'https://leduong2101.github.io/wedding/tao-link.html?old=1#preview');
  const url = new URL(link);
  assert.equal(url.pathname, '/wedding/');
  assert.equal(url.hash, '');
  assert.deepEqual([...url.searchParams], [['khach', 'Anh Minh & gia đình + bé An']]);
  assert.equal(guests.guestNameFromSearch(url.search), 'Anh Minh & gia đình + bé An');
});
test('missing or blank guest names use the general invitation', () => {
  for (const search of ['', '?other=x', '?khach=', '?khach=+++']) assert.equal(guests.guestNameFromSearch(search), '');
  assert.throws(() => guests.createGuestLink('  ', 'https://example.com/tao-link.html'), /tên/i);
});
test('guest names are normalized and bounded, without interpreting markup', () => {
  assert.equal(guests.normalizeGuestName('  Chị\n Lan\t và gia đình  '), 'Chị Lan và gia đình');
  assert.equal(guests.normalizeGuestName('a'.repeat(500)).length, 120);
  assert.equal(guests.guestNameFromSearch('?khach=%3Cimg%20src%3Dx%3E'), '<img src=x>');
  assert.equal(guests.createGuestLink('Lan', 'http://localhost:8000/tao-link.html'), 'http://localhost:8000/?khach=Lan');
});

test('new links optionally hide gifts without changing legacy links or guest names', () => {
  const page = 'https://example.com/wedding/tao-link.html?mungcuoi=0';
  const hidden = new URL(guests.createGuestLink('Chị Lan & gia đình', page, { showGifts: false }));
  assert.equal(hidden.pathname, '/wedding/');
  assert.equal(hidden.searchParams.get('khach'), 'Chị Lan & gia đình');
  assert.equal(hidden.searchParams.get('mungcuoi'), '0');
  assert.equal(guests.shouldShowGifts(hidden.search), false);
  const shown = new URL(guests.createGuestLink('Anh Minh', page, { showGifts: true }));
  assert.equal(shown.searchParams.has('mungcuoi'), false);
  assert.equal(guests.shouldShowGifts(shown.search), true);
  for (const search of ['', '?khach=Lan', '?mungcuoi=1', '?mungcuoi=', '?mungcuoi=unexpected']) {
    assert.equal(guests.shouldShowGifts(search), true);
  }
});

test('sender is URL-local, optional and independent of gift visibility', () => {
  for (const sender of ['children', 'parents']) {
    for (const showGifts of [false, true]) {
      const url = new URL(guests.createGuestLink('Gia đình bác Hùng', 'https://example.com/wedding/tao-link.html?nguoigui=bome', { sender, showGifts }));
      assert.equal(guests.invitationSenderFromSearch(url.search), sender);
      assert.equal(guests.shouldShowGifts(url.search), showGifts);
      assert.equal(guests.guestNameFromSearch(url.search), 'Gia đình bác Hùng');
      assert.equal(url.pathname, '/wedding/');
      assert.equal(url.searchParams.get('nguoigui'), sender === 'parents' ? 'bome' : null);
    }
  }
  for (const search of ['', '?khach=Lan', '?nguoigui=', '?nguoigui=invalid', '?nguoigui=%3Cimg%3E']) {
    assert.equal(guests.invitationSenderFromSearch(search), 'children');
  }
});
