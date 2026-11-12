# Phase 4.4 — Rental Product Image Audit

**Status:** Implemented for 16 products with credible licensed photography. Products without a suitable match remain unmapped and render the neutral image placeholder.

## Catalogue and existing image audit

- **42 rental products** across six categories were identified in `src/content.js`.
- Before this phase, the catalogue reused one category listing photo across every product card. Cart entries could also retain and render an external Unsplash URL.
- There were no local rental product photographs or product-specific image variants. `src/imageManifest.js` contains existing Unsplash editorial, gallery, and celebration imagery; those mappings were left intact.
- No existing local product assets were available to reuse. No project assets were deleted.
- The new central manifest contains **16 mapped products**: **12 exact matches** and **4 representative matches**. **26 products** remain without suitable imagery.
- The generator and audit check for duplicate bytes and duplicate variant paths. The final set contains 80 unique, valid WebP variants with no duplicate content.

### Products still missing suitable images

| Category | Products |
| --- | --- |
| Seating | Banquet chairs; Gaddi and floor mattresses; Bolsters; Chowki |
| Tables | Banquet tables, 6ft and 8ft; Buffet tables; Cocktail and high tables; Low chowki tables |
| Linens | Tablecloths and chadar; Silk runners; Brocade runners; Napkins; Chair covers; Chair sashes; Ceiling drapes; Wall drapes and parda |
| Mandap & stage | Stage setups; Sweetheart table setups; Pillars and stambh; Arches; Floral backdrops; Fabric backdrops; Frame backdrops; Tents, canopies, and shamiyana |
| Decor | Urlis |
| Serveware | Katori |

These remain blank because the candidates reviewed were generic event scenes, visually mismatched objects, or otherwise not credible product references. In particular, the brass bowls candidate was not an urli and was rejected.

## Sourced image register and rights

All source photographs were downloaded at development time, converted/resized to local WebP variants, and are served from `/images/rentals/`. There are no runtime Unsplash, Pexels, or Pixabay API requests for rental products. API credentials are not required; the sync script fetches curated public image URLs directly.

Unsplash images use the [Unsplash License](https://unsplash.com/license), which permits free commercial and non-commercial use, including modifications. Pexels images use the [Pexels License](https://www.pexels.com/license/), which permits use on websites and modification. Photographer credit is retained in the source registry and generated manifest where available.

| Product | Match | Provider / source ID | Photographer | Source page |
| --- | --- | --- | --- | --- |
| Chiavari chairs | Exact | Pexels `17027528` | Beyzaa Yurtkuran | [White chairs in the garden](https://www.pexels.com/photo/white-chairs-in-the-garden-17027528/) |
| Folding chairs | Exact | Unsplash `photo-1553110503-b4388ef57dbe` | chuck cunningham | [Pile of white metal folding chairs](https://unsplash.com/photos/pile-of-white-metal-folding-chairs-WBN9zHXKeig) |
| Sofas and loveseats | Representative | Unsplash `photo-1746605620245-bf8d2c653379` | Jessica Young | [Outdoor furniture set](https://unsplash.com/photos/outdoor-furniture-set-arranged-on-a-white-background-_VO_dgIjvQs) |
| Jhoola | Exact | Pexels `37026460` | Mehul Soni | [Traditional Indian interior with swing](https://www.pexels.com/photo/colorful-traditional-indian-interior-with-swing-37026460/) |
| Round 60-inch tables | Exact | Unsplash `photo-1464366400600-7168b8af9bc3` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Wedding mandaps | Exact | Unsplash `photo-1587271636175-90d58cdad458` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Torans | Exact | Unsplash `photo-1786821443562-401f9b5055f7` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Diyas | Exact | Unsplash `photo-1667031232580-13bee9c42e86` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Kalash | Exact | Unsplash `photo-1764304589223-30bfbfdaa9ef` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Fanoos and lanterns | Exact | Unsplash `photo-1700196798611-d27af6d9c566` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Marigold garlands and malas | Exact | Pexels `35124359` | Sunannya Das | [Bright orange marigold garlands](https://www.pexels.com/photo/bright-orange-marigold-garlands-in-close-up-35124359/) |
| Rose garlands | Representative | Pexels `34071580` | Nomadic Journey (VikramSingh Valera) | [Floral garlands with roses](https://www.pexels.com/photo/vibrant-floral-garland-display-with-roses-and-chrysanthemums-34071580/) |
| Thaal and platters | Exact | Unsplash `photo-1711153419402-336ee48f2138` | — | Unsplash photo ID retained in `scripts/rentalImageSources.js` |
| Plates and glasses | Representative | Pexels `5829931` | Mister Mister | [Plates with dishes and drinking glasses](https://www.pexels.com/photo/plates-with-dishes-and-drinking-glasses-on-a-table-5829931/) |
| Handi | Representative | Pexels `37173431` | Narasimhan AVPL | [Traditional Indian dish cooking outdoors](https://www.pexels.com/photo/traditional-indian-dish-cooking-outdoors-37173431/) |
| Chafing dishes | Exact | Unsplash `photo-1768701544932-03984e192380` | You Le | [A chafing dish filled with cooked vegetables](https://unsplash.com/photos/a-chafing-dish-filled-with-cooked-vegetables-gfo8ESLIaCA) |

“Exact” means the visible subject is the named rental item or a clear example of it. “Representative” is reserved for visually related imagery that is not an isolated exact product shot: the sofa/loveseat arrangement, the brass handi with food, and the mixed floral garland display with roses.

## Optimization and storage

The sync script creates WebP variants with max edges of **160, 240, 480, 720, and 900 pixels**, preserving the source aspect ratio and avoiding upscaling. The `160` and `240` variants serve cart and request summaries; `480` is the card default; `720` and `900` support denser mobile and detail contexts. Responsive rendering chooses a variant through `srcset`/`sizes` and includes explicit dimensions.

| Variant | Total across 16 products |
| --- | ---: |
| 160px thumbnails | 128,314 bytes |
| 240px request summaries | 220,194 bytes |
| 480px cards | 631,366 bytes |
| 720px responsive | 1,124,502 bytes |
| 900px detail | 1,715,112 bytes |
| **All 80 variants** | **3,819,488 bytes (3.64 MiB)** |

The 16 untransformed source downloads totaled **46,084,288 bytes**. The 900px variants total 1,715,112 bytes, about **96.3% smaller** than those source downloads; all five variants together total 3,819,488 bytes, about **91.7% smaller**. Source originals are not retained in the repository.

The 720px and 900px marigold variants are **142,654 bytes** and **207,202 bytes**. Pexels returns the same WebP encoding despite the requested quality parameter, and the close-up contains dense flower detail. To preserve image quality, this source has documented size-budget overrides of 150 KB and 220 KB respectively. Every other variant remains within the standard audit limits: 160≤30 KB, 240≤50 KB, 480≤100 KB, 720≤100 KB, and 900≤180 KB.

## Delivery, rendering, and caching

- The central mapping is generated at `src/rental/productImageManifest.js` from `scripts/rentalImageSources.js`; components resolve by the existing category and product name/ID.
- Catalogue cards, cart rows, request review, and confirmation resolve the same product through the central manifest. Cart storage retains its existing shape and no longer stores an external image URL for new entries. Existing cart data and request payloads remain compatible; submission and Supabase logic were not changed.
- Rental images are local static files. `vercel.json` sets `Cache-Control: public, max-age=31536000, immutable` for `/images/rentals/*`. Generated filenames include a hash of all variants for that source, so changed content gets a new URL.
- Product cards are lazy-loaded and decoded asynchronously with explicit intrinsic dimensions. The collection category cover is still part of the existing editorial imagery and may load from Unsplash CDN. Other existing gallery and celebration mappings also remain external as before; they are outside this rental-product asset migration. No image API endpoint is called at runtime.
- Missing products use a neutral placeholder rather than inheriting an unrelated category or celebration photo.

## Validation results

Commands run:

- `npm run images:sync-rentals` — generated 16 local mappings; 26 catalogue entries remain intentionally unmapped.
- `npm run audit:rental-images` — passed: 42 products recognized, 12 exact, 4 representative, 26 missing; all 80 WebP variants are local, unique, correctly dimensioned in the manifest, and within the standard or documented source-specific byte budget.
- `npm run audit:images` — passed: 49 registered editorial assets, 46 unique content placements, 49 gallery entries, 10 category filters, no exact duplicate sample groups.
- `npm run build` — passed. Vite reports the existing main JS chunk at 694.51 kB minified (209.07 kB gzip), above its 500 kB advisory threshold; this is a JavaScript bundle warning, not an image transfer issue.

Headless Chromium checks ran against the local production preview for `/collections/seating`:

| Viewport | Rental image requests | Product image transfer | Selected sizes | CLS | LCP |
| --- | ---: | ---: | --- | ---: | ---: |
| Desktop 1280×2400 | 4 | 87,448 bytes | 240–480px | 0.0000 | 524 ms |
| Mobile 390×844, DPR 2 | 2 initially visible | 107,384 bytes | 480px portrait, 720px landscape | 0.0000 | 144 ms |

The desktop check used the seating collection, including the new jhoola mapping. The mobile request used the 720px folding-chair rendition at 76.5 KB and the 480px portrait Chiavari image at 30.3 KB. Desktop requests used local paths, with no duplicate rental file requests. No broken product image was found in these runs. The browser reported no Unsplash/Pexels/Pixabay API requests. Existing category covers were Unsplash CDN images, as noted above. These are one-run local browser measurements, not a Lighthouse score or deployed-CDN cache test. The local Vite preview does not emulate Vercel’s configured cache header; cache behavior on a deployment remains to be verified after deploy.

## Remaining setup and follow-up

- No API credentials or additional services are required for the current curated sources.
- Review the 26 missing items for new exact product photographs as suitable licensed images become available. Do not fill them with generic event scenes.
- Verify the immutable cache header from the deployed Vercel response after deployment. Existing editorial/gallery imagery still uses Unsplash CDN URLs and was intentionally not migrated in this rental-product-focused phase.
