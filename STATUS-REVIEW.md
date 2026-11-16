# FYT Application Status — Staff Review Guide

## Added November 16, 2026
The `2026-2027 (IP)` worksheet includes a new **AD: FYT Application Status** column with a dropdown for each approved opportunity. The public opportunity directory uses this value, not guesses from natural-language notes, to show colored status banners.

## Status definitions
- **Open Now** — staff verified that applications are currently accepting submissions. Use only with a known source, then recheck after the deadline.
- **Opening Later** — applications or registrations have not opened yet. Never use a future deadline as proof of current opening.
- **Closed** — applications for the listed cycle have ended. The opportunity can stay listed for future planning.
- **Year-Round** — official information explicitly says applications are accepted year-round, even if individual sessions or shifts can fill.
- **Ongoing / Check Availability** — the activity recurs or is continuously offered, but a specific slot or application window is not guaranteed.
- **Deadline Listed** — a future deadline is documented, but the current state of applications has not been confirmed.
- **Previously Offered** — the old program exists, but there is no confirmed next cycle.
- **Check Availability** — current opening details cannot be verified or require contacting the organizer.

**Important:** A deadline that is past always renders **Listed deadline passed**, even if staff haven't yet updated the dropdown. **Closes in N days** is shown only when the official `Open Now` status is selected AND the parsed deadline is within 15 days.

## Publishing and data flow
1. Staff verify availability with the organizer, and update **AD: FYT Application Status**, **J: Application Deadline** and **X: Fellow-Facing Update**.
2. `apps-script/Code.gs` was updated to publish the new `applicationStatus` field from AD. **Redeploy the existing read-only opportunity feed Apps Script as a new version** (Deploy -> Manage deployments -> Edit -> New version -> Deploy) to make these status edits automatically flow from Google Sheets to the site.
3. Until the live feed is redeployed, the site uses the checked-in public-safe `opportunities-snapshot.js` for the 35 approved opportunities' status values. This snapshot is current as of November 16, 2026 and does not auto-update from sheet edits.
4. If an opportunity has not been included in the current snapshot yet and the legacy feed has no status, the directory conservatively shows **Check application availability**.
5. The separate private Fellow-interest intake is **not part of this public feed** and should not be altered when redeploying the opportunity feed.

## Staff review habit
- Check approaching deadlines weekly; verify that the application portal is actually open before marking Open Now.
- Recheck programs that say **Opening Later** when the expected opening month arrives.
- Check the official organizer site before making a status claim.
- Keep an eye on `Ready to Publish` opportunities; their public status is distinct from their publication approval.
