import test from 'node:test';
import assert from 'node:assert/strict';

const { createMusicController } = await import('../js/music.js').catch(() => ({}));

test('playing state becomes true only after successful playback', async () => {
  let resolve;
  const music = createMusicController({ play: () => new Promise(r => { resolve = r; }), pause() {} });
  const playing = music.play();
  assert.equal(music.isPlaying, false);
  resolve();
  await playing;
  assert.equal(music.isPlaying, true);
  await music.pause();
  assert.equal(music.isPlaying, false);
});

test('playback rejection stays paused and permits retry', async () => {
  let blocked = true;
  const music = createMusicController({ async play() { if (blocked) throw new Error('blocked'); }, pause() {} });
  assert.equal(await music.play(), false);
  assert.equal(music.isPlaying, false);
  blocked = false;
  assert.equal(await music.play(), true);
  assert.equal(music.isPlaying, true);
});

test('pause while playback is pending prevents stale playing state', async () => {
  let resolve;
  const music = createMusicController({ play: () => new Promise(r => { resolve = r; }), pause() {} });
  const pending = music.play();
  await music.pause();
  resolve();
  await pending;
  assert.equal(music.isPlaying, false);
});

test('a failed pause does not falsely claim the music stopped', async () => {
  const music = createMusicController({ async play() {}, pause() { throw new Error('failed'); } });
  await music.play();
  assert.equal(await music.pause(), false);
  assert.equal(music.isPlaying, true);
});
