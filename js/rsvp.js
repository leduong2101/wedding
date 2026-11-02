import { normalizeGuestName } from './guests.js';

export const rsvpEndpoint = 'https://script.google.com/macros/s/AKfycbw3puAbBWYyhZC8r2jxXp_IjY5gT8Cx5n0KAhkh954uIHaQEDHJicbSk5D3i0iU9Qfy/exec';

export function createRsvpPayload(name, attendance, count) {
  const guest = normalizeGuestName(name);
  if (!guest) throw new Error('Vui lòng nhập tên khách mời.');
  if (!['yes', 'no'].includes(attendance)) throw new Error('Vui lòng chọn bạn có tham dự hay không.');
  if (attendance === 'yes' && !/^(?:[1-9]|10)$/.test(String(count))) {
    throw new Error('Vui lòng chọn số người tham dự từ 1 đến 10.');
  }
  return new URLSearchParams({ name: guest, attendance, count: attendance === 'yes' ? String(count) : '0' });
}

export async function submitRsvp(payload, fetcher = fetch, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    // URLSearchParams uses a simple form POST (no CORS preflight).
    // Never use no-cors: an opaque response cannot confirm a successful save.
    const response = await fetcher(rsvpEndpoint, {
      method: 'POST', body: payload, credentials: 'omit', signal: controller.signal,
    });
    if (!response.ok) throw new Error('Chưa xác nhận lưu được. Vui lòng thử lại sau.');
    const result = await response.json();
    if (result?.ok !== true) throw new Error('Chưa xác nhận lưu được. Vui lòng thử lại sau.');
  } finally {
    clearTimeout(timer);
  }
}
