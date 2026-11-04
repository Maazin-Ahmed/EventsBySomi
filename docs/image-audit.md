# Phase 4.1 image audit

## Inventory

The structured inventory is exported as `imageAuditInventory` from [`src/imageManifest.js`](../src/imageManifest.js). Each record includes the remote Unsplash asset path, sample dimensions and aspect ratio, JPEG format, optimized sample size, sampled SHA-256, assigned page/section, Gallery categories, and duplicate/suitability review flags. `sourcePage` links identify newly sourced Unsplash photographs and their license pages.

The project uses remote Unsplash image IDs and does not contain local editorial photo files. File size and dimensions therefore describe a reproducible 1200px `fit=max`, quality 68 JPEG audit sample. Production requests use responsive Unsplash widths and automatic format selection, so their delivered byte size varies with the browser and requested width.

## Results

- 33 active source photographs were downloaded as optimized 1200px JPEG samples and inspected. No local editorial image files are present in the repository.
- The registry and default Gallery each contain 33 unique photographs.
- There are 29 unique non-Gallery content placements across the homepage, 10 celebration pages, 6 collection pages, and About. Four additional, relevant inspiration photographs appear only in the Gallery.
- Every content placement photo appears once in the Gallery. Category tags can overlap, but each photo has one Gallery entry.
- 17 distinct photos were added to the shared registry for page-specific imagery. Existing page-generated image repetitions were removed; celebration and collection pages now use one unique hero photograph each, and their supporting sections retain text and inventory details without reusing generic photos.
- Unsuitable homepage assignments were removed: the baby shower card no longer uses a beach gathering photo, the anniversary card no longer uses a group image, and the Serveware page no longer uses a generic dining-table photo. The first two photos remain only in the Gallery under Cultural Gatherings; the table-setting photo remains in the Gallery under Rental Collections and Event Decor.
- Four celebration cards (Baby Showers, Birthdays, Anniversaries, and Griha Pravesh) and the Serveware rental card have no photograph because the inspected library did not contain a suitable unused image. The Serveware collection page also uses a text-led hero. Titles, descriptions, and links remain available.
- The 33 downloaded samples have 33 distinct SHA-256 hashes. A pairwise 64-bit difference hash check found no pair within five bits, and a contact sheet was visually reviewed. This verifies the current active set; it does not cover excluded source candidates.
- The previous Gallery data had 29 entries but only 16 unique photo IDs, with photographs repeated under multiple filters. The registry now stores each photo once and filters against its category tags.

Gallery intentionally displays the one-time index of all active registry photographs, including four photographs used only for Gallery inspiration. Apart from that index, each content photograph has one page/section assignment. The audit command verifies unique assignments and sample hashes, Gallery coverage, category coverage, source references, aspect ratios, and sample metadata:

```sh
npm run audit:images
```
