async (page) => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  await page.evaluate(() => document.fonts.ready);
  const sizes = [[320, 568], [375, 568], [375, 667], [390, 844], [430, 932], [667, 375], [844, 390]];
  const results = [];
  const failures = [];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    const result = await page.locator('#home').evaluate(hero => {
      const box = hero.getBoundingClientRect();
      const copy = hero.querySelector('.hero-copy').getBoundingClientRect();
      const names = hero.querySelector('.hero-names');
      return {
        width: innerWidth, height: innerHeight, heroHeight: box.height,
        textHeight: copy.height, textTopRatio: (copy.top - box.top) / box.height,
        nameSize: parseFloat(getComputedStyle(names).fontSize),
        noOverflow: document.documentElement.scrollWidth <= innerWidth && names.scrollWidth <= names.clientWidth,
        namesVisible: [...names.querySelectorAll('span')].every(name => {
          const rect = name.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= box.bottom;
        }),
      };
    });
    results.push(result);
    const landscape = width > height;
    if (result.textHeight > result.heroHeight * (landscape ? .45 : .34)) failures.push(`Text covers too much of ${width}×${height}: ${result.textHeight}px`);
    if (result.textTopRatio < (landscape ? .5 : .6)) failures.push(`Text starts over the couple at ${width}×${height}`);
    if (!result.noOverflow || !result.namesVisible) failures.push(`Names clipped at ${width}×${height}`);
    if (result.heroHeight > height + 1) failures.push(`Hero exceeds first screen at ${width}×${height}`);
  }
  if (!(results[2].nameSize > results[1].nameSize)) failures.push('Names do not shrink with reduced screen height');
  if (!(results[4].nameSize > results[3].nameSize)) failures.push('Names do not scale with screen width');
  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktop = await page.locator('.hero-names').evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), direction: getComputedStyle(element).flexDirection }));
  if (Math.abs(desktop.size - 93.6) > .1 || desktop.direction !== 'row') failures.push('Desktop hero styling changed');
  for (const [width, height] of [[375, 667], [390, 844], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await page.locator('#hero-photo').evaluate(image => image.decode());
    await page.locator('#home').screenshot({ path: `/tmp/opencode/wedding-fluid-hero-${width}.png` });
  }
  if (failures.length) throw new Error(failures.join('; '));
  return { mobile: results, desktop };
}
