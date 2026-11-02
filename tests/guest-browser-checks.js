async (page) => {
  await page.route('**/*', route => route.continue());
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto('http://127.0.0.1:8000/tao-link.html');
  if (response.status() !== 200) throw new Error('Guest link generator is missing');
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.getByLabel('Tên khách mời').fill('😀'.repeat(120));
  check(Array.from(await page.locator('#guest-preview').innerText()).length === 120, 'Unicode names reach the shared 120-character boundary without premature truncation');
  await page.getByLabel('Tên khách mời').fill('Anh Minh & gia đình');
  check(await page.locator('#guest-preview').innerText() === 'Anh Minh & gia đình', 'Preview updates to the typed guest');
  await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
  const link = await page.getByLabel('Link mời riêng').inputValue();
  check(new URL(link).searchParams.get('khach') === 'Anh Minh & gia đình', 'Generated link safely encodes the whole name');
  await page.getByLabel('Tên khách mời').fill('Chị Lan');
  check(await page.locator('#link-result').isHidden(), 'Editing a name hides the old link to prevent sending the wrong name');
  await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
  const secondLink = await page.getByLabel('Link mời riêng').inputValue();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard denied'); } } }));
  await page.getByRole('button', { name: 'Sao chép link', exact: true }).click();
  check((await page.locator('#generator-status').innerText()).includes('thủ công'), 'Clipboard rejection provides manual-copy guidance');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.reload();
  await page.getByLabel('Tên khách mời').fill('Anh Minh & gia đình');
  await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
  await page.getByRole('button', { name: 'Sao chép link', exact: true }).click();
  check(await page.evaluate(() => navigator.clipboard.readText()) === link, 'Copy button writes the actual personalized link');
  const other = await page.context().newPage();
  try {
    await page.goto(link);
    await other.goto(secondLink);
    await page.locator('#cover').waitFor({ state: 'visible' });
    await other.locator('#cover').waitFor({ state: 'visible' });
    check(await page.locator('#guest-name').innerText() === 'Anh Minh & gia đình', 'First guest receives their own name');
    check(await other.locator('#guest-name').innerText() === 'Chị Lan', 'Second guest receives a different name concurrently');
    await page.goto('http://127.0.0.1:8000/?khach=' + encodeURIComponent('<img src=x onerror=alert(1)>'));
    check(await page.locator('#guest-name img').count() === 0 && (await page.locator('#guest-name').innerText()).includes('<img'), 'URL input is literal text, never injected HTML');
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://127.0.0.1:8000/?khach=' + 'W'.repeat(200));
    await page.locator('#cover').waitFor({ state: 'visible' });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('#cover').scrollWidth <= innerWidth), 'Long names wrap within a small mobile cover');
    await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
    await page.locator('#cover').waitFor({ state: 'hidden' });
    await page.goto('http://127.0.0.1:8000/');
    await page.locator('#cover').waitFor({ state: 'visible' });
    check(await page.locator('#guest-name').isHidden(), 'Plain invitation keeps the general salutation');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('http://127.0.0.1:8000/tao-link.html');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Generator fits ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByLabel('Tên khách mời').fill('Gia đình bác Hùng');
    await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
    await page.screenshot({ path: '/tmp/opencode/wedding-guest-generator.png', fullPage: true });
    return { generator: 'PASS', preview: 'PASS', copy: 'success and failure PASS', independentGuests: 'PASS', literalText: 'PASS', generalLink: 'PASS', responsive: '320–1440px PASS' };
  } finally { await other.close(); }
}
