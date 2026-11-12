# Phase 4.5 — Product Image Visual Audit

**Status:** Catalogue reviewed and current product-image implementation validated. No additional image passed both the product-identity and reuse-rights checks, so the existing image set is retained and the remaining products stay intentionally unmapped.

## Coverage summary

- **Products audited:** 42 across Seating, Tables, Linens, Mandap & stage, Decor, and Serveware.
- **Existing mappings retained:** 16 (12 exact product matches and 4 representative matches).
- **New mappings added:** 0.
- **Existing mappings replaced:** 0.
- **Products intentionally unmapped:** 26.
- **Final product-image coverage:** 16 / 42 (**38.1%**).
- **Duplicate image assignments across products:** 0.

The existing central manifest in `src/rental/productImageManifest.js` remains the single mapping source. The catalogue, cart, request review, and request confirmation resolve product images from it by the existing category and product ID/name. Product IDs and cart item storage fields were preserved.

## Complete catalogue inventory

“Exact” means the named item is visibly identifiable. “Representative” means the image depicts the item itself in a representative arrangement, though it is not an isolated product photograph. An unmapped item has no image path and renders the existing neutral placeholder.

| Category | Product | Current 480px image | Visual review and final status |
| --- | --- | --- | --- |
| Seating | Chiavari chairs | `chiavari-chair-480-270x480-9146473311.webp` | White Chiavari chairs are clearly visible; retain, exact. |
| Seating | Banquet chairs | — | Unmapped. Candidates showed venue seating without a clearly identifiable banquet-chair product. |
| Seating | Folding chairs | `folding-chair-480-480x322-01acd5ae49.webp` | White metal folding chairs are clearly visible; retain, exact. |
| Seating | Sofas and loveseats | `sofa-loveseat-480-480x320-65969e3216.webp` | Sofa and loveseat are the clear subject in a furniture arrangement; retain, representative. |
| Seating | Gaddi and floor mattresses | — | Unmapped. Found lifestyle/interior scenes did not show a rental floor mattress as the clear product. |
| Seating | Bolsters | — | Unmapped. No licensed, product-focused bolster image was verified. |
| Seating | Chowki | — | Unmapped. Search results were commercial product photos with no clear reuse rights or unrelated stools. |
| Seating | Jhoola | `jhoola-480-360x480-86887417be.webp` | A traditional Indian suspended swing is clearly visible; retain, exact. |
| Tables | Round 60-inch tables | `round-table-480-480x320-fce06f5929.webp` | Round event tables are clearly identifiable in the foreground; retain, exact. |
| Tables | Banquet tables, 6ft and 8ft | — | Unmapped. Event scenes did not establish a clear 6ft/8ft banquet-table product view. |
| Tables | Buffet tables | — | Unmapped. Buffet/event scenes included food and decor but did not clearly show the rental table as the product. |
| Tables | Cocktail and high tables | — | Unmapped. Search results centered on drinks or event scenes rather than an identifiable high table. |
| Tables | Low chowki tables | — | Unmapped. No licensed product-focused low Indian chowki table image was verified. |
| Linens | Tablecloths and chadar | — | Unmapped. Styled table scenes did not clearly isolate the cloth or show a suitable chadar. |
| Linens | Silk runners | — | Unmapped. No verified silk runner product photograph was found. |
| Linens | Brocade runners | — | Unmapped. No verified brocade runner product photograph was found. |
| Linens | Napkins | — | Unmapped. Table-setting scenes showed napkins only as part of a larger composition. |
| Linens | Chair covers | — | Unmapped. Venue scenes did not show a chair cover as the clear product. |
| Linens | Chair sashes | — | Unmapped. No licensed product-focused chair-sash image was verified. |
| Linens | Ceiling drapes | — | Unmapped. Generic room/event draping did not provide a clear product view of ceiling drapes. |
| Linens | Wall drapes and parda | — | Unmapped. Generic room/event draping did not identify a rental parda or wall-drape product. |
| Mandap & stage | Wedding mandaps | `wedding-mandap-480-480x320-4a061589da.webp` | The South Asian mandap structure is the clear focal product; retain, exact. |
| Mandap & stage | Stage setups | — | Unmapped. Generic wedding stages did not identify the offered rental setup. |
| Mandap & stage | Sweetheart table setups | — | Unmapped. No licensed product-specific sweetheart-table setup photo was verified. |
| Mandap & stage | Pillars and stambh | — | Unmapped. Decorated ceremony photos did not clearly show a rentable pillar/stambh product. |
| Mandap & stage | Arches | — | Unmapped. Generic ceremony arches were not sufficiently specific to the offered rental product. |
| Mandap & stage | Floral backdrops | — | Unmapped. Generic wedding scenes showed decor in context, not a clear floral-backdrop product view. |
| Mandap & stage | Fabric backdrops | — | Unmapped. No verified product-focused fabric-backdrop image was found. |
| Mandap & stage | Frame backdrops | — | Unmapped. No verified product-focused frame-backdrop image was found. |
| Mandap & stage | Tents, canopies, and shamiyana | — | Unmapped. Generic tents/canopies did not establish a traditional shamiyana rental product. |
| Decor | Torans | `toran-480-480x320-6573e358cf.webp` | A marigold toran is clearly visible above a doorway; retain, exact. |
| Decor | Diyas | `diya-480-480x270-7ed1d145fb.webp` | A lit diya is clearly visible as the subject; retain, exact. |
| Decor | Urlis | — | Unmapped. Brass-bowl results were not verified as an urli, and commercial product photos lacked confirmed reuse rights. |
| Decor | Kalash | `kalash-480-270x480-344091c45f.webp` | A ceremonial kalash with coconut and offerings is clearly visible; retain, exact. |
| Decor | Fanoos and lanterns | `fanoos-480-480x320-4cd59aa16f.webp` | Decorative hanging lanterns are clearly visible; retain, exact. |
| Decor | Marigold garlands and malas | `marigold-garland-480-360x480-48ac4583dc.webp` | Marigold garlands are shown close-up and clearly identifiable; retain, exact. |
| Decor | Rose garlands | `rose-garland-480-480x320-171a237c87.webp` | The floral garland display includes roses and is the clear subject; retain, representative. |
| Serveware | Thaal and platters | `thaal-480-480x326-45c08d78b0.webp` | A traditional Indian thaal with a shared meal is clearly identifiable; retain, exact. |
| Serveware | Handi | `handi-480-320x480-1bdbe0809d.webp` | A brass handi is visible with food; retain, representative. |
| Serveware | Chafing dishes | `chafing-dish-480-480x320-449c3ac8c1.webp` | A catering chafing dish is clearly visible; retain, exact. |
| Serveware | Plates and glasses | `plates-glasses-480-320x480-2a1ad25e57.webp` | Plates and glasses are clearly visible in a table setting; retain, representative. |
| Serveware | Katori | — | Unmapped. Small-bowl search results did not identify a katori product clearly enough. |

## Retained image sources and attribution

All 16 sources are licensed stock photographs already curated in `scripts/rentalImageSources.js`. Local WebP assets are the runtime files; the original sources are not requested by the live site. Pexels pages list these photos as free to use under the [Pexels License](https://www.pexels.com/license/). Unsplash assets use the [Unsplash License](https://unsplash.com/license).

| Product | Source / photographer | Match |
| --- | --- | --- |
| Chiavari chairs | [Pexels 17027528](https://www.pexels.com/photo/white-chairs-in-the-garden-17027528/) — Beyzaa Yurtkuran | Exact |
| Folding chairs | [Unsplash photo](https://unsplash.com/photos/pile-of-white-metal-folding-chairs-WBN9zHXKeig) — chuck cunningham | Exact |
| Sofas and loveseats | [Unsplash photo](https://unsplash.com/photos/outdoor-furniture-set-arranged-on-a-white-background-_VO_dgIjvQs) — Jessica Young | Representative |
| Jhoola | [Pexels 37026460](https://www.pexels.com/photo/colorful-traditional-indian-interior-with-swing-37026460/) — Mehul Soni | Exact |
| Round 60-inch tables | [Unsplash CDN photo ID `photo-1464366400600-7168b8af9bc3`](https://images.unsplash.com/photo-1464366400600-7168b8af9bc3) — photographer page not recorded | Exact |
| Wedding mandaps | [Unsplash CDN photo ID `photo-1587271636175-90d58cdad458`](https://images.unsplash.com/photo-1587271636175-90d58cdad458) — photographer page not recorded | Exact |
| Torans | [Unsplash CDN photo ID `photo-1786821443562-401f9b5055f7`](https://images.unsplash.com/photo-1786821443562-401f9b5055f7) — photographer page not recorded | Exact |
| Diyas | [Unsplash CDN photo ID `photo-1667031232580-13bee9c42e86`](https://images.unsplash.com/photo-1667031232580-13bee9c42e86) — photographer page not recorded | Exact |
| Kalash | [Unsplash CDN photo ID `photo-1764304589223-30bfbfdaa9ef`](https://images.unsplash.com/photo-1764304589223-30bfbfdaa9ef) — photographer page not recorded | Exact |
| Fanoos and lanterns | [Unsplash CDN photo ID `photo-1700196798611-d27af6d9c566`](https://images.unsplash.com/photo-1700196798611-d27af6d9c566) — photographer page not recorded | Exact |
| Marigold garlands and malas | [Pexels 35124359](https://www.pexels.com/photo/bright-orange-marigold-garlands-in-close-up-35124359/) — Sunannya Das | Exact |
| Rose garlands | [Pexels 34071580](https://www.pexels.com/photo/vibrant-floral-garland-display-with-roses-and-chrysanthemums-34071580/) — Nomadic Journey (VikramSingh Valera) | Representative |
| Thaal and platters | [Unsplash CDN photo ID `photo-1711153419402-336ee48f2138`](https://images.unsplash.com/photo-1711153419402-336ee48f2138) — photographer page not recorded | Exact |
| Handi | [Pexels 37173431](https://www.pexels.com/photo/traditional-indian-dish-cooking-outdoors-37173431/) — Narasimhan AVPL | Representative |
| Chafing dishes | [Unsplash photo](https://unsplash.com/photos/a-chafing-dish-filled-with-cooked-vegetables-gfo8ESLIaCA) — You Le | Exact |
| Plates and glasses | [Pexels 5829931](https://www.pexels.com/photo/plates-with-dishes-and-drinking-glasses-on-a-table-5829931/) — Mister Mister | Representative |

Seven legacy Unsplash CDN IDs do not currently include a photographer/source-page record. Their CDN photo IDs and Unsplash license are recorded in the manifest; the photographer names could not be verified from the local source records. Unsplash recommends linking a photographer when known ([attribution guidance](https://help.unsplash.com/en/articles/2511315-guideline-attribution)); this attribution gap is documented rather than guessed.

Visual research also rejected images that would have increased coverage without adequate accuracy: a Pexels image titled “Photo of Indian Flowers and Bowls” shows brass bowls but does not identify them as urlis ([Pexels 15258603](https://www.pexels.com/photo/photo-of-indian-flowers-and-bowls-15258603/)); search results for chowki were commercial product pages without confirmed reuse rights. No AI-generated or duplicate images were used.

## Optimization and presentation

The existing optimizer creates local WebP variants at max edges of 160, 240, 480, 720, and 900 pixels. It preserves source aspect ratio and does not upscale. Catalogue cards use responsive `srcset`/`sizes`, intrinsic dimensions, lazy loading, and `object-fit: contain`; cart and request views use smaller variants and the same resolver. Unmapped products render a neutral placeholder with reserved dimensions.

| Variant | Bytes across 16 mapped products |
| --- | ---: |
| 160px thumbnails | 128,314 |
| 240px request images | 220,194 |
| 480px catalogue images | 631,366 |
| 720px responsive images | 1,124,502 |
| 900px detail images | 1,715,112 |
| **All 80 variants** | **3,819,488 (3.64 MiB)** |

The source downloads totaled **46,084,288 bytes** in the Phase 4.4 sync record. The 900px variants total **1,715,112 bytes**, about **96.3% smaller** than the source downloads. The source originals are not retained, so per-source original byte sizes cannot be reconstructed from the current project. The marigold 720px and 900px variants are **142,654 bytes** and **207,202 bytes**; their documented budgets account for the detailed flower texture and unchanged Pexels WebP response quality.

## Validation

- `npm run audit:rental-images` — PASS. 42 catalogue products, 12 exact mappings, 4 representative mappings, 26 unmapped, 80 valid unique WebP variants, all local paths/dimensions and file budgets valid; **3,819,488 total bytes**.
- `npm run audit:images` — PASS. 49 editorial assets, 46 unique placements, 49 gallery entries, 10 category filters, no duplicate sample groups.
- Local Chromium desktop check at 1280×1800 across all six categories — all 16 mapped product images loaded; no broken product image requests. Product image layout shift was zero in Decor and at most 0.0065 on the tested category pages (the page also includes an editorial hero).
- Local Chromium mobile check at 390×844 across all six categories — every product image was scrolled into view and decoded. All 16 mapped assets loaded, no broken image requests were found, and measured layout shift was zero. Product cards remain lazy-loaded until brought near the viewport.
- Browser cart-path check — adding Chiavari chairs preserved ID `seating:chiavari-chairs` and quantity `1`; cart used its 160px image, request review used its 240px image, and confirmation used the same 240px mapping.
- The rental image audit checks every manifest path and duplicate-content hash, including responsive variants. No new assets were downloaded or added in this phase.
- `npm run build` — PASS with Vite 8.3.5. It reports the existing main JavaScript chunk at 696.57 kB minified (above the 500 kB advisory threshold); the production build completes successfully.

## Remaining limitations

Twenty-six products remain intentionally unmapped until an accurate product photograph with clear reuse rights is available. Seven retained Unsplash images lack recorded photographer/source-page metadata. No catalogue, cart, request, database, or request-workflow behavior was changed for this audit.
