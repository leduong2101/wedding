// Personalization is URL-local: no shared guest list, cookies or persistent storage.
export function normalizeGuestName(value) {
  return Array.from(String(value ?? '').normalize('NFC').replace(/\s+/gu, ' ').trim()).slice(0, 120).join('');
}

export function guestNameFromSearch(search) {
  return normalizeGuestName(new URLSearchParams(search).get('khach'));
}

export function createGuestLink(name, pageUrl) {
  const guest = normalizeGuestName(name);
  if (!guest) throw new Error('Vui lòng nhập tên khách mời.');
  const url = new URL('./', pageUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('khach', guest);
  return url.href;
}
