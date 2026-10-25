# Kasoko Safaris & Tours — image reliability checks

Checked 25 October 2026. This report applies to the images-ready package.

## What changed

- Replaced build-only photo bundles with 56 ordinary JPEG files, available immediately after extraction. All photographs retain their original bytes and source credits.
- Removed dependencies on thumbnail subfolders and alternate WebP files. Cards and galleries use the actual JPEG files present in the upload.
- Added a release identifier to photo URLs and shared scripts so older cached requests are refreshed.
- Fixed image errors that happen before deferred scripts register their listeners. Failed loads retry the same photograph once; successful loads restore visibility and remove error messages. Reconnecting retries failed photographs.
- Grouped the 49 listing-page documents into one source file, retaining all information, booking links and original deployed URLs. The local detail loader allows direct file preview without Node.js.
- The upload contains 96 files, and no individual file exceeds 0.5 MB. All 60 content pages are retained; the additional local detail loader makes 61 HTML files in the built output.

## Verification

| Check | Result |
| --- | --- |
| JPEG validity | All 56 files decoded successfully as JPEG |
| Local HTTP image delivery | All 56 returned HTTP 200 with image/jpeg and decoded successfully; bytes matched source |
| Distinct listing photographs | All 49 listings have different primary image paths |
| Built HTML links, images and script paths | 1,836 local references resolved |
| Existing page interactions, languages, filters, galleries and booking flows | 5,566 DOM assertions passed on all 60 content pages; 21 mocked submissions |
| Direct file preview | 2,899 checks passed using file:// URLs and actual deferred-script order, covering 11 main pages and all 49 listing pages |
| Source image references | 460 rendered references checked during local page and language checks |
| Cached image failures, retries, recovery and reconnection | Passed in DOM simulation |
| Invalid local listing query | An explicit listing-not-found page is shown |
| API and private receiver | 44 assertions passed; no external request sent |
| Missing or truncated JPEG | Build stops with a specific photo error before replacing existing output |
| Archive integrity | Full extraction and byte comparison are checked before release; saved download is checked again |

## Limits

The remote browser could not access the local preview server, so visual desktop, tablet and phone layout checks were not completed for this release. DOM simulation checks behavior and file references; it is not a rendered browser screenshot or a real-device test.

The public address recorded in the project metadata showed a different website version when inspected. This release fixes the downloadable project; no live deployment or repository was changed. No live Google Sheet, email, WhatsApp or payment action was performed.

## Repeat the included checks

With Node.js 24, run:

```sh
npm run build
npm run test:api
```

Opening index.html directly requires no build. The broader DOM and local HTTP checks were run in the development environment and are summarized above.
