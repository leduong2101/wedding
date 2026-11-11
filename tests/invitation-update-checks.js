async (page) => {
  await page.route('**/*', route => route.continue());
  const check = (ok, message) => { if (!ok) throw Error(message); };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:8000/?khach=' + encodeURIComponent('Anh Minh và gia đình'));
  await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
  await page.locator('#cover').waitFor({ state: 'hidden' });
  const invitation = page.locator('#celebration');
  check((await invitation.innerText()).toLocaleLowerCase('vi').includes('trân trọng kính mời'), 'Page three presents the formal invitation');
  check(await page.locator('#event-guest').innerText() === 'Anh Minh và gia đình', 'Formal invitation uses the same guest name as the original link');
  check(await page.locator('.event-invitation-copy').innerText() === 'Đến dự bữa tiệc thân mật\nchung vui cùng gia đình chúng tôi.', 'Invitation copy matches the v2 annotation');
  check(await page.locator('.event-arrival-label').innerText() === 'Được tổ chức vào hồi', 'Time introduction matches the v2 annotation');
  check(await page.locator('.event-calendar + .event-lunar-date').innerText() === '(Tức ngày 21 tháng 10 năm Bính Ngọ)', 'Lunar date appears immediately after the solar date');
  check(await page.locator('.event-venue-prefix').innerText() === 'Tầng 2 Trung tâm tiệc cưới', 'Venue includes the requested second floor');
  check(await page.locator('#event-guest + .event-invitation-copy').count() === 1, 'Invitation copy sits immediately below the guest name');
  check(await page.locator('.event-info .event-invitation-copy').count() === 0, 'Invitation copy is not repeated below the ceremony title');
  const schedule = await page.locator('.event-timeline li').allInnerTexts();
  check(schedule.length === 3 && ['17:00', '17:15', '17:30'].every((time, i) => schedule[i].includes(time)), 'Timeline shows the three requested times in order');
  check((await page.locator('.event-timeline time').evaluateAll(elements => elements.map(el => el.dateTime))).join(',') === '17:00,17:15,17:30', 'Machine-readable timeline matches visible times');
  check(['Đón khách', 'Tổ chức hôn lễ', 'Khai tiệc'].every((label, i) => schedule[i].includes(label)), 'Timeline labels match the requested ceremony');
  check((await invitation.innerText()).includes('Queen Bee Luxury') && (await invitation.innerText()).includes('20 Láng Hạ'), 'Actual venue is retained, not replaced by reference venue');
  check(await page.locator('[data-date="day"]').first().innerText() === '29' && await page.locator('.event-calendar [data-date="month"]').innerText() === '11' && await page.locator('.event-calendar [data-date="year"]').innerText() === '2026', 'Reference calendar layout uses the actual wedding date');
  const map = await page.locator('#map-link').getAttribute('href');
  check(map.includes('Queen+Bee') || map.includes('Queen%20Bee'), 'Maps still links to the actual venue');
  check(await page.locator('#main > section').evaluateAll(sections => sections.map(section => section.id).join(',').includes('celebration,gallery,rsvp,gifts')), 'Existing invitation section order is unchanged');
  for (const width of [320, 375, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator('#celebration').scrollIntoViewIfNeeded();
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Invitation fits ${width}px without overflow`);
  }
  await page.setViewportSize({ width: 375, height: 844 });
  await page.evaluate(() => document.activeElement?.blur());
  await page.locator('#celebration').screenshot({ path: '/tmp/opencode/wedding-updated-invitation-375.png' });
  await page.goto('http://127.0.0.1:8000/');
  await page.waitForFunction(() => document.querySelector('#cover') && !document.querySelector('#cover').hidden);
  check(await page.locator('#event-guest').innerText() === 'Quý khách', 'General invitation retains a polite fallback guest name');
  await page.goto('http://127.0.0.1:8000/?khach=' + encodeURIComponent('<img src=x onerror=alert(1)>'));
  await page.waitForFunction(() => document.querySelector('#cover') && !document.querySelector('#cover').hidden);
  check((await page.locator('#event-guest').innerText()).startsWith('<img') && await page.locator('#event-guest img').count() === 0, 'Personalized formal invitation treats names as literal text');
  const fallbackContext = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 844 } });
  try {
    const fallback = await fallbackContext.newPage();
    await fallback.goto('http://127.0.0.1:8000/');
    check(await fallback.locator('.event-lunar-date').innerText() === '(Tức ngày 21 tháng 10 năm Bính Ngọ)', 'No JavaScript: lunar date is retained');
    check(await fallback.locator('.event-venue-prefix').innerText() === 'Tầng 2 Trung tâm tiệc cưới', 'No JavaScript: second floor is retained');
    check((await fallback.locator('.event-timeline time').allTextContents()).join(',') === '17:00,17:15,17:30', 'No JavaScript: updated timeline is retained');
    check((await fallback.locator('.gallery-link').nth(2).getAttribute('href')).includes('05079') && (await fallback.locator('.gallery-link').nth(3).getAttribute('href')).includes('03494'), 'No JavaScript: middle gallery photos retain the new order');
  } finally {
    await fallbackContext.close();
  }
  return { formalInvitation: 'PASS', personalizedAndGeneralGuest: 'PASS', schedule: '17:00 / 17:15 / 17:30 PASS', dateAndVenue: 'PASS', sectionOrder: 'PASS', responsive: '320–1440px PASS' };
}
