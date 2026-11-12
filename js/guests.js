// Personalization is URL-local: no shared guest list, cookies or persistent storage.
export function normalizeGuestName(value) {
  return Array.from(String(value ?? '').normalize('NFC').replace(/\s+/gu, ' ').trim()).slice(0, 120).join('');
}

export function guestNameFromSearch(search) {
  return normalizeGuestName(new URLSearchParams(search).get('khach'));
}

export function shouldShowGifts(search) {
  // Missing options preserve all previously shared invitations.
  return new URLSearchParams(search).get('mungcuoi') !== '0';
}

export function invitationSenderFromSearch(search) {
  return new URLSearchParams(search).get('nguoigui') === 'bome' ? 'parents' : 'children';
}

export function createGuestLink(name, pageUrl, { showGifts = true, sender = 'children' } = {}) {
  const guest = normalizeGuestName(name);
  if (!guest) throw new Error('Vui lòng nhập tên khách mời.');
  const url = new URL('./', pageUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('khach', guest);
  if (!showGifts) url.searchParams.set('mungcuoi', '0');
  if (sender === 'parents') url.searchParams.set('nguoigui', 'bome');
  return url.href;
}
