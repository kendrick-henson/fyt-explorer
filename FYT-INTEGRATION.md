# BRYC FYT Explorer — Sheet connection

## What this branch does
- Adds a dedicated `opportunities.html` directory with search, grade, Career Community and Program Cycle filters.
- Makes the six Career Community cards and "Browse all opportunities" link to the directory.
- Adds a Google Apps Script public-safe read-only feed at `apps-script/Code.gs`.
- Adds `fyt-config.js` to configure its public web app URL.
- Adds stable Opportunity IDs in the source sheet's column AC: `FYT-00001` through `FYT-00075`.

## Staff setup (required before merging / publishing)

1. Open the BRYC FYT Google Sheet: https://docs.google.com/spreadsheets/d/1dGBFSsUvghyAYDLXLaPbHapRSJiTGYK5MImKl2NJS0Y/edit?gid=17448482
2. Open **Extensions → Apps Script**. Replace the default `Code.gs` with the content from this repository's `apps-script/Code.gs`. Save.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Follow authorization prompts, then copy the URL ending in `/exec`.
4. Check the URL: its text should begin with `window.FYTFeedReceiver(`. It should contain only approved opportunity fields. It does not contain staff contact information, internal notes, or Fellow names.
5. Edit `fyt-config.js`: set `publicFeedUrl` to that public `/exec` URL, leaving the surrounding quotes. This URL is public by design; do **not** paste the editable spreadsheet URL, credentials, or any private data.
6. Review and merge the pull request. On GitHub Pages, test `opportunities.html?community=Health`. Use search and grade filters. Verify the listing count and program links.
7. In the Sheet, temporarily change a test approved opportunity to `Hold`; reload the website and confirm it disappears. Restore its original status. A data edit does **not** require Apps Script redeployment.

For future code changes to `apps-script/Code.gs`, use **Deploy → Manage deployments → Edit → New version**. Future sheet content edits update the feed without code deployment.

## Design / privacy rules
Only records whose `Explorer Status` is exactly `Ready to Publish` are sent to the public browser. The response is built with explicit field names and does **not** include Staff Contact, internal notes, verification metadata, next follow-up date, unpublished records, or Fellow names. Anything included in a public description may become visible, so staff should only put Fellow-safe text there.

The endpoint uses a fixed callback name `window.FYTFeedReceiver` because a public static GitHub Pages site cannot reliably use cross-origin `fetch` with standard Apps Script web apps. Never accept arbitrary callback parameter values from the request.

## Opportunity IDs
Column AC now holds permanent IDs. Don't regenerate or reorder the identifiers when sorting the spreadsheet. New opportunities need new unique IDs (`FYT-00076` onward). If the ID is blank, the public feed omits that entry until it has been assigned.

## Scope
This pull request covers the **read-only publishing connection** only. BRYC's private name-entry `Notify Me` feature will be a separate build. No Fellow information is collected by this branch.
