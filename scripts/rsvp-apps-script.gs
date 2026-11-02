const RSVP_SHEET_ID = '1soDV223zsvq3Tw2MQqSJM8LwA5T5XZQnqOhI8FBv1Mg';

function rsvpJson(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

// Health check only: never return guest names or spreadsheet contents.
function doGet() {
  return rsvpJson({ ok: true, service: 'wedding-rsvp' });
}

function doPost(e) {
  const p = e && e.parameter || {};
  const name = String(p.name || '').normalize('NFC').replace(/\s+/g, ' ').trim();
  const attending = p.attendance === 'yes';
  if (!name || Array.from(name).length > 120 ||
      !['yes', 'no'].includes(p.attendance) ||
      (attending && !/^(?:[1-9]|10)$/.test(String(p.count || '')))) {
    return rsvpJson({ ok: false, message: 'Vui lòng kiểm tra tên và số người tham dự.' });
  }

  let lock;
  let locked = false;
  try {
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    locked = true;
    const book = SpreadsheetApp.openById(RSVP_SHEET_ID);
    const sheet = book.getSheetByName('Xác nhận tham dự') || book.insertSheet('Xác nhận tham dự');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Thời gian xác nhận', 'Tên khách', 'Trạng thái', 'Số người tham dự']);
    }
    // Leading apostrophe makes every name literal text, not a Sheets formula.
    sheet.appendRow([new Date(), "'" + name,
      attending ? 'Sẽ tham dự' : 'Không thể tham dự', attending ? Number(p.count) : 0]);
    SpreadsheetApp.flush();
    return rsvpJson({ ok: true });
  } catch (error) {
    return rsvpJson({ ok: false, message: 'Chưa xác nhận lưu được. Vui lòng thử lại sau.' });
  } finally {
    if (locked) lock.releaseLock();
  }
}
