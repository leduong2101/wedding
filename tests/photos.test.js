import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { wedding } from '../js/config.js';

test('approved wedding photos are mapped to their requested sections', () => {
  for (const [photo, id] of [[wedding.heroPhoto, '04981'], [wedding.groom.photo, '04671'], [wedding.bride.photo, '04303'], [wedding.couplePhoto, '04528'], [wedding.event.photo, '04132']]) {
    assert.ok(photo.src.includes(id), `Expected ${id}, received ${photo.src}`);
    assert.ok(existsSync(photo.src));
    assert.doesNotMatch(photo.alt, /minh họa|chờ ảnh/);
  }
  assert.deepEqual(wedding.photos.map(photo => photo.src), ['03342', '04599', '03494', '05079', '02717', '04999'].map(id => `assets/photos/GAA${id}-retouched.webp`));
  const html = readFileSync('index.html', 'utf8');
  for (const photo of [wedding.heroPhoto, wedding.groom.photo, wedding.bride.photo, wedding.couplePhoto, wedding.event.photo, ...wedding.photos]) {
    assert.ok(existsSync(photo.src));
    assert.ok(html.includes(photo.src), `No-JS fallback includes ${photo.src}`);
  }
  assert.doesNotMatch(html, /Ảnh minh họa|Tranh minh họa|Chờ ảnh cưới thật|Album ảnh cưới thật sẽ được cập nhật/);
  assert.ok(html.includes('GAA04999-retouched.webp'), 'Newly requested final album photo is published');
});
