import { guestNameFromSearch, createGuestLink } from './guests.js';
import { createRsvpPayload, submitRsvp } from './rsvp.js';

const form = document.querySelector('#rsvp-form');
const fields = document.querySelector('#rsvp-fields');
const name = document.querySelector('#rsvp-name');
const countGroup = document.querySelector('#rsvp-count-group');
const count = document.querySelector('#rsvp-count');
const button = document.querySelector('#rsvp-submit');
const status = document.querySelector('#rsvp-status');
const guest = guestNameFromSearch(location.search);
name.value = guest;
const backLink = document.querySelector('#back-to-invitation');
if (backLink) backLink.href = guest ? createGuestLink(guest, location.href) : './';
let pending = false;
let saved = false;

function updateAttendance() {
  const attending = form.elements.attendance.value === 'yes';
  countGroup.hidden = !attending;
  count.disabled = !attending;
  count.required = attending;
  status.textContent = '';
  delete status.dataset.state;
}
form.addEventListener('change', updateAttendance);
form.addEventListener('input', () => {
  if (!pending && !saved) {
    status.textContent = '';
    delete status.dataset.state;
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (pending || saved) return;
  let payload;
  try {
    payload = createRsvpPayload(name.value, form.elements.attendance.value, count.value);
  } catch (error) {
    status.dataset.state = 'error';
    status.textContent = error.message;
    return;
  }
  name.value = payload.get('name');
  pending = true;
  fields.disabled = true;
  form.setAttribute('aria-busy', 'true');
  button.textContent = 'Đang gửi…';
  status.dataset.state = 'pending';
  status.textContent = 'Đang lưu xác nhận, bạn vui lòng chờ một chút.';
  try {
    await submitRsvp(payload);
    saved = true;
    status.dataset.state = 'success';
    status.textContent = 'Đã lưu xác nhận của bạn. Gia đình trân trọng cảm ơn!';
    button.textContent = 'Đã xác nhận';
  } catch {
    status.dataset.state = 'error';
    status.textContent = 'Chưa xác nhận được kết quả lưu. Nếu mạng bị ngắt, thông tin có thể đã được gửi; hãy liên hệ gia đình trước khi gửi lại để tránh trùng.';
    button.textContent = 'Xác nhận';
  } finally {
    pending = false;
    fields.disabled = saved;
    form.setAttribute('aria-busy', 'false');
  }
});

updateAttendance();
fields.disabled = false;
