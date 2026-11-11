async page => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 844 });
  const origin = 'http://127.0.0.1:8000';
  const check = (ok, message) => { if (!ok) throw Error(message); };
  await page.goto(origin + '/tao-link.html');
  await page.waitForFunction(() => !document.querySelector('#generator-fields').disabled);
  check(!await page.getByLabel('Hiển thị phần Mừng cưới', { exact: true }).isChecked(), 'New generator defaults to unchecked');
  await page.getByLabel('Tên khách mời').fill('Chị Lan & gia đình');
  await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
  const hiddenLink = await page.getByLabel('Link mời riêng').inputValue();
  check(new URL(hiddenLink).searchParams.get('mungcuoi') === '0', 'Unchecked link explicitly hides gifts');
  await page.getByLabel('Hiển thị phần Mừng cưới', { exact: true }).check();
  check(await page.locator('#link-result').isHidden() && !await page.locator('#open-guest-link').getAttribute('href') && await page.locator('#guest-link').inputValue() === '', 'Toggling option invalidates the old link');
  await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
  const shownLink = await page.getByLabel('Link mời riêng').inputValue();
  check(new URL(shownLink).searchParams.get('mungcuoi') !== '0', 'Checked link shows gifts');
  await page.getByLabel('Hiển thị phần Mừng cưới', { exact: true }).focus();
  await page.keyboard.press('Space');
  check(!await page.getByLabel('Hiển thị phần Mừng cưới', { exact: true }).isChecked() && await page.locator('#link-result').isHidden(), 'Keyboard toggling also invalidates the old link');
  const other = await page.context().newPage();
  try {
    await page.goto(hiddenLink);
    await other.goto(shownLink);
    for (const tab of [page, other]) {
      await tab.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
      await tab.locator('#cover').waitFor({ state: 'hidden' });
      check(await tab.locator('#rsvp-name').inputValue() === 'Chị Lan & gia đình', 'Personalization and RSVP name remain unchanged');
      check(await tab.locator('#rsvp').isVisible() && await tab.locator('.thanks').isVisible(), 'RSVP and closing stay visible');
      check(await tab.locator('.gallery-link').count() === 6, 'All six album photos remain');
    }
    check(await page.locator('#gifts').isHidden(), 'Hidden link hides the entire gift section');
    check(await other.locator('#gifts').isVisible(), 'Concurrent shown link has its own independent setting');
    await page.reload();
    await page.locator('#cover').waitFor({ state: 'visible' });
    check(await page.locator('#gifts').getAttribute('hidden') !== null, 'Hidden setting survives reload');
    await page.goto(origin + '/?khach=Kh%C3%A1ch+c%C5%A9');
    await page.locator('#cover').waitFor({ state: 'visible' });
    check(!await page.locator('#gifts').evaluate(el => el.hidden), 'Old links without the option retain gifts');
    await page.goto(origin + '/');
    await page.locator('#cover').waitFor({ state: 'visible' });
    check(!await page.locator('#gifts').evaluate(el => el.hidden), 'General invitation retains gifts');
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(origin + '/tao-link.html');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Generator fits ${width}px`);
    }
    return { uncheckedDefault: 'PASS', staleLinkPrevention: 'PASS', hiddenAndShownLinks: 'PASS', oldLinksAndGeneralInvitation: 'PASS', RSVPAndAlbum: 'unchanged', responsive: '320–1440px PASS' };
  } finally {
    await other.close();
  }
}
