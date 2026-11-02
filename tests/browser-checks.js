// Run using Playwright browser_run_code_unsafe with this file's absolute filename.
// No dependencies or test framework are required by the static site.
async (page) => {
  await page.route('**/*', route => route.continue());
  const origin = 'http://127.0.0.1:8000';
  const results = [];
  const errors = [];
  const failedRequests = [];
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
    results.push(message);
  };
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failedRequests.push(response.url()); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).waitFor();
  check(await page.locator('#main').evaluate(element => element.inert), 'Cover keeps underlying invitation out of the tab order');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  await page.waitForFunction(() => !document.querySelector('#music-toggle').disabled);
  check(await page.locator('#cover').isHidden(), 'Opening reveals invitation');
  check(await page.locator('audio').evaluate(audio => !audio.paused && audio.loop && audio.duration > 0), 'Real local music plays and loops after opening');
  check(await page.getByRole('button', { name: 'Tắt nhạc nền' }).count() === 1, 'Music control reflects playback');
  await page.getByRole('button', { name: 'Tắt nhạc nền' }).click();
  check(await page.locator('audio').evaluate(audio => audio.paused), 'Music can be paused');
  await page.getByRole('button', { name: 'Bật nhạc nền' }).click();
  await page.waitForFunction(() => !document.querySelector('#music-toggle').disabled);
  check(await page.locator('audio').evaluate(audio => !audio.paused), 'Music can resume');
  await page.getByRole('button', { name: 'Tắt nhạc nền' }).click();
  for (const name of ['Vũ Thùy Linh', 'Lê Tuấn Dương', 'Vũ Trung Nghĩa', 'Nghiêm Thị Vượng', 'Lê Văn Hán', 'Đỗ Thị Thanh', 'Queen Bee Luxury']) {
    check(await page.getByText(name, { exact: true }).count() > 0, `Approved content: ${name}`);
  }
  check((await page.locator('#map-link').getAttribute('href')).includes('google.com/maps/place/Queen+Bee+Luxury'), 'Directions use approved Maps link');
  check(await page.getByText('QR sẽ được cập nhật', { exact: true }).count() === 2, 'Both gifts safely show pending QR');
  check(await page.locator('.copy-account').count() === 0, 'Missing accounts have no copy action');
  await page.locator('.gallery-link').first().click();
  check(await page.locator('#photo-dialog').evaluate(dialog => dialog.open), 'Album opens accessible photo dialog');
  await page.keyboard.press('Escape');
  check(await page.locator('#photo-dialog').evaluate(dialog => !dialog.open), 'Escape closes photo dialog');
  check(await page.locator('.gallery-link').first().evaluate(link => link === document.activeElement), 'Photo dialog returns focus to album');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.screenshot({ path: '/tmp/opencode/wedding-desktop.png', fullPage: true });
  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/opencode/wedding-mobile.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile cover fits viewport');
  await page.screenshot({ path: '/tmp/opencode/wedding-cover.png' });

  const browser = page.context().browser();
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const fallback = await noJS.newPage();
  await fallback.goto(origin);
  check(await fallback.locator('#cover').isHidden(), 'No JavaScript: no blocking cover');
  check(await fallback.getByRole('heading', { name: 'Queen Bee Luxury', exact: true }).isVisible(), 'No JavaScript: venue remains readable');
  check(await fallback.locator('#music-toggle').isHidden(), 'No JavaScript: no dead music control');
  await noJS.close();

  const clockContext = await browser.newContext({ timezoneId: 'America/New_York', reducedMotion: 'reduce' });
  const clockPage = await clockContext.newPage();
  await clockPage.clock.install({ time: new Date('2026-11-28T09:59:00Z') });
  await clockPage.clock.pauseAt(new Date('2026-11-28T10:00:00Z'));
  await clockPage.goto(origin);
  await clockPage.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await clockPage.locator('#cover').waitFor({ state: 'hidden' });
  check(await clockPage.locator('[data-unit=days]').innerText() === '01', 'Countdown uses Vietnam event time even in New York');
  await clockPage.clock.fastForward(86401000);
  check(await clockPage.locator('#countdown').isHidden(), 'Expired countdown is hidden, never negative');
  check(await clockPage.locator('#countdown-message').isVisible(), 'Wedding day shows celebration message');
  check(await clockPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto'), 'Reduced-motion setting disables smooth scrolling');
  await clockContext.close();

  const blockedContext = await browser.newContext();
  const blocked = await blockedContext.newPage();
  await blocked.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new Error('Playback blocked')); });
  await blocked.goto(origin);
  await blocked.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await blocked.locator('#cover').waitFor({ state: 'hidden' });
  await blocked.waitForFunction(() => !document.querySelector('#music-toggle').disabled);
  check(await blocked.locator('#cover').isHidden(), 'Playback failure does not block opening');
  check(await blocked.getByRole('button', { name: 'Bật nhạc nền' }).isEnabled(), 'Playback failure leaves a retry control');
  await blockedContext.close();

  const subpathContext = await browser.newContext();
  const subpath = await subpathContext.newPage();
  await subpath.route('**/demo/**', async route => {
    const response = await route.fetch({ url: route.request().url().replace('/demo/', '/') });
    await route.fulfill({ response });
  });
  await subpath.goto(`${origin}/demo/`);
  await subpath.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await subpath.locator('#cover').waitFor({ state: 'hidden' });
  await subpath.waitForFunction(() => !document.querySelector('#music-toggle').disabled);
  check(await subpath.locator('audio').evaluate(audio => !audio.paused), 'Music works under a GitHub project subpath');
  check(await subpath.locator('#hero-photo').evaluate(image => image.complete && image.naturalWidth > 0), 'Images work under a GitHub project subpath');
  await subpathContext.close();
  check(errors.length === 0, `No page errors: ${errors.join(', ') || 'none'}`);
  check(failedRequests.length === 0, `No failed local assets: ${failedRequests.join(', ') || 'none'}`);
  return { passed: results.length, checks: results, screenshots: ['/tmp/opencode/wedding-desktop.png', '/tmp/opencode/wedding-mobile.png', '/tmp/opencode/wedding-cover.png'] };
}
