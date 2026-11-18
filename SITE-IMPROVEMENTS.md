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

## Supervisor feedback implementation — November 18, 2026

- [x] **Round 1: Navigation and visual cleanup.** Added matching four-link navigation across the homepage and directory (Home, All Opportunities, Career Communities, BRYCdown), made the shared header sticky, added horizontally scrollable navigation on narrow screens, linked the homepage Career Communities anchor, standardized Explore All Opportunities links, and removed redundant search/inspiration supporting text. Both pages use CSS v11. Retained all public opportunity functionality and private interest intake.
- [x] **Round 2: Opportunity cards.** Unified each card action as I'm Interested directly beneath the expandable deadline; kept Explore Program at the bottom. Added concise 15–23 word display descriptions for all 36 approved opportunities, while preserving original source descriptions for search and internal records; no Read More controls. Consolidated the form to one Full Name input with validated first/last values sent to the existing private Apps Script endpoint (no redeployment required).
- [x] **Round 3: Discovery.** Added shared keyboard-accessible autocomplete to the homepage and directory, typo-tolerant and synonym-aware interest matching, and default grouping by closest future deadline, then future openings, ongoing activities, uncertain availability and previously offered programs. Opportunities with a past listed application deadline or explicit Closed status are hidden from the public directory and homepage previews; the internal Sheet and full approved-data snapshot remain intact. Tested against 36 approved records, including `nursng`, `engeneering`, and `photograhy`. Client-side sorting depends on the source sheet's deadline/status accuracy; it does not independently verify organizer openings.
