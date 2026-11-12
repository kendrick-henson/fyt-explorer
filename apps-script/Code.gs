/**
 * BRYC Find Your Thing: PUBLIC, read-only Google Sheets feed.
 * Attach to FYT spreadsheet via Extensions > Apps Script, then deploy
 * as Web app (execute as Me; access Anyone).
 * Never return private/internal columns or a raw full row.
 */
function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('2026-2027 (IP)');
    if (!sheet) throw Error('Missing source sheet');
    const data = sheet.getDataRange().getDisplayValues();
    const headers = data[1];
    const key = name => {
      const i = headers.indexOf(name);
      if (i < 0) throw Error('Missing column ' + name);
      return i;
    };
    const fields = {
      status:key('Explorer Status'), id:key('Opportunity ID'), name:key('Opportunity Name'),
      org:key('Organization'), url:key('Public Link'),
      communities:key('Career Communities'), tags:key('Interest Tags'), type:key('Opportunity Type'),
      description:key('Fellow-Facing Description'), grades:key('Eligible Grades'),
      deadline:key('Application Deadline'), commitment:key('Program Dates / Commitment'),
      cost:key('Cost / Pay'), format:key('Format'), location:key('Location'),
      update:key('Fellow-Facing Update'), cycle:key('Program Cycle'),
      organizer:key('Organizer Notification Link')
    };
    const list = value => String(value || '').split(',').map(v => v.trim()).filter(Boolean);
    const url = value => /^https:\/\//i.test(String(value||'')) ? String(value) : '';
    const opportunities = data.slice(2).filter(r => r[fields.status] === 'Ready to Publish'
          && r[fields.id] && r[fields.name]).map(r => ({
      id:r[fields.id],name:r[fields.name],organization:r[fields.org],url:url(r[fields.url]),
      careerCommunities:list(r[fields.communities]),interestTags:list(r[fields.tags]),
      type:r[fields.type],description:r[fields.description],
      eligibleGrades:list(r[fields.grades]).filter(x => /^(8|9|10|11|12)$/.test(x)),
      applicationDeadline:r[fields.deadline],commitment:r[fields.commitment],
      cost:r[fields.cost],format:r[fields.format],location:r[fields.location],
      fellowUpdate:r[fields.update],programCycle:r[fields.cycle],
      organizerNotificationUrl:url(r[fields.organizer])
    }));
    return jsonp_({ok:true,version:1,opportunities});
  } catch (e) {
    console.error(e);
    return jsonp_({ok:false,error:'Opportunity listings unavailable'});
  }
}
/**
 * Apps Script Web Apps don't offer reliable cross-origin fetch headers for
 * GitHub Pages, so use a FIXED JSONP callback; never accept caller-supplied
 * callback names. Text is escaped to prevent breaking out of the JS literal.
 */
function jsonp_(payload) {
  const data = JSON.stringify(payload).replace(/</g,'\\u003c').replace(/>/g,'\\u003e')
     .replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return ContentService.createTextOutput('window.FYTFeedReceiver('+data+');')
     .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
