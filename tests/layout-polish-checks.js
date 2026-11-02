// Browser regression for the approved cover, typography and section decoration fixes.
async (page) => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000');
  const checks = [];
  const check = (condition, message) => { checks.push({ message, passed: Boolean(condition) }); };
  const open = page.locator('#open-invitation');
  await open.waitFor();
  check(await page.locator('.envelope-letter strong, .wax-seal, .thanks-monogram').evaluateAll(elements => elements.length === 3 && elements.every(element => element.textContent.replace(/\s/g, '') === 'D&L')), 'All couple monograms show groom-first D&L');
  check((await open.innerText()).trim() === 'Chạm để mở thiệp', 'Opening invitation shows only the new centered prompt');
  check(await page.getByText('Chạm mở để nghe giai điệu hạnh phúc', { exact: true }).count() === 0, 'Obsolete music hint is removed');
  const buttonBox = await open.boundingBox();
  check(Math.abs(buttonBox.x + buttonBox.width / 2 - 195) < 1, 'Opening button is centered on mobile');
  await open.click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  check(JSON.stringify(await page.locator('#hero-title > span').allTextContents()) === JSON.stringify(['Tuấn Dương', 'Thùy Linh']), 'Hero names show the groom before the bride');
  check(await page.locator('.invitation-intro').count() === 0, 'Redundant family invitation sentence is removed');
  const quote = (await page.locator('.opening-note p').innerText()).replace(/[“”]/g, '').trim();
  check(quote === 'Hạnh phúc không phải là đích đến, mà là hành trình\nhai ta cùng nhau bước tiếp — nắm tay nhau qua từng mùa,\nthương nhau qua từng ngày bình dị.', 'Updated wedding quote keeps its three intentional lines');
  for (const selector of ['.parents strong', '#countdown [data-unit]', '#countdown-heading']) {
    check(await page.locator(selector).evaluateAll(elements => elements.length > 0 && elements.every(element => Number(getComputedStyle(element).fontWeight) >= 700)), `Emphasized typography: ${selector}`);
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const avatar = await page.locator('.person-avatar').first().boundingBox();
    check(Math.abs(avatar.width - (width <= 700 ? 154 : 175)) < 1, `Enlarged portraits retain their waist-up crop at ${width}px`);
    const couple = await page.locator('.couple-keepsake img').boundingBox();
    const expectedCouple = width <= 700 ? Math.min(480, width - 16, width - (width <= 360 ? 36 : 48) + 32) : 576;
    check(Math.abs(couple.width - expectedCouple) < 1, `Couple photo is larger without leaving the viewport at ${width}px`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`);
  }
  for (const section of ['#home', '#celebration']) {
    const notes = page.locator(`${section} .music-notes`);
    check(await notes.count() === 1, `${section} has local musical decoration`);
    if (await notes.count()) {
      check(await notes.getAttribute('aria-hidden') === 'true', `${section} notes are decorative`);
      check(await notes.evaluate(element => getComputedStyle(element).pointerEvents === 'none'), `${section} notes cannot block clicks`);
      check(await notes.locator('span').evaluateAll(elements => elements.length === 15 && elements.every(element => {
        const style = getComputedStyle(element);
        return /^[♪♫♩♬]$/.test(element.textContent) && parseFloat(style.fontSize) === 25 && Number(style.opacity) <= .22 && parseFloat(style.animationDuration) >= 20;
      })), `${section} has fifteen 25px notes that remain faint and slow`);
    }
  }
  check(await page.locator('.music-notes').count() === 2, 'Notes are limited to the hero and reception');
  check(await page.locator('.gallery-link > span').count() === 0, 'Album has no circular overlay badges');
  await page.locator('.gallery-link').first().click();
  check(await page.locator('#photo-dialog').isVisible(), 'Badge removal preserves photo enlargement');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  check(await page.locator('.music-notes').evaluateAll(elements => elements.length === 2 && elements.every(element => getComputedStyle(element).display === 'none')), 'Reduced motion hides both note layers');
  // Force lazy images to decode before inspecting crops and taking screenshots.
  for (const image of await page.locator('#main img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#home').screenshot({ path: '/tmp/opencode/wedding-polish-hero-mobile.png' });
  await page.locator('.couple-keepsake').screenshot({ path: '/tmp/opencode/wedding-polish-couple.png' });
  await page.screenshot({ path: '/tmp/opencode/wedding-polish-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#home').screenshot({ path: '/tmp/opencode/wedding-polish-hero-desktop.png' });
  await page.screenshot({ path: '/tmp/opencode/wedding-polish-desktop.png', fullPage: true });
  const failures = checks.filter(check => !check.passed);
  if (failures.length) throw new Error(JSON.stringify(failures));
  return { passed: checks.length, checks };
}
