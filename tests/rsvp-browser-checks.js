async (page) => {
  const check = (ok, message) => { if (!ok) throw Error(message); };
  let mode = 'success';
  let posts = [];
  let releasePending;
  const openCover = async () => {
    await page.getByRole('button', { name: 'Chạm để mở thiệp', exact: true }).click();
    await page.locator('#cover').waitFor({ state: 'hidden' });
    await page.waitForFunction(() => document.querySelector('#rsvp-fields')?.disabled === false);
  };
  const openInvitation = async (search = '') => {
    await page.goto('http://127.0.0.1:8000/' + search);
    await openCover();
  };
  // Intercept the external boundary: regression tests must never add real guest rows.
  await page.route('https://script.google.com/macros/s/**', async route => {
    const request = route.request();
    if (request.method() !== 'POST') return route.abort();
    posts.push(new URLSearchParams(request.postData()));
    if (mode === 'network') return route.abort();
    if (mode === 'pending') await new Promise(resolve => { releasePending = resolve; });
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: mode === 'rejected' ? '{"ok":false}' : '{"ok":true}' });
  });
  try {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://127.0.0.1:8000/?khach=' + encodeURIComponent('Anh Minh & gia đình'));
    check(await page.locator('#rsvp form').count() === 1, 'The existing personalized invitation contains the RSVP form');
    await openCover();
    check(new URL(page.url()).pathname === '/', 'RSVP stays inside the original invitation URL');
    check(await page.locator('#main > section').evaluateAll(sections => sections.map(section => section.id).join(',').includes('gallery,rsvp,gifts')), 'RSVP sits immediately after album and before wedding gifts');
    check(await page.locator('a[href*="xac-nhan.html"]').count() === 0, 'Invitation does not send guests to a separate page');
    const name = page.getByLabel('Tên khách mời', { exact: true });
    await name.waitFor();
    check(await name.inputValue() === 'Anh Minh & gia đình', 'Guest name carries over automatically');
    const count = page.getByLabel('Số người tham dự', { exact: true });
    const yes = page.getByLabel('Sẽ tham dự', { exact: true });
    const no = page.getByLabel('Không thể tham dự', { exact: true });
    check(await count.isHidden(), 'Party size is hidden until attending');
    check(await page.locator('textarea').count() === 0, 'No message field');
    await yes.check();
    check(await count.isVisible(), 'Attending shows the party-size dropdown');
    check((await count.locator('option').allTextContents()).join(',') === '1,2,3,4,5,6,7,8,9,10', 'Native dropdown offers exactly 1–10');
    await count.selectOption('3');
    mode = 'pending';
    await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    await page.getByRole('button', { name: 'Đang gửi…', exact: true }).waitFor();
    check(await yes.isDisabled() && await name.isDisabled(), 'Pending request disables editing and duplicate clicks');
    check(!(await page.locator('#rsvp-status').innerText()).includes('Đã lưu'), 'No premature success');
    await page.waitForFunction(() => document.querySelector('#rsvp-form').getAttribute('aria-busy') === 'true');
    if (!releasePending) throw Error('POST not observed');
    releasePending();
    await page.getByRole('button', { name: 'Đã xác nhận', exact: true }).waitFor();
    check(posts.length === 1 && posts[0].get('count') === '3' && posts[0].get('name') === 'Anh Minh & gia đình', 'One correctly encoded request with total party size');
    check((await page.locator('#rsvp-status').innerText()).includes('Đã lưu'), 'Success only after acknowledgment');
    const polish = await page.locator('#rsvp').evaluate(section => ({
      noStorageNotice: !section.textContent.includes('Thông tin xác nhận được gửi đến'),
      centeredSuccess: getComputedStyle(section.querySelector('#rsvp-status')).textAlign === 'center',
    }));
    check(polish.noStorageNotice && polish.centeredSuccess, `RSVP presentation: ${JSON.stringify(polish)}`);
    for (const failure of ['rejected', 'network']) {
      mode = failure;
      await page.reload();
      await openCover();
      await no.check();
      check(await count.isHidden(), 'Declining hides count');
      await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
      await page.locator('#rsvp-status[data-state="error"]').waitFor();
      check(await page.getByRole('button', { name: 'Xác nhận', exact: true }).isEnabled(), 'Failure permits retry');
      check(posts.at(-1).get('count') === '0', 'Declined invitation sends zero');
      check(!(await page.locator('#rsvp-status').innerText()).includes('Đã lưu'), 'Failure never claims saved');
    }
    mode = 'success';
    await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    await page.getByRole('button', { name: 'Đã xác nhận', exact: true }).waitFor();
    await openInvitation();
    check(await name.inputValue() === '', 'General invitation allows manually entering a name');
    await yes.check();
    const beforeBlankSubmit = posts.length;
    await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    check(posts.length === beforeBlankSubmit, 'Empty name is never submitted');
    await name.fill('   ');
    await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    await page.locator('#rsvp-status[data-state="error"]').waitFor();
    check(posts.length === beforeBlankSubmit, 'Whitespace-only name is rejected');
    await openInvitation('?khach=' + encodeURIComponent('<img src=x onerror=alert(1)>'));
    check((await name.inputValue()).startsWith('<img') && await page.locator('.rsvp-card img').count() === 0, 'Guest names are input text, not injected HTML');
    await openInvitation('?khach=Anh+Minh');
    for (const width of [320, 375, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await yes.check();
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Form fits ${width}px`);
    }
    await page.setViewportSize({ width: 375, height: 667 });
    await name.focus();
    await page.locator('#rsvp').screenshot({ path: '/tmp/opencode/wedding-rsvp-inline.png' });
    await page.goto('http://127.0.0.1:8000/xac-nhan.html?khach=Ch%E1%BB%8B+Lan');
    await page.waitForFunction(() => document.querySelector('#rsvp-fields')?.disabled === false);
    check(await name.inputValue() === 'Chị Lan', 'Previously published standalone page still works for compatibility');
    check(!(await page.locator('.rsvp-card').innerText()).includes('Thông tin xác nhận được gửi đến'), 'Standalone compatibility page also omits the storage notice');
    return { inlinePlacement: 'after gallery, before gifts PASS', originalGuestURL: 'PASS', guestName: 'PASS', dropdown: '1–10 PASS', pendingAndDuplicates: 'PASS', confirmedSave: 'PASS', failedSaveAndRetry: 'PASS', decline: 'zero PASS', generalLink: 'PASS', literalText: 'PASS', responsive: '320–1440px PASS', standaloneCompatibility: 'PASS' };
  } finally { await page.unroute('https://script.google.com/macros/s/**'); }
}
