import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const path = new URL('../scripts/rsvp-apps-script.gs', import.meta.url);
const source = existsSync(path) ? readFileSync(path, 'utf8') : '';
function backend({ failWrite = false, failLock = false, failFlush = false } = {}) {
  const rows = [];
  let released = false;
  let flushed = false;
  const sheet = { getLastRow: () => rows.length, appendRow: row => {
    if (failWrite) throw Error('Private internal failure');
    rows.push(row);
  } };
  const context = vm.createContext({
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {
      if (failFlush) throw Error('Flush failed');
      flushed = true;
    } },
    LockService: { getScriptLock: () => ({ waitLock() { if (failLock) throw Error('Busy'); }, releaseLock() { released = true; } }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => {
      const value = JSON.parse(text);
      if (value.ok === true) assert.equal(flushed, true, 'Save success must follow flush');
      return { setMimeType: () => value };
    } },
  });
  vm.runInContext(source, context);
  return { context, rows, released: () => released };
}

test('RSVP handler saves attending guest and total party size before confirming', () => {
  const app = backend();
  assert.equal(typeof app.context.doPost, 'function');
  const result = app.context.doPost({ parameter: { name: '  Anh Minh  và gia đình ', attendance: 'yes', count: '3' } });
  assert.equal(result.ok, true);
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1][1], "'Anh Minh và gia đình");
  assert.equal(app.rows[1][2], 'Sẽ tham dự');
  assert.equal(app.rows[1][3], 3);
  assert.equal(app.released(), true);
});

test('declined invitation saves zero guests regardless of an old selection', () => {
  const app = backend();
  assert.equal(app.context.doPost({ parameter: { name: 'Chị Lan', attendance: 'no', count: '5' } }).ok, true);
  assert.equal(app.rows[1][2], 'Không thể tham dự');
  assert.equal(app.rows[1][3], 0);
});

test('invalid requests do not write rows', () => {
  for (const parameter of [{}, { name: ' ', attendance: 'yes', count: '1' }, { name: 'a'.repeat(121), attendance: 'yes', count: '1' }, { name: 'Lan', attendance: 'maybe', count: '1' }, ...['0', '11', '1.5', '2people', ''].map(count => ({ name: 'Lan', attendance: 'yes', count }))]) {
    const app = backend();
    assert.equal(app.context.doPost({ parameter }).ok, false);
    assert.equal(app.rows.length, 0);
  }
});

test('formula-like names are stored as literal text, never spreadsheet formulas', () => {
  const app = backend();
  app.context.doPost({ parameter: { name: '=IMPORTXML("https://example.com", "//x")', attendance: 'yes', count: '1' } });
  assert.ok(app.rows[1][1].startsWith("'="));
});

test('write and lock failures never report successful confirmation or leak internals', () => {
  for (const options of [{ failWrite: true }, { failLock: true }, { failFlush: true }]) {
    const app = backend(options);
    const response = app.context.doPost({ parameter: { name: 'Lan', attendance: 'yes', count: '1' } });
    assert.equal(response.ok, false);
    assert.ok(!JSON.stringify(response).includes('Private internal'));
  }
});
