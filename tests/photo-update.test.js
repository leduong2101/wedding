import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { wedding } from '../js/config.js';
import { getGiftDetails } from '../js/gifts.js';

test('retouched photos use requested page assignments and six-photo order', () => {
  assert.match(wedding.heroPhoto.src, /GAA04981-retouched-centered.webp$/);
  assert.match(wedding.couplePhoto.src, /GAA04528-retouched-centered.webp$/);
  assert.match(wedding.event.photo.src, /GAA04132-retouched.webp$/);
  assert.deepEqual(wedding.photos.map(photo => photo.src.match(/GAA(\d+)/)[1]), ['03342', '04599', '03494', '05079', '02717', '04999']);
  assert.match(wedding.groom.photo.src, /GAA04671-waist-hq.webp$/);
  assert.match(wedding.bride.photo.src, /GAA04303-waist-hq.webp$/);
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const photo of [wedding.heroPhoto, wedding.couplePhoto, wedding.event.photo, ...wedding.photos]) {
    assert.ok(existsSync(new URL('../' + photo.src, import.meta.url)));
    assert.ok(html.includes(photo.src), 'No-JavaScript fallback includes the same photo');
  }
});

test('both supplied QR images have complete, separate recipient details', () => {
  for (const role of ['groom', 'bride']) {
    const details = getGiftDetails(wedding.gifts[role]);
    assert.ok(details);
    assert.equal(details.qr, `assets/qr-${role}.png`);
    assert.ok(existsSync(new URL('../' + details.qr, import.meta.url)));
  }
  assert.notEqual(wedding.gifts.groom.account, wedding.gifts.bride.account);
});
