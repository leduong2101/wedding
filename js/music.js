export function createMusicController(source) {
  let playing = false;
  let revision = 0;
  let wanted = false;
  return {
    get isPlaying() { return playing && source.paused !== true; },
    async play() {
      const current = ++revision;
      wanted = true;
      try {
        await source.play();
        if (current !== revision) {
          if (!wanted) await source.pause();
          return false;
        }
        playing = true;
        return true;
      } catch {
        if (current === revision) playing = false;
        return false;
      }
    },
    async pause() {
      ++revision;
      wanted = false;
      try {
        await source.pause();
        playing = false;
        return true;
      } catch {
        wanted = playing;
        return false;
      }
    },
  };
}
