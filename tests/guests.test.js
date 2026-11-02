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
