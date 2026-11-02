async (page) => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  const expected = ['04981', '04671', '04303', '04528', '04132', '03832', '03386', '02717'];
  const images = page.locator('#main img');
  if (await images.count() !== expected.length) throw new Error('Expected all eight requested photos');
  for (let i = 0; i < expected.length; i++) {
    const image = images.nth(i);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
    if (!(await image.getAttribute('src')).includes(expected[i])) throw new Error(`Wrong photo at ${i}`);
    if (!(await image.evaluate(image => image.naturalWidth > 0))) throw new Error('Photo failed to load');
  }
  await page.locator('.couple-keepsake').screenshot({ path: '/tmp/opencode/wedding-couple-photo.png' });
  await page.locator('.gallery-link').nth(1).click();
  await page.locator('#dialog-image').evaluate(image => image.decode());
  if (!(await page.locator('#dialog-image').getAttribute('src')).includes('03386')) throw new Error('Incorrect album enlargement');
  await page.keyboard.press('Escape');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))) throw new Error(`Overflow ${width}`);
  }
  await page.screenshot({ path: '/tmp/opencode/wedding-real-photos-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/opencode/wedding-real-photos-mobile.png', fullPage: true });
  return { photosLoaded: expected.length, albumDialog: 'PASS', responsiveWidths: [320, 390, 768, 1440] };
}
