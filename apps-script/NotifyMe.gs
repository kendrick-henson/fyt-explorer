/**
 * BRYC Find Your Thing — separate private "I'm Interested" intake web app.
 *
 * Deploy in a NEW Apps Script project, not the public opportunity-feed project.
 * Script Properties (Project Settings):
 *   FYT_TRACKER_ID: ID of staff-only "Interest Requests" Google Sheet
 *   FYT_OPPORTUNITIES_ID: ID of the FYT opportunity inventory Google Sheet
 * Deploy Web app: Execute as "Me", Who has access: "Anyone".
 *
 * This project exposes only doPost and returns NO names, records or sheet data.
 * Review BRYC's youth data/photo and privacy rules before enabling.
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<p>BRYC Find Your Thing interest intake. Submit a request through the Explorer.</p>');
}
function doPost(e) {
  try {
    const p = e && e.parameter || {};
    if (p.website) return reply_('Your request was received.', true); // bot honeypot
    if (p.consent !== 'yes') throw Error('Consent required');
    const first = clean_(p.firstName, 40);
    const last = clean_(p.lastName, 50);
    const id = clean_(p.opportunityId, 16);
    if (!/^[\\p{L}\\p{M} .'-]{1,40}$/u.test(first) ||
        !/^[\\p{L}\\p{M} .'-]{1,50}$/u.test(last)) throw Error('Name required');
    if (!/^FYT-\\d{5}$/.test(id)) throw Error('Invalid opportunity');
    const props = PropertiesService.getScriptProperties();
    const sourceId = props.getProperty('FYT_OPPORTUNITIES_ID');
    const trackerId = props.getProperty('FYT_TRACKER_ID');
    if (!sourceId || !trackerId) throw Error('Not configured');
    const source = SpreadsheetApp.openById(sourceId).getSheetByName('2026-2027 (IP)');
    const rows = source.getDataRange().getDisplayValues();
    const header = rows[1] || [];
    const idCol = header.indexOf('Opportunity ID');
    const statusCol = header.indexOf('Explorer Status');
    const nameCol = header.indexOf('Opportunity Name');
    if ([idCol, statusCol, nameCol].some(i => i < 0)) throw Error('Missing columns');
    const matching = rows.slice(2).find(row =>
      row[idCol] === id && row[statusCol] === 'Ready to Publish');
    if (!matching) throw Error('Opportunity not currently published');

    const sheet = SpreadsheetApp.openById(trackerId).getSheetByName('Interest Requests');
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      // Avoid duplicate submissions for the same Fellow/program in a short window.
      const key = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        [first.toLowerCase(),last.toLowerCase(),id].join('|'))
        .map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
      const cache = CacheService.getScriptCache();
      if (!cache.get(key)) {
        const now = new Date();
        // Sanitize before writing to Sheets (formula injection).
        const safeCell = x => /^[=+@\\-]/.test(x) ? "'" + x : x;
        sheet.appendRow([
          Utilities.getUuid(), now, safeCell(first), safeCell(last), '',
          id, matching[nameCol], 'Interested / Notify Me', 'New', '', now
        ]);
        cache.put(key,'1',90);
      }
    } finally {
      lock.releaseLock();
    }
    return reply_('Your interest has been shared with BRYC staff. This is not a program application.',true);
  } catch (err) {
    console.error(err);
    return reply_('We could not save your request. Please ask BRYC staff for help.',false);
  }
}
function clean_(value, limit) {
  return String(value || '').trim().replace(/\\s+/g,' ').slice(0,limit);
}
function reply_(message, success) {
  const color=success?'#267243':'#AB3050';
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>BRYC Find Your Thing</title><body style="font:16px Arial,sans-serif;max-width:500px;margin:48px auto;padding:22px;color:#333">'+
    '<h1 style="color:'+color+'">BRYC Find Your Thing</h1><p>'+message+'</p>'+
    '<p><a href="https://kendrick-henson.github.io/fyt-explorer/opportunities.html">Return to opportunities</a></p></body></html>');
}
