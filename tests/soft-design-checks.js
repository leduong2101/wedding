// Playwright browser tool: run this file with browser_run_code_unsafe.
async (page) => {
  // Routing disables the browser HTTP cache so checks inspect the latest local CSS.
  await page.route('**/*', route => route.continue());
  const checks = [];
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  const contrast = (locator, background) => locator.evaluate((element, selector) => {
    const luminance = color => {
      const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(channel => {
        const value = channel / 255;
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
      });
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    };
    const text = luminance(getComputedStyle(element).color);
    const surface = luminance(getComputedStyle(document.querySelector(selector)).backgroundColor);
    return (Math.max(text, surface) + .05) / (Math.min(text, surface) + .05);
  }, background);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000');
  check(await contrast(page.locator('.cover-date'), '#cover') >= 4.5, 'Cover date remains legible at normal-text contrast');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  check(await page.locator('#cover').evaluate(element => !element.hidden && element.getAnimations({ subtree: true }).length > 0), 'Opening fades gently instead of disappearing immediately');
  await page.locator('#cover').waitFor({ state: 'hidden' });
  check(await page.locator('#main').evaluate(element => !element.inert), 'Animated opening releases invitation keyboard navigation');
  check(await page.locator('#home').evaluate(element => element === document.activeElement), 'Animated opening focuses the invitation');
  check(await contrast(page.getByRole('tab', { name: 'Chú rể', exact: true }), '#tab-groom') >= 4.5, 'Selected gift tab text stays legible');
  await page.evaluate(() => document.fonts.ready);
  check(await page.evaluate(() => Array.from(document.fonts).some(face => face.family === 'Dancing Script' && face.status === 'loaded') && document.fonts.check('32px "Dancing Script"', 'Vũ Thùy Linh Lê Tuấn Dương')), 'Handwritten names load a local Vietnamese-capable font');
  const textFits = await page.locator('.hero-names').evaluate(element => element.scrollWidth <= element.clientWidth);
  check(textFits, 'Handwritten names fit a mobile screen without clipping');
  const creamFoundation = await page.locator('body').evaluate(element => {
    const rgb = getComputedStyle(element).backgroundColor.match(/\d+/g).map(Number);
    return rgb[0] > 220 && rgb[1] > 210 && rgb[2] > 190;
  });
  check(creamFoundation, 'Invitation has a light cream foundation around the full-screen image');
  const gift = page.locator('.gift-card').first();
  await gift.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.gift-card').classList.contains('is-visible'));
  check(await gift.evaluate(element => Number(getComputedStyle(element).borderTopLeftRadius.replace('px', '')) >= 20), 'Gift cards have softer curved edges');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Soft layout fits ${width}px`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  check(await page.locator('#cover').evaluate(element => element.getAnimations({ subtree: true }).length === 0), 'Reduced motion skips the opening animation');
  check(await page.locator('.gift-card').first().evaluate(element => getComputedStyle(element).opacity === '1'), 'Reduced motion never leaves offscreen content faded out');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return { passed: checks.length, checks };
}
