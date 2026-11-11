async page => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const check = (ok, message) => { if (!ok) throw Error(message); };
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('http://127.0.0.1:8000/?khach=Anh+Minh');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  for (const [selector, file] of [['#hero-photo', 'GAA04981-retouched.webp'], ['[data-couple-photo]', 'GAA04528-retouched.webp'], ['[data-event-photo]', 'GAA04132-retouched.webp'], ['[data-person-photo="groom"]', 'GAA04671-waist-hq.webp'], ['[data-person-photo="bride"]', 'GAA04303-waist-hq.webp']]) {
    const image = page.locator(selector);
    check((await image.getAttribute('src')).endsWith(file), 'Correct photo: ' + selector);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
  }
  const order = ['03342', '04599', '03494', '05079', '02717', '04999'];
  const links = page.locator('.gallery-link');
  check(await links.count() === 6, 'Gallery has six photos');
  for (let i = 0; i < order.length; i++) {
    const link = links.nth(i);
    check((await link.getAttribute('href')).endsWith(`GAA${order[i]}-retouched.webp`), 'Correct gallery order');
    await link.click();
    await page.locator('#dialog-image').evaluate(image => image.decode());
    check((await page.locator('#dialog-image').getAttribute('src')).endsWith(`GAA${order[i]}-retouched.webp`), 'Lightbox opens matching photo');
    await page.keyboard.press('Escape');
  }
  for (const role of ['groom', 'bride']) {
    await page.locator('#tab-' + role).click();
    const panel = page.locator('#gift-' + role);
    check(await panel.isVisible(), 'Correct recipient panel visible');
    await panel.locator('img').evaluate(image => image.decode());
    check((await panel.locator('img').getAttribute('src')).endsWith(`qr-${role}.png`), 'Correct recipient QR image');
    check(await panel.locator('.copy-account').isVisible(), 'Copy account available');
    // Mock clipboard only; never initiate a payment or send an RSVP.
    await page.evaluate(() => { window.copiedAccount = null; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.copiedAccount = text; } } }); });
    const account = await panel.locator('.account-number').innerText();
    await panel.locator('.copy-account').click();
    check(await page.evaluate(() => window.copiedAccount) === account, 'Copy uses this recipient account');
  }
  for (const width of [320, 375, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 375, height: 844 });
  await page.locator('#home').screenshot({ path: '/tmp/opencode/retouched-hero.png' });
  await page.locator('#gallery').screenshot({ path: '/tmp/opencode/retouched-gallery.png' });
  await page.locator('#gifts').screenshot({ path: '/tmp/opencode/updated-qr.png' });
  return { pagePhotos: 'PASS', unchangedPortraits: 'PASS', galleryOrderAndLightboxes: '6 PASS', recipientQRAndCopy: 'both PASS', responsive: '320–1440px PASS' };
}
