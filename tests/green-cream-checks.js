async (page) => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('http://127.0.0.1:8000/?khach=Anh+Minh');
  await page.locator('#cover').waitFor({ state: 'visible' });
  const problems = [];
  const closing = await page.locator('.thanks').innerText();
  if (!closing.includes('Cảm ơn bạn đã dành tình cảm cho chúng mình!') || !closing.includes('Sự hiện diện của bạn chính là món quà ý nghĩa nhất, và chúng mình vô cùng trân quý khi được cùng bạn chia sẻ niềm hạnh phúc trong ngày trọng đại này.')) problems.push('Closing text does not match the supplied reference');
  const cover = await page.locator('#cover').evaluate(el => ({ flower: getComputedStyle(el).backgroundImage.includes('flowers-orchid.svg'), envelope: getComputedStyle(el.querySelector('.envelope-pocket')).backgroundColor }));
  if (!cover.flower) problems.push('Cover has no floral decoration');
  const rgb = cover.envelope.match(/\d+/g).map(Number);
  if (!(rgb[1] > rgb[0] && rgb[1] > rgb[2])) problems.push('Envelope is not sage/forest green');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  const presentation = await page.evaluate(() => {
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = color => rgb(color).map(v => { const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    const body = getComputedStyle(document.body);
    const ink = rgb(body.color);
    const paper = rgb(body.backgroundColor);
    const samples = ['.event-info', '.thanks-message', '#rsvp-heading'].map(selector => {
      const el = document.querySelector(selector);
      if (!el) return { selector, contrast: 0 };
      let ancestor = el;
      while (ancestor.parentElement && getComputedStyle(ancestor).backgroundColor === 'rgba(0, 0, 0, 0)') ancestor = ancestor.parentElement;
      const a = luminance(getComputedStyle(el).color), b = luminance(getComputedStyle(ancestor).backgroundColor);
      return { selector, contrast: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
    });
    return {
      greenInk: ink[1] > ink[0] && ink[1] > ink[2],
      creamPaper: paper.every(v => v > 225) && paper[0] >= paper[2],
      flowers: ['#invitation', '#celebration', '#gifts'].every(selector => getComputedStyle(document.querySelector(selector)).backgroundImage.includes('flowers-orchid.svg')),
      samples,
    };
  });
  if (!presentation.greenInk || !presentation.creamPaper || !presentation.flowers) problems.push('Paper sections do not use the requested green/cream/floral theme');
  for (const sample of presentation.samples) if (sample.contrast < 4.5) problems.push(`Insufficient text contrast: ${sample.selector}`);
  for (const [width, height] of [[320, 568], [375, 844], [430, 932], [768, 1024], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) problems.push(`Horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 375, height: 844 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.activeElement?.blur());
  await page.locator('#celebration').screenshot({ path: '/tmp/opencode/wedding-green-invitation-375.png' });
  await page.locator('.thanks').screenshot({ path: '/tmp/opencode/wedding-green-ending-375.png' });
  await page.goto('http://127.0.0.1:8000/?khach=Anh+Minh');
  await page.locator('#cover').waitFor({ state: 'visible' });
  await page.screenshot({ path: '/tmp/opencode/wedding-green-cover-375.png' });
  if (problems.length) throw Error(problems.join('; '));
  return { closingCopy: 'PASS', greenCreamFloral: 'PASS', contrast: presentation.samples, responsive: '320–1440px PASS' };
}
