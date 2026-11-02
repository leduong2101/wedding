// Run with Playwright browser_run_code_unsafe, after starting the local server.
async (page) => {
  await page.route('**/*', route => route.continue());
  const checks = [];
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000');
  check(await page.locator('.envelope').count() === 1, 'Cover presents a sealed paper envelope');
  check(await page.locator('.wax-seal').isVisible(), 'Envelope has the couple’s wax seal');
  check(await page.locator('nav').count() === 0, 'Invitation is a vertical experience without a navigation bar');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  check(await page.locator('.envelope-flap').evaluate(element => element.getAnimations().length > 0), 'Opening animates the envelope flap');
  await page.locator('#cover').waitFor({ state: 'hidden' });
  await page.waitForFunction(() => !document.querySelector('#music-toggle').disabled);
  check(await page.locator('audio').evaluate(audio => !audio.paused && audio.loop && audio.currentSrc.endsWith('/assets/beautiful-in-white-70s.mp3') && Math.abs(audio.duration - 70) < 0.15), 'Beautiful in White loops the requested first 70 seconds');
  const hero = await page.locator('#home').boundingBox();
  const image = await page.locator('#hero-photo').boundingBox();
  check(hero.height >= 844 && image.width >= 390 && image.height >= 844, 'Hero artwork fills the first mobile screen');
  check(await page.locator('.person-avatar').count() === 2, 'Both partners have portrait frames');
  check(await page.locator('.person-avatar').first().evaluate(element => getComputedStyle(element).borderRadius === '50%'), 'Partner portraits have circular frames');
  check(await page.locator('.event-card').count() === 1, 'Only one shared reception is shown');
  const bride = page.getByRole('tab', { name: 'Cô dâu', exact: true });
  const groom = page.getByRole('tab', { name: 'Chú rể', exact: true });
  await groom.scrollIntoViewIfNeeded();
  check(await groom.getAttribute('aria-selected') === 'true', 'Groom gift tab is initially selected');
  check(await page.locator('#gift-groom').isVisible() && await page.locator('#gift-bride').isHidden(), 'Only the selected gift panel is visible');
  await bride.click();
  check(await bride.getAttribute('aria-selected') === 'true' && await page.locator('#gift-bride').isVisible() && await page.locator('#gift-groom').isHidden(), 'Selecting bride switches to her gift panel');
  check(await page.locator('#gift-bride').getByText('QR sẽ được cập nhật', { exact: true }).isVisible(), 'Pending bride QR remains honest');
  await page.keyboard.press('ArrowLeft');
  check(await groom.evaluate(element => element === document.activeElement) && await groom.getAttribute('aria-selected') === 'true', 'Arrow keys select and focus the adjacent gift tab');
  await page.keyboard.press('End');
  check(await bride.getAttribute('aria-selected') === 'true', 'End selects the final gift tab');
  await page.keyboard.press('Home');
  check(await groom.getAttribute('aria-selected') === 'true', 'Home selects the first gift tab');
  check(await page.locator('#home .music-notes').isVisible(), 'Sparse musical decoration appears in the hero');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Reference-inspired layout fits ${width}px`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  check(await page.locator('#home .music-notes').isHidden(), 'Reduced motion hides floating decorations');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: '/tmp/opencode/wedding-reference-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/opencode/wedding-reference-mobile.png', fullPage: true });
  await page.reload();
  await page.screenshot({ path: '/tmp/opencode/wedding-reference-envelope.png' });
  const context = await page.context().browser().newContext({ javaScriptEnabled: false });
  const fallback = await context.newPage();
  try {
    await fallback.goto('http://127.0.0.1:8000');
    check(await fallback.locator('#cover').isHidden(), 'No JavaScript: envelope never blocks the invitation');
    check(await fallback.locator('#gift-bride').isVisible() && await fallback.locator('#gift-groom').isVisible(), 'No JavaScript: both gift panels remain readable');
    check(await fallback.getByRole('tablist').count() === 0, 'No JavaScript: nonfunctional tabs are hidden');
  } finally {
    await context.close();
  }
  const emptyAlbumContext = await page.context().browser().newContext({ reducedMotion: 'reduce' });
  const emptyAlbum = await emptyAlbumContext.newPage();
  try {
    await emptyAlbum.route('**/js/config.js', async route => {
      const response = await route.fetch();
      const original = await response.text();
      await route.fulfill({ response, body: original + '\nwedding.photos = []; wedding.heroPhoto = { src: "assets/flowers.svg", alt: "Independent hero fixture" };' });
    });
    await emptyAlbum.goto('http://127.0.0.1:8000');
    await emptyAlbum.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).waitFor();
    check((await emptyAlbum.locator('#hero-photo').getAttribute('src')) === 'assets/flowers.svg', 'Configured hero photo is independent of an empty album');
  } finally {
    await emptyAlbumContext.close();
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return { passed: checks.length, checks };
}
