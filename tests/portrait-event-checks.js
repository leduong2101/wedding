async (page) => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8000');
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  const failures = [];
  for (const [role, file] of [['groom', 'GAA04671-waist-hq.webp'], ['bride', 'GAA04303-waist-hq.webp']]) {
    const image = page.locator(`[data-person-photo="${role}"]`);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
    if (!(await image.getAttribute('src')).endsWith(file)) failures.push(`${role} is not using the new original-quality crop`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const image of await page.locator('.person-avatar img, .couple-keepsake img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
    const adequateResolution = await image.evaluate(image => {
      const box = image.getBoundingClientRect();
      return image.naturalWidth >= box.width * 3 && image.naturalHeight >= box.height * 3;
    });
    if (!adequateResolution) failures.push(`Insufficient image pixels for a 3x display: ${await image.getAttribute('src')}`);
  }
  if ((await page.locator('.event-info h3').innerText()) !== 'Lễ Thành hôn') failures.push('Reception title not updated');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const centered = await page.locator('#map-link').evaluate(button => {
      const text = [...button.childNodes].find(node => node.textContent.trim() === 'Xem bản đồ');
      if (!text) return false;
      const range = document.createRange();
      range.selectNodeContents(text);
      const label = range.getBoundingClientRect();
      const box = button.getBoundingClientRect();
      return Math.abs(label.x + label.width / 2 - box.x - box.width / 2) < 1;
    });
    if (!centered) failures.push(`Map label is off-center at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.family-grid').screenshot({ path: '/tmp/opencode/wedding-waist-portraits.png' });
  await page.locator('.event-card').screenshot({ path: '/tmp/opencode/wedding-ceremony-card.png' });
  if (failures.length) throw new Error(failures.join('; '));
  return { portraits: 'wider waist-up crops loaded', eventTitle: 'PASS', mapLabelCenteredAt: [320, 390, 768, 1440] };
}
