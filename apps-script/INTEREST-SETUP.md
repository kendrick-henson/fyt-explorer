# BRYC Find Your Thing — Interest Request Deployment

## Status (Nov 16, 2026)
- [x] Separate staff-only Google Sheet prepared: **BRYC FYT — Private Fellow Interest Requests (PY27)**.
- [x] Private Google Apps Script intake code prepared in `apps-script/NotifyMe.gs`.
- [x] Opportunity cards have an **I'm Interested / Notify Me** form, gated and hidden until the backend URL is configured.
- [ ] BRYC staff must deploy a **separate** Google Apps Script web app and confirm appropriate youth-data access controls.
- [ ] Test a non-student submission and verify the private request row.
- [ ] Only then add the /exec link to `fyt-config.js` -> `interestIntakeUrl`.

## Deployment (BRYC staff account)
1. Confirm the new tracker workbook is **Restricted** and shared only with authorized BRYC staff. It must not be published to the web.
2. Open [script.google.com](https://script.google.com/) and create a **new** Apps Script project (do not add a second `doGet` to the public FYT feed project).
3. Paste `apps-script/NotifyMe.gs` into the new project as its Code.gs.
4. In **Project Settings -> Script properties** add:
   - `FYT_TRACKER_ID` = private tracker spreadsheet ID (from its URL).
   - `FYT_OPPORTUNITIES_ID` = current approved-opportunities spreadsheet ID (from its URL).
5. **Deploy -> New deployment -> Web app**: Execute as **Me**, Who has access **Anyone**. Review Google Workspace policy first. Google will require authorization for both spreadsheets.
6. Test with a fictitious Fellow name and an approved `FYT-XXXXX` Opportunity ID, using the endpoint directly or a temporary form. Verify a row appears in the restricted tracker, without giving the public read access.
7. Remove the test row. Put the deployed **Web App URL** ending in `/exec` into `fyt-config.js`: `interestIntakeUrl: 'https://script.google.com/macros/s/.../exec'`.
8. Test from a signed-out/Incognito browser by clicking **I'm Interested** on the public FYT directory. Verify no public GET endpoint exposes Fellow names and no PII is placed in the URL.
9. Have BRYC staff periodically review and close interest requests. **This is staff follow-up, not an automated notification service**, and it is not an application to the organizer.

## Important
- Only public, Ready to Publish opportunities can be submitted.
- Requests include **first and last name only** (no emails, phone numbers, student IDs, or detailed interests).
- The request log includes a *blank* Fellow ID column for later manual verified matching with an intake system. Never match by name alone without staff review.
- Restrict the tracker and check permissions regularly. Protect, retain, and delete youth data according to BRYC policy.
- The public GitHub Pages site must never contain a private tracker workbook link or stored Fellow records.
- This is a lightweight intake, not an authenticated student portal; CAPTCHA, identity verification, and anti-abuse mechanisms may be necessary if the site gets significant traffic.
