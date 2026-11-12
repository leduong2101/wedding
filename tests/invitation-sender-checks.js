async page => {
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 844 });
  const origin = 'http://127.0.0.1:8000';
  const check = (ok, message) => { if (!ok) throw Error(message); };
  const links = [];
  for (const sender of ['children', 'parents']) {
    for (const gifts of [false, true]) {
      await page.goto(origin + '/tao-link.html');
      await page.waitForFunction(() => !document.querySelector('#generator-fields').disabled);
      check(await page.getByLabel('Người gửi thiệp').inputValue() === 'children', 'Default sender is the couple');
      check(!await page.locator('#show-gifts').isChecked(), 'Gifts still default to unchecked');
      await page.getByLabel('Tên khách mời').fill('Gia đình bác Hùng');
      await page.getByLabel('Người gửi thiệp').selectOption(sender);
      await page.locator('#show-gifts').setChecked(gifts);
      await page.getByRole('button', { name: 'Tạo link', exact: true }).click();
      links.push({ sender, gifts, url: await page.locator('#guest-link').inputValue() });
      await page.getByLabel('Người gửi thiệp').selectOption(sender === 'parents' ? 'children' : 'parents');
      check(await page.locator('#link-result').isHidden() && await page.locator('#guest-link').inputValue() === '' && !await page.locator('#open-guest-link').getAttribute('href'), 'Changing sender clears all stale link actions');
    }
  }
  for (const { sender, gifts, url } of links) {
    await page.goto(url);
    await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
    await page.locator('#cover').waitFor({ state: 'hidden' });
    const parents = sender === 'parents';
    check(await page.locator('.hero-intro').innerText() === (parents ? 'Các con sắp về chung một nhà' : 'Chúng mình sắp về chung một nhà'), 'Hero wording matches sender');
    check((await page.locator('.opening-note p').innerText()).includes((parents ? 'hai con' : 'hai ta') + ' cùng nhau bước tiếp'), 'Quote wording matches sender');
    check(await page.locator('#gifts').isHidden() === !gifts, 'Gift visibility is independent of sender');
    check(await page.locator('#rsvp-name').inputValue() === 'Gia đình bác Hùng', 'RSVP personalization is unchanged');
    check(await page.locator('#gallery-heading').innerText() === 'Love story' && await page.locator('.gallery-link').count() === 6, 'Album remains unchanged');
    check((await page.locator('.event-timeline time').allTextContents()).join(',') === '17:00,17:15,17:30', 'Timeline remains unchanged');
    check((await page.locator('.thanks-message').innerText()).includes('và gia đình chúng tôi'), 'Closing wording remains unchanged');
    if (parents) {
      await page.reload();
      await page.locator('#cover').waitFor({ state: 'visible' });
      check(await page.locator('#journey-pronoun').innerText() === 'hai con', 'Sender survives reload');
    }
  }
  await page.goto(origin + '/?khach=Kh%C3%A1ch+c%C5%A9');
  await page.locator('#cover').waitFor({ state: 'visible' });
  check(await page.locator('.hero-intro').innerText() === 'Chúng mình sắp về chung một nhà' && await page.locator('#journey-pronoun').innerText() === 'hai ta', 'Old links retain the couple wording');
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(origin + '/tao-link.html');
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Generator fits ${width}px`);
  }
  return { defaultSender: 'children PASS', senderAndGiftCombinations: '4 PASS', staleLinks: 'cleared PASS', legacyLinks: 'unchanged PASS', RSVPAlbumTimeline: 'unchanged PASS', responsive: '320–1440px PASS' };
}
