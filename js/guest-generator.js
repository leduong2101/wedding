import { normalizeGuestName, createGuestLink } from './guests.js';

const form = document.querySelector('#guest-form');
const name = document.querySelector('#guest-input');
const preview = document.querySelector('#guest-preview');
const result = document.querySelector('#link-result');
const output = document.querySelector('#guest-link');
const openLink = document.querySelector('#open-guest-link');
const status = document.querySelector('#generator-status');

name.addEventListener('input', () => {
  preview.textContent = normalizeGuestName(name.value) || 'Tên khách mời';
  result.hidden = true;
  output.value = '';
  openLink.removeAttribute('href');
  status.textContent = '';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  try {
    output.value = createGuestLink(name.value, location.href);
    openLink.href = output.value;
    result.hidden = false;
    status.textContent = 'Link đã sẵn sàng. Kiểm tra tên rồi sao chép gửi khách.';
  } catch (error) {
    status.textContent = error.message;
    name.focus();
  }
});

document.querySelector('#copy-guest-link').addEventListener('click', async () => {
  // Capture this exact link before the async clipboard call.
  const link = output.value;
  if (!link) return;
  try {
    await navigator.clipboard.writeText(link);
    if (output.value === link) status.textContent = 'Đã sao chép link. Bạn có thể gửi cho khách qua Zalo hoặc tin nhắn.';
  } catch {
    if (output.value !== link) return;
    output.focus();
    output.select();
    status.textContent = 'Không thể tự sao chép. Hãy sao chép thủ công link đã chọn ở trên.';
  }
});

// The form is only enabled once all handlers are ready.
document.querySelector('#generator-fields').disabled = false;
