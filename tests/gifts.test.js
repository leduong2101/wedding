import test from 'node:test';
import assert from 'node:assert/strict';

const { getGiftDetails } = await import('../js/gifts.js').catch(() => ({}));

test('missing and incomplete gift data do not expose a payment instruction', () => {
  for (const gift of [null, {}, { qr: 'assets/qr.png' }, { bank: 'Bank', account: '123', holder: 'Name' }]) {
    assert.equal(getGiftDetails(gift), null);
  }
});

test('complete gift data allows display and copy of the real account', () => {
  assert.deepEqual(getGiftDetails({ qr: 'assets/qr-bride.png', bank: ' Bank ', account: ' 123456 ', holder: ' TEST ' }),
    { qr: 'assets/qr-bride.png', bank: 'Bank', account: '123456', holder: 'TEST' });
});

test('unsafe and remote QR locations are rejected', () => {
  for (const qr of ['javascript:alert(1)', 'data:image/svg+xml,foo', 'https://example.com/qr.png', '//example.com/qr.png', '/qr.png', '../qr.png']) {
    assert.equal(getGiftDetails({ qr, bank: 'Bank', account: '123', holder: 'Name' }), null);
  }
});
