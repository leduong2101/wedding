async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:8000/');
  await page.evaluate(() => document.fonts.ready);
  const results = [];
  for (const width of [320, 375, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const result = await page.evaluate(() => {
      const quote = document.querySelector('.opening-note p');
      const heading = document.querySelector('#gallery-heading');
      return { width: innerWidth, quote: parseFloat(getComputedStyle(quote).fontSize), heading: parseFloat(getComputedStyle(heading).fontSize), fits: [quote, heading].every(el => el.scrollWidth <= el.clientWidth) };
    });
    if (result.quote < 12 || result.quote > 14 || result.heading < 18 || result.heading > 26 || !result.fits) throw Error(JSON.stringify(result));
    results.push(result);
  }
  const mobile = results.find(result => result.width === 375);
  if (mobile.quote !== 12 || mobile.heading !== 20) throw Error('375px phone should show a 12px quote and 20px gallery title');
  if (results[0].quote >= results[2].quote || results[0].heading >= results[2].heading) throw Error('Typography must scale with screen size');
  return results;
}
