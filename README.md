# Kasoko Safaris & Tours

An Arusha-based Tanzania travel website with 27 safari/tour destinations, 22 hotels, English/Kiswahili, light/dark themes and nine booking-request services.

## Photos work directly from the download

All **56 photographs are included as standard JPEG files** in `assets/photos`. Opening `index.html` after extracting the ZIP displays the photos without installing Node.js or unpacking media bundles. Cards, detail galleries and region images use these actual files. Image URLs include a release identifier to refresh older cached requests.

A failed image request retries the same photograph once. A successful retry restores the photograph and removes its error message. Reconnecting to the internet retries photos that failed while offline. No unrelated image or generated substitute is used.

## Upload all 96 files together

1. Extract this ZIP into a new empty folder and open `kasoko-travels`.
2. In the GitHub repository's root, select **Add file → Upload files**.
3. Drag in **everything inside `kasoko-travels`**, including `assets`, `api`, `scripts` and `qa`.
4. Wait for all **96 files** to finish uploading, then commit. Merge the pull request if your repository requires one.

The largest individual file is below 0.5 MB. All files fit within GitHub's 100-file browser-upload limit. The repository root should contain `index.html`, `package.json`, `detail-pages.js` and `vercel.json`.

The source stores the 49 listing pages together in `detail-pages.js` to keep the upload small. Local links open them through `detail.html`. Vercel generates the original individual hotel and destination HTML URLs, preserving navigation and the sitemap. All 56 image files are present before any build.

## Vercel settings

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Empty when these files are at the repository root |
| Build Command | `node scripts/build-static.mjs` |
| Output Directory | `public` |
| Node.js Version | `24.x` |
| Install Command | Empty |

The included `vercel.json` supplies the build settings. The build verifies the photo checksums, copies the browser files and generates the listing pages. Vercel builds `api/bookings.mjs` separately as a Node.js function. No Python application or frontend dependencies are required.

When updating an existing repository, replace matching source files with this package. Keep your existing Vercel booking environment variables. If you run `npm run build` on your computer, exclude its generated `public` folder from GitHub browser uploads; Vercel rebuilds it automatically.

## Local preview and booking delivery

Double-click `index.html` after extraction. The local detail-page loader supports all hotel and destination pages. Google Maps, external source links, web fonts and request delivery need internet access.

A local preview can review a booking request but cannot run the Vercel booking API. It never pretends that an undelivered request was received. The website accepts booking requests; Kasoko confirms supplier availability and final prices.

Follow `google-apps-script-alerts-template.txt` to configure the private receiver. Set its Script Properties `SHEET_ID`, `ALERT_EMAIL` and `WEBHOOK_SECRET`, then set these Vercel environment variables:

- `BOOKING_WEBHOOK_URL`: the deployed HTTPS Google Apps Script URL ending in `/exec`.
- `BOOKING_WEBHOOK_SECRET`: the receiver's private `WEBHOOK_SECRET` value.

Keep secrets out of public source files. Redeploy after changing environment variables. GitHub Pages cannot run the included booking API.

## Future edits

- Listing information: `catalog.js` and its matching entry in `detail-pages.js`.
- Main page content: the corresponding HTML file.
- Translations: `translations.js`; public contacts: `config.js`; visual styling: `editorial.css`.
- Photos: the actual JPEGs in `assets/photos`. When changing a photo, update its attribution and SHA-256 checksum in `photo-sources.json`. The build deliberately rejects incomplete or unrecorded replacements.
- Photo provenance: `credits.html`, `photo-sources.json` and `SOURCES.md`.
- Canonical metadata currently uses `https://new-kasoko-travels.vercel.app`. Change this in HTML, `detail-pages.js`, `sitemap.xml` and `robots.txt` if using another domain.

Run `npm run build` and `npm run test:api` for the included build and API checks. No API test sends a real booking or message. See `QA-NOTES.md` for the current verification results and their limits.

Contact numbers: 0789 515 769 · 0744 355 769 · 0762 917 519.
