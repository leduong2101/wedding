import { normalizeGuestName, createGuestLink } from './guests.js?v=20261112-sender';

const form = document.querySelector('#guest-form');
const name = document.querySelector('#guest-input');
const preview = document.querySelector('#guest-preview');
const result = document.querySelector('#link-result');
const output = document.querySelector('#guest-link');
const openLink = document.querySelector('#open-guest-link');
const status = document.querySelector('#generator-status');
const showGifts = document.querySelector('#show-gifts');
const giftPreview = document.querySelector('#gift-preview');
const sender = document.querySelector('#invitation-sender');
const senderPreview = document.querySelector('#sender-preview');

function resetPreview() {
  preview.textContent = normalizeGuestName(name.value) || 'Tên khách mời';
  giftPreview.textContent = showGifts.checked ? 'Có hiển thị phần Mừng cưới' : 'Không hiển thị phần Mừng cưới';
  senderPreview.textContent = sender.value === 'parents' ? 'Người gửi: Bố mẹ' : 'Người gửi: Các con';
  result.hidden = true;
  output.value = '';
  openLink.removeAttribute('href');
  status.textContent = '';
}
name.addEventListener('input', resetPreview);
showGifts.addEventListener('change', resetPreview);
sender.addEventListener('change', resetPreview);

form.addEventListener('submit', event => {
  event.preventDefault();
  try {
    output.value = createGuestLink(name.value, location.href, { showGifts: showGifts.checked, sender: sender.value });
    openLink.href = output.value;
    result.hidden = false;
    status.textContent = `Link đã sẵn sàng. ${senderPreview.textContent}. ${giftPreview.textContent}. Kiểm tra rồi sao chép gửi khách.`;
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
resetPreview();
document.querySelector('#generator-fields').disabled = false;
