import { wedding } from './config.js';
import { getCountdown } from './countdown.js';
import { createMusicController } from './music.js';
import { getGiftDetails } from './gifts.js';
import { dismissCover, revealOnScroll } from './motion.js';
import { setupGiftTabs } from './gift-tabs.js';

const $ = selector => document.querySelector(selector);
const cover = $('#cover');
const main = $('#main');
const musicButton = $('#music-toggle');
const audio = $('#background-music');
const status = $('#music-status');
audio.src = wedding.music.src;
audio.volume = 0.45;
const music = createMusicController(audio);

// Keep every repeated piece of wedding information in sync with config.js.
document.querySelectorAll('[data-bind]').forEach(element => {
  const value = element.dataset.bind.split('.').reduce((object, key) => object?.[key], wedding);
  if (typeof value === 'string') element.textContent = value;
});
const eventDate = new Date(wedding.event.date);
const datePart = options => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', ...options }).format(eventDate);
const day = datePart({ day: '2-digit' });
const month = datePart({ month: '2-digit' });
const year = datePart({ year: 'numeric' });
const rawWeekday = datePart({ weekday: 'long' });
const weekday = rawWeekday.charAt(0).toLocaleUpperCase('vi-VN') + rawWeekday.slice(1);
const time = datePart({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dates = {
  day, 'month-year': `Tháng ${month} · ${year}`, weekday, time,
  'weekday-time': `${weekday} · ${time}`, short: `${day}.${month}.${year}`, numeric: `${day} . ${month} . ${year}`,
};
document.querySelectorAll('[data-date]').forEach(element => { element.textContent = dates[element.dataset.date]; });
document.title = `${wedding.groom.shortName} & ${wedding.bride.shortName} · Thiệp cưới ${dates.short}`;
document.querySelector('meta[name="description"]').content = `Trân trọng kính mời bạn đến chung vui cùng ${wedding.bride.name} & ${wedding.groom.name}. ${time} ngày ${dates.short} tại ${wedding.event.venue}, ${wedding.event.address}.`;
$('#map-link').href = wedding.event.mapUrl;

function updateCountdown() {
  const remaining = getCountdown(wedding.event.date);
  $('#countdown').hidden = remaining.complete;
  $('#countdown-message').hidden = !remaining.complete;
  $('#countdown-message').textContent = 'Ngày hạnh phúc đã đến. Cảm ơn bạn đã chung vui cùng chúng mình!';
  document.querySelectorAll('[data-unit]').forEach(element => {
    element.textContent = String(remaining[element.dataset.unit]).padStart(2, '0');
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { updateCountdown(); updateMusicButton(); }
});

function updateMusicButton() {
  const playing = music.isPlaying;
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
  musicButton.title = wedding.music.label;
  musicButton.querySelector('.music-text').textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
}
for (const event of ['playing', 'pause', 'error', 'ended']) audio.addEventListener(event, updateMusicButton);
async function toggleMusic() {
  musicButton.disabled = true;
  if (music.isPlaying) {
    const stopped = await music.pause();
    status.textContent = stopped ? 'Đã tắt nhạc nền.' : 'Chưa thể tắt nhạc. Bạn có thể thử lại.';
  } else {
    const started = await music.play();
    status.textContent = started ? `Đang phát ${wedding.music.label}.` : 'Chưa thể phát nhạc. Bạn có thể bấm Bật nhạc để thử lại.';
  }
  musicButton.disabled = false;
  updateMusicButton();
}
musicButton.addEventListener('click', toggleMusic);
$('#open-invitation').addEventListener('click', () => {
  $('#open-invitation').disabled = true;
  // Start in the click gesture, before any await, for mobile autoplay policies.
  toggleMusic();
  main.inert = false;
  document.body.classList.remove('cover-open');
  musicButton.hidden = false;
  window.scrollTo(0, 0);
  dismissCover(cover, () => {
    $('#home').focus({ preventScroll: true });
    revealOnScroll();
  });
});

// Photo paths and accessible descriptions are maintained in config.js.
const gallery = $('#gallery-grid');
gallery.replaceChildren();
wedding.photos.forEach((photo, index) => {
  const figure = document.createElement('figure');
  const link = document.createElement('a');
  link.href = photo.src;
  link.className = 'gallery-link';
  link.dataset.photo = index;
  link.setAttribute('aria-label', `Xem lớn: ${photo.caption}`);
  const image = document.createElement('img');
  Object.assign(image, { src: photo.src, alt: photo.alt, width: 640, height: 840, loading: 'lazy' });
  const caption = document.createElement('figcaption');
  const number = document.createElement('span');
  number.textContent = String(index + 1).padStart(2, '0');
  caption.append(number, ` ${photo.caption}`);
  link.append(image);
  figure.append(link, caption);
  gallery.append(figure);
});
const heroPhoto = wedding.heroPhoto || wedding.photos[0];
if (heroPhoto) {
  $('#hero-photo').src = heroPhoto.src;
  $('#hero-photo').alt = heroPhoto.alt;
}
for (const role of ['bride', 'groom']) {
  const photo = wedding[role].photo;
  const image = document.querySelector(`[data-person-photo="${role}"]`);
  if (photo) Object.assign(image, { src: photo.src, alt: photo.alt });
}
if (wedding.couplePhoto) Object.assign($('[data-couple-photo]'), wedding.couplePhoto);
if (wedding.event.photo) Object.assign($('[data-event-photo]'), wedding.event.photo);
const photoDialog = $('#photo-dialog');
let lastPhotoLink;
gallery.addEventListener('click', event => {
  const link = event.target.closest('[data-photo]');
  if (!link || !photoDialog.showModal) return;
  event.preventDefault();
  lastPhotoLink = link;
  const photo = wedding.photos[Number(link.dataset.photo)];
  $('#dialog-image').src = photo.src;
  $('#dialog-image').alt = photo.alt;
  $('#photo-caption').textContent = photo.caption;
  photoDialog.showModal();
});
photoDialog.querySelector('button').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog.addEventListener('close', () => lastPhotoLink?.focus({ preventScroll: true }));

for (const role of ['bride', 'groom']) {
  const details = getGiftDetails(wedding.gifts[role]);
  if (!details) continue;
  const content = document.querySelector(`[data-gift="${role}"] .gift-content`);
  const image = document.createElement('img');
  Object.assign(image, { src: details.qr, alt: `Mã QR mừng cưới ${wedding[role].name}`, width: 180, height: 180, loading: 'lazy' });
  const info = document.createElement('p');
  info.className = 'bank-info';
  const account = document.createElement('strong');
  account.className = 'account-number';
  account.textContent = details.account;
  info.append(document.createTextNode(details.bank), document.createElement('br'), document.createTextNode(details.holder), account);
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-account';
  copy.textContent = 'Sao chép số tài khoản';
  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(details.account);
      feedback.textContent = 'Đã sao chép số tài khoản.';
    } catch {
      feedback.textContent = `Bạn vui lòng sao chép thủ công: ${details.account}`;
    }
  });
  content.replaceChildren(image, info, copy, feedback);
}
setupGiftTabs($('#gifts'));

// Progressive enhancement: never leave a nonfunctional overlay if setup fails.
cover.hidden = false;
main.inert = true;
document.body.classList.add('cover-open');
$('#open-invitation').focus({ preventScroll: true });
