# BRYC Find Your Thing — Site Improvement Log

Updated November 16, 2026.

## Five-part improvement sequence
- [x] **1 — I'm Interested / Notify Me.** Public buttons enabled; user verified a fictitious request in the access-restricted BRYC interest tracker. Creates manual staff follow-up, not automated notifications.
- [x] **2 — Trustworthy opportunity application statuses.** Staff dropdown added to column AD of the FYT source Sheet for all 35 public approved opportunities. Opportunity directory uses it, with conservative fallback for older feeds. Snapshot updated. User reports public Apps Script was updated; direct external endpoint response could not be independently fetched in this environment.
- [x] **3 — Smarter interest search.** Search accepts a small, curated vocabulary of common synonyms and ranks exact textual matches first. Search tests against all 35 approved snapshot opportunities passed for nurse, doctor, photographer, robotics, coding, registered nurse and lawyer.
- [x] **4 — Cleaner opportunity cards.** Long descriptions are folded after three lines with accessible Read more / Show less toggle; full text is preserved.
- [x] **5 — Save opportunities.** Fellows can Save for later and filter Saved only. Store only public FYT opportunity IDs in the current browser's localStorage; no names, account data or Fellow details. Saved lists do not sync across browsers or devices and can disappear when browser data is cleared.

## Remaining to reach the intended 9/10 user experience
- Test the entire public directory and interest flow on a phone and a Chromebook with actual Fellows.
- Regularly maintain source application statuses and public feed deployment; verify opening dates with organizers.
- Evaluate whether BRYC wants account-based saved opportunities. This would require secure Fellow authentication and BRYC youth-data review; do not silently replace local device saving with a public names database.
- Continue monitoring successful private intake submissions and staff follow-up.
- Do not claim visual, accessibility or usability scores of 9/10 without real student testing.
