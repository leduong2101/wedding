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
  assert.deepEqual(wedding.photos.map(photo => photo.src), ['assets/photos/GAA03832.webp', 'assets/photos/GAA03386.webp', 'assets/photos/GAA02717.webp']);
  const html = readFileSync('index.html', 'utf8');
  for (const photo of [wedding.heroPhoto, wedding.groom.photo, wedding.bride.photo, wedding.couplePhoto, wedding.event.photo, ...wedding.photos]) {
    assert.ok(existsSync(photo.src));
    assert.ok(html.includes(photo.src), `No-JS fallback includes ${photo.src}`);
  }
  assert.doesNotMatch(html, /Ảnh minh họa|Tranh minh họa|Chờ ảnh cưới thật|Album ảnh cưới thật sẽ được cập nhật/);
  assert.ok(!html.includes('04999'));
  assert.ok(!JSON.stringify(wedding).includes('04999'), 'Excluded photo is not published in the invitation');
});
