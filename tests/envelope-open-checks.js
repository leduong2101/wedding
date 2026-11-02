async (page) => {
  const check = (ok, message) => { if (!ok) throw Error(message); };
  const results = [];
  for (const mode of ['envelope', 'seal', 'keyboard-enter', 'keyboard-space', 'text-button']) {
    await page.emulateMedia({ reducedMotion: mode === 'envelope' ? 'no-preference' : 'reduce' });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://127.0.0.1:8000/?khach=Anh+Minh');
    await page.locator('#cover').waitFor({ state: 'visible' });
    await page.evaluate(() => {
      window.musicPlayCalls = 0;
      HTMLMediaElement.prototype.play = async function () { window.musicPlayCalls++; };
    });
    const envelope = page.locator('.envelope');
    if (mode === 'envelope') {
      await envelope.click({ position: { x: 15, y: 15 } });
      check(await page.locator('#cover').evaluate(cover => cover.classList.contains('is-opening')), 'Envelope click starts the original opening animation');
    } else if (mode === 'seal') {
      const box = await page.locator('.wax-seal').boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    } else if (mode.startsWith('keyboard-')) {
      const button = page.getByRole('button', { name: 'Mở thiệp từ phong bì', exact: true });
      await button.focus();
      await page.keyboard.press(mode === 'keyboard-enter' ? 'Enter' : 'Space');
    } else {
      await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
    }
    // A second activation during the animation must not toggle the music again.
    await page.evaluate(() => {
      document.querySelector('#open-invitation').click();
      document.querySelector('#open-envelope')?.click();
    });
    await page.locator('#cover').waitFor({ state: 'hidden', timeout: 5000 });
    check(await page.evaluate(() => window.musicPlayCalls === 1), `${mode}: audio starts exactly once`);
    check(await page.locator('#main').evaluate(main => !main.inert), `${mode}: invitation becomes interactive`);
    check(await page.locator('#music-toggle').isVisible(), `${mode}: music toggle is available`);
    check(await page.locator('#home').evaluate(home => home === document.activeElement), `${mode}: focus moves to the invitation`);
    results.push(mode + ' PASS');
  }
  return results;
}
