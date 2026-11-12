# Phase 5.1.1 — Product image Storage audit

**Status: implemented with 2 unresolved sourcing blockers; acceptance is NOT complete.**
**Coverage: 40/42 (95.2%).** All 42 records and all six rendered categories were audited. Only 40 products have approved photography; missing photographs are never counted as passing images.

The implementation is live through the existing GitHub/Vercel project. No Phase 5.2, admin application, authentication change, new customer/request workflow, brand redesign, S3 or CloudFront was introduced.

## Final closure attempt — 2026-11-13

Started from 39 approved assignments and 78 Storage objects. Final verified coverage is **40/42 (95.2%)**. All 42 IDs, all original 39 approved assignments, all original 78 object metadata records and bytes, all non-image product data, and all frontend source files were preserved.

One new representative photograph was approved for Low chowki tables: [Mustang Joe, Phool Mahal of Mehrangarh Fort](https://www.flickr.com/photos/mustangjoe/54350044704/), explicitly dedicated under CC0. The genuine 5669×3833 original was individually cropped to 1300×866, retaining the complete low wooden table and visible legs; the image was not upscaled. Primary license evidence is retained in [low-chowki-license-evidence.json](phase5.1.1-evidence/final-closure/low-chowki-license-evidence.json).

Migration 20261113000000_product_storage_images.sql updates only image_url, thumbnail_url, image_alt and image_match_type for tables:low-chowki-tables. The uploader was invoked with --only=tables:low-chowki-tables: it uploaded only the two new objects and performed read-only hash verification for the other 78. The existing bucket was reused. No request/customer write was made during this closure attempt.

Live customer/request counts remained unchanged; reserved QA customers remained zero. The protected regression asserted **0 submission network requests**. This closure run is separate from the historical, already-cleaned QA incident documented below. See [preservation-verification.json](phase5.1.1-evidence/final-closure/preservation-verification.json).

Chowki seating and Brocade runners remain blocked. Commercial-license-filtered furniture photographs were reviewed at native resolution; accurate retailer furniture photos lacked grants and reusable scenes were dark, clipped or too small. Brocade runner follow-ups found no image satisfying both documented brocade construction and commercial image rights. The new detailed approval/rejection record is [research.json](phase5.1.1-evidence/final-closure/research.json). These two records retain null image fields, rather than inheriting unrelated images.

Deployment verification: Vercel reported **success** for image commit `dfe700d`. The production credits HTML matches the generated file byte-for-byte, lists 40 photographs, and the production bundle matches the validated local build. See [deployment-verification.json](phase5.1.1-evidence/final-closure/deployment-verification.json).

## Coverage and initial findings

| Category | Products | Before | Approved now | Unresolved |
| --- | ---: | ---: | ---: | --- |
| Seating | 8 | 4 | 7 | Chowki |
| Tables | 5 | 1 | 5 | None |
| Linens | 8 | 0 | 7 | Brocade runners |
| Mandap & stage | 9 | 1 | 9 | None |
| Decor | 7 | 6 | 7 | None |
| Serveware | 5 | 4 | 5 | None |

Before this work, 16 database records pointed to local WebP paths and 26 had null image metadata. All 16 assigned paths returned HTTP 200 from production at the initial check, but 16 responses were HTML rather than images: the SPA fallback hid missing asset failures. See [initial-image-audit.json](phase5.1.1-evidence/initial-image-audit.json). A successful HTTP status alone did not establish image availability.

The retained local variants were visually reviewed. The Chiavari portrait was especially susceptible to soft rendering because the old srcset sizes string requested only 130 CSS pixels and could select a small portrait variant. Primary cards now request the approved larger database image. The prior sofa studio image was replaced with a verified real photograph of an event loveseat; photographic provenance of the previous image was insufficient. The folding chairs clearly depict folding metal chairs and were retained. All other retained images received larger locally optimized variants and verified photographer attribution.

Rendered screenshot review also identified an intrinsic CSS grid sizing bug: portrait image elements could grow beyond the reserved 230px parent even with object-fit: contain, causing the parent to clip chairs, swings and other tall objects. An explicit minmax(0,1fr) grid track and zero minimum image size now constrain each element to its frame. The browser audit asserts actual rendered image height and width, so a contain declaration alone cannot pass this check.

Element-level layout-shift tracing also identified the related-collections section moving when the asynchronous catalogue response inserted its grid. Invisible, non-interactive loading shells now reserve the existing grid geometry using the preserved legacy category identities. Once loaded, visible cards and image URLs come from database records. The loading message is out of normal flow. No finished layout or branding changed, and the QA gate now rejects whole-page CLS above 0.1.

The Phase 4.5 audit and Phase 5.1 architecture were read. The old product image manifest, all 80 old local variants, category listing, shared cart, request review, and confirmation were inspected. No separate rental product detail route exists in this application. Editorial category heroes remain separate from product photography.

## Initial audit of all 42 records

Dimensions below describe the local main WebP referenced before the change; production responses were HTML and had no decodable image dimensions. Existing image URLs were unique across the 16 assigned products.

| Product ID | Name / category | Previous image URL | Local dimensions | Initial loading / quality / replacement decision |
| --- | --- | --- | --- | --- |
| decor:torans | Torans / decor | `/images/rentals/toran-480-480x320-6573e358cf.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| decor:diyas | Diyas / decor | `/images/rentals/diya-480-480x270-7ed1d145fb.webp` | 480×270 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| decor:urlis | Urlis / decor | NULL | — | No photograph; source required. Approved final assignment below. |
| decor:kalash | Kalash / decor | `/images/rentals/kalash-480-270x480-344091c45f.webp` | 270×480 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| decor:fanoos-and-lanterns | Fanoos and lanterns / decor | `/images/rentals/fanoos-480-480x320-4cd59aa16f.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| decor:marigold-garlands-and-malas | Marigold garlands and malas / decor | `/images/rentals/marigold-garland-480-360x480-48ac4583dc.webp` | 360×480 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| decor:rose-garlands | Rose garlands / decor | `/images/rentals/rose-garland-480-480x320-171a237c87.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| linens:tablecloths-and-chadar | Tablecloths and chadar / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| linens:silk-runners | Silk runners / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| linens:brocade-runners | Brocade runners / linens | NULL | — | No photograph; source required. Still blocked. |
| linens:napkins | Napkins / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| linens:chair-covers | Chair covers / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| linens:chair-sashes | Chair sashes / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| linens:ceiling-drapes | Ceiling drapes / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| linens:wall-drapes-and-parda | Wall drapes and parda / linens | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:wedding-mandaps | Wedding mandaps / mandap-stage | `/images/rentals/wedding-mandap-480-480x320-4a061589da.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| mandap-stage:stage-setups | Stage setups / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:sweetheart-table-setups | Sweetheart table setups / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:pillars-and-stambh | Pillars and stambh / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:arches | Arches / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:floral-backdrops | Floral backdrops / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:fabric-backdrops | Fabric backdrops / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:frame-backdrops | Frame backdrops / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| mandap-stage:tents-canopies-and-shamiyana | Tents, canopies, and shamiyana / mandap-stage | NULL | — | No photograph; source required. Approved final assignment below. |
| seating:chiavari-chairs | Chiavari chairs / seating | `/images/rentals/chiavari-chair-480-270x480-9146473311.webp` | 270×480 | 200 / text/html; charset=utf-8; not a decodable product image. Undersized responsive selection could appear blurry; larger variant required. Approved final assignment below. |
| seating:banquet-chairs | Banquet chairs / seating | NULL | — | No photograph; source required. Approved final assignment below. |
| seating:folding-chairs | Folding chairs / seating | `/images/rentals/folding-chair-480-480x322-01acd5ae49.webp` | 480×322 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| seating:sofas-and-loveseats | Sofas and loveseats / seating | `/images/rentals/sofa-loveseat-480-480x320-65969e3216.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Replace prior studio composition with verified event photograph. Approved final assignment below. |
| seating:gaddi-and-floor-mattresses | Gaddi and floor mattresses / seating | NULL | — | No photograph; source required. Approved final assignment below. |
| seating:bolsters | Bolsters / seating | NULL | — | No photograph; source required. Approved final assignment below. |
| seating:chowki | Chowki / seating | NULL | — | No photograph; source required. Still blocked. |
| seating:jhoola | Jhoola / seating | `/images/rentals/jhoola-480-360x480-86887417be.webp` | 360×480 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| serveware:thaal-and-platters | Thaal and platters / serveware | `/images/rentals/thaal-480-480x326-45c08d78b0.webp` | 480×326 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| serveware:handi | Handi / serveware | `/images/rentals/handi-480-320x480-1bdbe0809d.webp` | 320×480 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| serveware:chafing-dishes | Chafing dishes / serveware | `/images/rentals/chafing-dish-480-480x320-449c3ac8c1.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| serveware:plates-and-glasses | Plates and glasses / serveware | `/images/rentals/plates-glasses-480-320x480-2a1ad25e57.webp` | 320×480 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| serveware:katori | Katori / serveware | NULL | — | No photograph; source required. Approved final assignment below. |
| tables:round-60-inch-tables | Round 60-inch tables / tables | `/images/rentals/round-table-480-480x320-fce06f5929.webp` | 480×320 | 200 / text/html; charset=utf-8; not a decodable product image. Product type identifiable locally; publish larger optimized copy to Storage. Approved final assignment below. |
| tables:banquet-tables-6ft-and-8ft | Banquet tables, 6ft and 8ft / tables | NULL | — | No photograph; source required. Approved final assignment below. |
| tables:buffet-tables | Buffet tables / tables | NULL | — | No photograph; source required. Approved final assignment below. |
| tables:cocktail-and-high-tables | Cocktail and high tables / tables | NULL | — | No photograph; source required. Approved final assignment below. |
| tables:low-chowki-tables | Low chowki tables / tables | NULL | — | No photograph; source required. Approved final assignment below. |

## Final assignments, source attribution and optimization

All approved photographs are classified **representative**. They genuinely depict the named product type, but neither the actual Events by Somia inventory design nor exact dimensions/materials can be established from stock photography. An exact type match is not presented as an exact inventory photograph. For multi-item product names, the image represents a visibly depicted member of that product group; e.g. the event marquee does not claim to be a traditional shamiyana, and the table photograph does not establish a 6ft/8ft measurement.

The silk runner is an explicitly disclosed historic Japanese silk/metallic-thread runner from Cleveland Museum of Art accession 1939.145. Its museum record verifies the material; age-related fading is visible. It is not presented as a photograph of modern rental inventory. The bolster uses a reviewed native 1000×750 crop of a real traditional cylindrical cushion; it is not upscaled. It has moderate source detail rather than studio-level textile detail.

Downloaded originals total **139,165,676 bytes**. Main WebP files total **6,981,834 bytes** (95.0% smaller); thumbnails total **789,956 bytes**. Combined optimized storage is **7,771,790 bytes**. Sizes are measured download/file lengths, not estimated original sizes.

Main variants preserve aspect ratio at a maximum edge of 1400px, thumbnails at 384px, with no upscaling. Crops are individually reviewed normalized coordinates in the source manifest. Cards and request rows use object-fit: contain and existing reserved boxes. Unused originals remain outside the repository; previously existing assets were retained.

Public attribution, original links, license links and adaptation notices are provided at [/rental-photo-credits.html](https://www.eventsbysomia.com/rental-photo-credits.html), linked in the footer. The cropped bolster derivative remains CC BY-SA 4.0. The gaddi source is CC BY 2.0. Other licenses are recorded per item below. No generated images or commercial images without reuse rights were used.

### Seating

**Chiavari chairs** — `seating:chiavari-chairs`

- Source: [Pexels / Beyzaa Yurtkuran](https://www.pexels.com/photo/white-chairs-in-the-garden-17027528/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 3512×6240, **3,264,332 B**. Main: 788×1400, **189,164 B**. Thumbnail: 216×384, **22,110 B**.
- Storage objects: `seating/chiavari-chairs-fe7790430ddb.webp`; `seating/chiavari-chairs-a52badf69edc-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/chiavari-chairs-fe7790430ddb.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/chiavari-chairs-a52badf69edc-thumb.webp).
- image_alt: “White Chiavari chairs arranged on a lawn for an outdoor event”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Banquet chairs** — `seating:banquet-chairs`

- Source: [Unsplash / SR Engineers and Consultants](https://unsplash.com/photos/empty-banquet-hall-with-red-chairs-and-round-tables-S3Qh6mNZbLc); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Sharp foreground upholstered banquet chairs are clearly identifiable. Event venue background; not the business's exact stock. Use lower central crop focusing the complete foreground chair if useful.
- Original: 4000×2252, **1,163,881 B**. Main: 1400×788, **183,938 B**. Thumbnail: 384×216, **22,036 B**.
- Storage objects: `seating/banquet-chairs-d53195641dff.webp`; `seating/banquet-chairs-b739ff7b18a3-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/banquet-chairs-d53195641dff.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/banquet-chairs-b739ff7b18a3-thumb.webp).
- image_alt: “Red upholstered metal-frame banquet chairs arranged around event tables”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Folding chairs** — `seating:folding-chairs`

- Source: [Unsplash / chuck cunningham](https://unsplash.com/photos/pile-of-white-metal-folding-chairs-WBN9zHXKeig); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 4565×3059, **2,112,256 B**. Main: 1400×938, **162,358 B**. Thumbnail: 384×257, **23,588 B**.
- Storage objects: `seating/folding-chairs-e8c6ed33bbeb.webp`; `seating/folding-chairs-bc36ff2c8db7-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/folding-chairs-e8c6ed33bbeb.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/folding-chairs-bc36ff2c8db7-thumb.webp).
- image_alt: “A group of white metal folding chairs arranged in rows”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Sofas and loveseats** — `seating:sofas-and-loveseats`

- Source: [Pexels / Mushtaq Hussain](https://www.pexels.com/photo/a-white-leather-couch-on-a-stage-6272063/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Real event-sofa photograph visually reviewed. Crop removes empty ceiling and foreground while retaining full back, arms and feet. Replaces studio furniture image with uncertain photographic provenance.
- Original: 3376×6000, **2,323,421 B**. Main: 1400×995, **106,326 B**. Thumbnail: 384×273, **10,930 B**.
- Storage objects: `seating/sofas-and-loveseats-b31c3c8eee28.webp`; `seating/sofas-and-loveseats-e6b576e1f226-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/sofas-and-loveseats-b31c3c8eee28.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/sofas-and-loveseats-e6b576e1f226-thumb.webp).
- image_alt: “An ornate ivory event loveseat with a tufted back and carved wooden frame”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Gaddi and floor mattresses** — `seating:gaddi-and-floor-mattresses`

- Source: [Wikimedia Commons / snikrap](https://commons.wikimedia.org/wiki/File:Jaipur_city_palace_interior,_Rajasthan.jpg); [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Match: `representative`.
- Visual review: Real traditional Indian floor mattress and backrest, with visible textile detail. Crop lower portion to make mattress subject prominent and remove ornate ceiling. Representative heritage arrangement, not exact rental inventory.
- Original: 1425×1997, **2,357,344 B**. Main: 1230×737, **117,028 B**. Thumbnail: 384×230, **18,978 B**.
- Storage objects: `seating/gaddi-and-floor-mattresses-ada91ad843ee.webp`; `seating/gaddi-and-floor-mattresses-bcf74b41ffe7-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/gaddi-and-floor-mattresses-ada91ad843ee.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/gaddi-and-floor-mattresses-bcf74b41ffe7-thumb.webp).
- image_alt: “Traditional magenta Indian gaddi floor mattress with cushions in Jaipur”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Bolsters** — `seating:bolsters`

- Source: [Wikimedia Commons / Shahriar Amin Fahim247](https://commons.wikimedia.org/wiki/File:Mehrangarh_fort9.jpg); [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Match: `representative`.
- Visual review: Reviewed native1000×750 crop: clear cylindrical side, rounded end, red bands, gold seams and velvet highlights. Native bolster about500px wide; adequate for230px card region at2x without upscaling. Brighter and clearer than PhulMahal3 crop (rejected). Context is a real Indian heritage floor-seating installation, not exact rental inventory.
- Original: 6840×4560, **9,607,738 B**. Main: 1000×750, **45,530 B**. Thumbnail: 384×288, **11,126 B**.
- Storage objects: `seating/bolsters-bb380d1ce001.webp`; `seating/bolsters-032162a08b47-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/bolsters-bb380d1ce001.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/bolsters-032162a08b47-thumb.webp).
- image_alt: “Traditional cylindrical green velvet bolster with red and gold bands on Indian floor seating”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Chowki** — `seating:chowki`

**BLOCKED:** Accurate isolated retailer/CEPT furniture photographs lack a commercial reuse grant. Newly reviewed commercially licensed scenes do not provide a distinct, sharp, complete high-resolution seating chowki photograph. The approved low-table photograph is not reused or relabelled as seating. Database image_url, thumbnail_url, image_alt and image_match_type remain NULL. The UI displays “Photo unavailable”.

**Jhoola** — `seating:jhoola`

- Source: [Pexels / Mehul Soni](https://www.pexels.com/photo/colorful-traditional-indian-interior-with-swing-37026460/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 3072×4096, **2,316,815 B**. Main: 1128×1400, **257,860 B**. Thumbnail: 309×384, **24,604 B**.
- Storage objects: `seating/jhoola-1f109947c08c.webp`; `seating/jhoola-de25fa9acd64-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/jhoola-1f109947c08c.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/seating/jhoola-de25fa9acd64-thumb.webp).
- image_alt: “A traditional decorative jhoola swing in an ornate Indian interior”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

### Tables

**Round 60-inch tables** — `tables:round-60-inch-tables`

- Source: [Unsplash / Mitchell Lawler](https://unsplash.com/photos/party-dish-arrangement-tbaoryUol_E); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 6016×4016, **4,751,946 B**. Main: 1400×935, **133,600 B**. Thumbnail: 384×256, **22,424 B**.
- Storage objects: `tables/round-60-inch-tables-03f6996fa666.webp`; `tables/round-60-inch-tables-b5b297f80519-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/round-60-inch-tables-03f6996fa666.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/round-60-inch-tables-b5b297f80519-thumb.webp).
- image_alt: “Round reception tables arranged for a celebration”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Banquet tables, 6ft and 8ft** — `tables:banquet-tables-6ft-and-8ft`

- Source: [Unsplash / Jennifer Kalenberg](https://unsplash.com/photos/a-beautifully-decorated-long-table-set-for-a-wedding-reception-3nx3qOwSSLs); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Clear foreground rectangular banquet tabletop with visible long straight edges; dressed event-table arrangement. Actual 6ft or 8ft dimensions cannot be established from photograph, so representative only. Foreground subject is table setup rather than general wedding scene.
- Original: 5040×3360, **4,483,633 B**. Main: 1400×933, **179,228 B**. Thumbnail: 384×256, **25,060 B**.
- Storage objects: `tables/banquet-tables-6ft-and-8ft-24138ffb6507.webp`; `tables/banquet-tables-6ft-and-8ft-dcfe4e6f3175-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/banquet-tables-6ft-and-8ft-24138ffb6507.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/banquet-tables-6ft-and-8ft-dcfe4e6f3175-thumb.webp).
- image_alt: “Long rectangular wooden banquet table arranged with place settings for a reception”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Buffet tables** — `tables:buffet-tables`

- Source: [Pexels / Vidal Balielo Jr.](https://www.pexels.com/photo/a-buffet-table-at-a-private-event-14646750/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Unlike food close-ups, entire long tabletop and substantial pedestal supports visible. Real event buffet-table arrangement; not exact inventory.
- Original: 5472×3648, **3,164,251 B**. Main: 1400×933, **242,240 B**. Thumbnail: 384×256, **24,468 B**.
- Storage objects: `tables/buffet-tables-313b6bc21df8.webp`; `tables/buffet-tables-801a1c4067da-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/buffet-tables-313b6bc21df8.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/buffet-tables-801a1c4067da-thumb.webp).
- image_alt: “Long dark buffet tables with visible pedestal supports arranged for event serving”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Cocktail and high tables** — `tables:cocktail-and-high-tables`

- Source: [Unsplash / Matt Benson](https://unsplash.com/photos/empty-event-space-with-decorated-high-top-tables-4PEkh4rvyMQ); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Sharp real photograph with five complete high-top tables clearly visible. Suitable representative event setup. Crop left 80% removes incidental person while retaining four full tables.
- Original: 6048×4024, **4,806,900 B**. Main: 1400×1122, **118,710 B**. Thumbnail: 384×308, **9,698 B**.
- Storage objects: `tables/cocktail-and-high-tables-b28722894a28.webp`; `tables/cocktail-and-high-tables-5788a17c05c0-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/cocktail-and-high-tables-b28722894a28.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/cocktail-and-high-tables-5788a17c05c0-thumb.webp).
- image_alt: “Tall round cocktail tables dressed in white and blue cloth for an event”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Low chowki tables** — `tables:low-chowki-tables`

- Source: [Flickr / Mustang Joe](https://www.flickr.com/photos/mustangjoe/54350044704/); [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/). Match: `representative`.
- Visual review: Entire square wooden low platform table visible including top, front carved trim, and all visible legs; dominant foreground product (~730 native pixels wide) within1300x866 crop. Clear enough for catalogue cards. Background cushions establish floor-seating scale. Actual rental inventory not asserted.
- Original: 5669×3833, **19,690,508 B**. Main: 1300×866, **99,958 B**. Thumbnail: 384×256, **16,770 B**.
- Storage objects: `tables/low-chowki-tables-5998f5e56689.webp`; `tables/low-chowki-tables-ec6a1dc56a7f-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/low-chowki-tables-5998f5e56689.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/low-chowki-tables-ec6a1dc56a7f-thumb.webp).
- image_alt: “Representative ornate low wooden chowki table with carved trim and short legs in a traditional Indian palace interior”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

### Linens

**Tablecloths and chadar** — `linens:tablecloths-and-chadar`

- Source: [Pexels / Taylor Thompson](https://www.pexels.com/photo/elegant-table-setting-with-red-tablecloth-37298349/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Clear red tablecloth covers most of frame, hem and edge visible; styled event context. Not an assertion of rental inventory or chadar material.
- Original: 2695×3591, **1,095,311 B**. Main: 1051×1400, **127,692 B**. Thumbnail: 288×384, **17,734 B**.
- Storage objects: `linens/tablecloths-and-chadar-37355a022720.webp`; `linens/tablecloths-and-chadar-0290dea61ad0-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/tablecloths-and-chadar-37355a022720.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/tablecloths-and-chadar-0290dea61ad0-thumb.webp).
- image_alt: “Red tablecloth draped over a round reception table”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Silk runners** — `linens:silk-runners`

- Source: [Cleveland Museum of Art / The Cleveland Museum of Art](https://www.clevelandart.org/art/1939.145); [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Match: `representative`.
- Visual review: Museum professional isolated photograph of a real silk table runner, dated late 19th–early 20th century, Japan. Some historic fading; actual material is verified by museum, but it is not a modern event inventory photograph. Parent should judge suitability before approval. Parent has since visually reviewed this photograph and accepted historical representative silk classification. Approved as explicitly representative historical silk runner. Fading documented; weave and actual type are verified by museum.
- Original: 3400×976, **1,683,405 B**. Main: 1400×402, **174,592 B**. Thumbnail: 384×110, **11,440 B**.
- Storage objects: `linens/silk-runners-cc4bb271c4a4.webp`; `linens/silk-runners-7cbd3790baf1-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/silk-runners-cc4bb271c4a4.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/silk-runners-7cbd3790baf1-thumb.webp).
- image_alt: “Representative silk and metallic thread table runner with orange decorative motifs”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Brocade runners** — `linens:brocade-runners`

**BLOCKED:** No researched photograph simultaneously establishes an actual brocade table runner, suitable clear product framing/resolution, and affirmative commercial reuse rights. Public-domain actual runner photos lack documented brocade construction and/or usable photography; documented contemporary brocade runner photos do not grant commercial reuse. No image inferred from appearance or unrelated textile assigned. Database image_url, thumbnail_url, image_alt and image_match_type remain NULL. The UI displays “Photo unavailable”.

**Napkins** — `linens:napkins`

- Source: [Pexels / Taylor Thompson](https://www.pexels.com/photo/elegant-table-setting-with-silver-cutlery-37936110/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Two folded navy cloth napkins clearly visible and sharp in a simple table setting; material not asserted.
- Original: 2634×3951, **693,412 B**. Main: 933×1400, **42,838 B**. Thumbnail: 256×384, **7,524 B**.
- Storage objects: `linens/napkins-6639e26919c0.webp`; `linens/napkins-4f6f1bdf43ff-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/napkins-6639e26919c0.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/napkins-4f6f1bdf43ff-thumb.webp).
- image_alt: “Folded navy cloth napkins with silver cutlery on a white tablecloth”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Chair covers** — `linens:chair-covers`

- Source: [Pixabay / Hans](https://pixabay.com/photos/wedding-table-ballroom-room-1174141/); [Pixabay Content License](https://pixabay.com/service/license-summary/). Match: `representative`.
- Visual review: Foreground chairs are fully visible wearing white fabric covers to the floor; useful event context, not tiny background objects. Original image 4608×3456; selected licensed 1280×960 downloadable derivative.
- Original: 1280×960, **318,956 B**. Main: 1280×960, **151,186 B**. Thumbnail: 384×288, **20,118 B**.
- Storage objects: `linens/chair-covers-716020899155.webp`; `linens/chair-covers-dfa230134708-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/chair-covers-716020899155.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/chair-covers-dfa230134708-thumb.webp).
- image_alt: “White fitted chair covers with ties around a reception table”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Chair sashes** — `linens:chair-sashes`

- Source: [Pexels / Kader Azra Namuslu](https://www.pexels.com/photo/elegant-beachside-wedding-chairs-with-black-bows-33802945/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Black fabric sashes prominent and clearly distinguishable against white chairs; beach background subdued; entire sash length visible.
- Original: 6000×3368, **1,140,089 B**. Main: 1400×786, **77,078 B**. Thumbnail: 384×216, **14,270 B**.
- Storage objects: `linens/chair-sashes-9f0b04ab31bd.webp`; `linens/chair-sashes-2d925713aada-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/chair-sashes-9f0b04ab31bd.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/chair-sashes-2d925713aada-thumb.webp).
- image_alt: “Black fabric sashes tied in bows around white event chairs”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Ceiling drapes** — `linens:ceiling-drapes`

- Source: [Unsplash / Patrick Shaun](https://unsplash.com/photos/a-group-of-pink-and-white-drapes-hanging-from-a-ceiling-TJMLQSIS5rc); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Low-angle photograph with fabric ceiling swags as dominant subject; no people or generic wedding scene. Downloaded preview 1100×733; original dimensions not yet obtained.
- Original: 6000×4000, **7,168,893 B**. Main: 1400×933, **120,326 B**. Thumbnail: 384×256, **9,852 B**.
- Storage objects: `linens/ceiling-drapes-d53a5e9dbac6.webp`; `linens/ceiling-drapes-738a201afb10-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/ceiling-drapes-d53a5e9dbac6.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/ceiling-drapes-738a201afb10-thumb.webp).
- image_alt: “Pink and cream fabric drapes suspended in swags overhead”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Wall drapes and parda** — `linens:wall-drapes-and-parda`

- Source: [Pexels / Fandy Much](https://www.pexels.com/photo/elegant-red-curtains-in-soft-lighting-35836715/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Curtain is sole subject; real textured fabric and crisp pleats. Does not establish specific event installation or rental inventory.
- Original: 3000×2000, **710,906 B**. Main: 1400×933, **152,112 B**. Thumbnail: 384×256, **7,076 B**.
- Storage objects: `linens/wall-drapes-and-parda-7a4f09cb416c.webp`; `linens/wall-drapes-and-parda-a3222eff8ee3-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/wall-drapes-and-parda-7a4f09cb416c.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/linens/wall-drapes-and-parda-a3222eff8ee3-thumb.webp).
- image_alt: “Red fabric curtain with clearly defined vertical pleats”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

### Mandap & stage

**Wedding mandaps** — `mandap-stage:wedding-mandaps`

- Source: [Unsplash / AMISH THAKKAR](https://unsplash.com/photos/wedding-ceremony-under-floral-canopy-7O422yG_b80); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 5184×3456, **2,834,214 B**. Main: 1400×933, **205,898 B**. Thumbnail: 384×256, **21,286 B**.
- Storage objects: `mandap-stage/wedding-mandaps-807554eccb79.webp`; `mandap-stage/wedding-mandaps-be0ee813b8a5-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/wedding-mandaps-807554eccb79.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/wedding-mandaps-be0ee813b8a5-thumb.webp).
- image_alt: “A South Asian wedding ceremony beneath a flower-decorated mandap”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Stage setups** — `mandap-stage:stage-setups`

- Source: [Pexels / The Visionary Vows](https://www.pexels.com/photo/elegant-wedding-stage-with-floral-decor-33485972/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Complete raised event stage and seating installation is the main subject; genuine camera capture with source EXIF.
- Original: 5760×3840, **2,352,952 B**. Main: 1400×933, **224,058 B**. Thumbnail: 384×256, **23,760 B**.
- Storage objects: `mandap-stage/stage-setups-e0874fd7c28f.webp`; `mandap-stage/stage-setups-ce988f89f500-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/stage-setups-e0874fd7c28f.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/stage-setups-ce988f89f500-thumb.webp).
- image_alt: “A white and blush wedding stage with an ornate loveseat, floral pedestals and hanging flowers”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Sweetheart table setups** — `mandap-stage:sweetheart-table-setups`

- Source: [Unsplash / Jen Vazquez](https://unsplash.com/photos/a-decorated-table-set-for-a-wedding-in-a-forest-uOO5D8UPuMw); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Clearly two-person sweetheart table. Original is portrait with substantial empty woods above; crop around table and both chair backs.
- Original: 2832×4256, **2,361,718 B**. Main: 1400×1179, **293,466 B**. Thumbnail: 384×323, **30,008 B**.
- Storage objects: `mandap-stage/sweetheart-table-setups-012928fb9c2b.webp`; `mandap-stage/sweetheart-table-setups-166a278fe23e-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/sweetheart-table-setups-012928fb9c2b.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/sweetheart-table-setups-166a278fe23e-thumb.webp).
- image_alt: “A decorated sweetheart table for two with floral garland and candles in an outdoor setting”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Pillars and stambh** — `mandap-stage:pillars-and-stambh`

- Source: [Pexels / BANU FILM ADS](https://www.pexels.com/photo/golden-columns-and-colorful-flowers-on-stage-14395559/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Four decorated golden stambh are clearly visible in ceremonial installation. Representative installed pillars rather than isolated freestanding inventory.
- Original: 6720×4480, **3,650,487 B**. Main: 1400×933, **266,012 B**. Thumbnail: 384×256, **25,616 B**.
- Storage objects: `mandap-stage/pillars-and-stambh-4033120a8c42.webp`; `mandap-stage/pillars-and-stambh-88433ae20b02-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/pillars-and-stambh-4033120a8c42.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/pillars-and-stambh-88433ae20b02-thumb.webp).
- image_alt: “Carved golden ceremonial pillars supporting a flower-decorated Indian wedding mandap”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Arches** — `mandap-stage:arches`

- Source: [Pexels / Leeloo The First](https://www.pexels.com/photo/a-wedding-arch-with-blooming-flowers-5039336/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Entire floral arch, both legs and curve visible. Bright high-key exposure; product details remain legible.
- Original: 4016×6016, **3,819,942 B**. Main: 935×1400, **178,996 B**. Thumbnail: 256×384, **21,862 B**.
- Storage objects: `mandap-stage/arches-c03428dc43fa.webp`; `mandap-stage/arches-edd33503e6e1-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/arches-c03428dc43fa.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/arches-edd33503e6e1-thumb.webp).
- image_alt: “A freestanding outdoor wedding arch covered with white and blush flowers”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Floral backdrops** — `mandap-stage:floral-backdrops`

- Source: [Pexels / Rafaela Freire](https://www.pexels.com/photo/elegant-rustic-wedding-decor-with-floral-backdrop-32435252/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Clearly installed floral backdrop spans most of photograph. Foreground flowers are intentionally out of focus; backdrop itself is sharp.
- Original: 6224×4672, **5,258,466 B**. Main: 1400×1051, **239,776 B**. Thumbnail: 384×288, **28,920 B**.
- Storage objects: `mandap-stage/floral-backdrops-1ec4549f7c80.webp`; `mandap-stage/floral-backdrops-2c09a00d3155-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/floral-backdrops-1ec4549f7c80.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/floral-backdrops-2c09a00d3155-thumb.webp).
- image_alt: “A white flower wall forming a wedding backdrop behind a reception table”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Fabric backdrops** — `mandap-stage:fabric-backdrops`

- Source: [Pexels / Kadir Altıntaş](https://www.pexels.com/photo/elegant-wedding-backdrop-with-floral-decor-36230880/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Full fabric backdrop installation main subject with two small seats in foreground; use contain to retain fabric arrangement.
- Original: 4000×6000, **4,071,914 B**. Main: 933×1400, **161,810 B**. Thumbnail: 256×384, **21,318 B**.
- Storage objects: `mandap-stage/fabric-backdrops-f70709d7a16e.webp`; `mandap-stage/fabric-backdrops-f66b73f428a2-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/fabric-backdrops-f70709d7a16e.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/fabric-backdrops-f66b73f428a2-thumb.webp).
- image_alt: “An ivory fabric event backdrop with crossed drapes and warm decorative lights”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Frame backdrops** — `mandap-stage:frame-backdrops`

- Source: [Unsplash / jason hu](https://unsplash.com/photos/wedding-arch-with-white-fabric-dnpbqu89lr8); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Black rectangular support frame is clearly visible along top and right side. Draped wedding/event backdrop installation; frame is prominent and no people.
- Original: 3832×5748, **5,554,485 B**. Main: 933×1400, **234,918 B**. Thumbnail: 256×384, **21,378 B**.
- Storage objects: `mandap-stage/frame-backdrops-34a32666d453.webp`; `mandap-stage/frame-backdrops-cebea300698d-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/frame-backdrops-34a32666d453.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/frame-backdrops-cebea300698d-thumb.webp).
- image_alt: “A black freestanding event backdrop frame hung with white fabric and greenery”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Tents, canopies, and shamiyana** — `mandap-stage:tents-canopies-and-shamiyana`

- Source: [Pexels / Sydney Sang](https://www.pexels.com/photo/elegant-white-event-tent-against-blue-sky-28937190/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Tent is dominant subject. Representative event marquee, does not establish traditional shamiyana or offered inventory. No camping-tent substitution.
- Original: 6240×4160, **1,861,391 B**. Main: 1400×933, **112,884 B**. Thumbnail: 384×256, **11,656 B**.
- Storage objects: `mandap-stage/tents-canopies-and-shamiyana-97ce5c959ca2.webp`; `mandap-stage/tents-canopies-and-shamiyana-a6831c6d1ede-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/tents-canopies-and-shamiyana-97ce5c959ca2.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/mandap-stage/tents-canopies-and-shamiyana-a6831c6d1ede-thumb.webp).
- image_alt: “A large white event marquee tent with peaked roof and clear side panels”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

### Decor

**Torans** — `decor:torans`

- Source: [Unsplash / Phil Hearing](https://unsplash.com/photos/blue-door-with-marigold-garland-ZNbUnGhdwag); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 7564×5045, **4,329,861 B**. Main: 1400×934, **195,894 B**. Thumbnail: 384×256, **20,872 B**.
- Storage objects: `decor/torans-71900f278f12.webp`; `decor/torans-c219a764a812-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/torans-71900f278f12.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/torans-c219a764a812-thumb.webp).
- image_alt: “A marigold toran welcoming guests above a doorway”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Diyas** — `decor:diyas`

- Source: [Unsplash / Div](https://unsplash.com/photos/a-candle-burning-in-a-bowl-ZIshy6iNMJY); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 4032×2268, **732,739 B**. Main: 1400×788, **47,304 B**. Thumbnail: 384×216, **7,566 B**.
- Storage objects: `decor/diyas-3b510f9e7e0e.webp`; `decor/diyas-97f375c9eee7-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/diyas-3b510f9e7e0e.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/diyas-97f375c9eee7-thumb.webp).
- image_alt: “A single lit diya placed beside flowers at dusk”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Urlis** — `decor:urlis`

- Source: [WordPress Photo Directory / Yam B Chhetri](https://wordpress.org/photos/photo/55967b08b2/); [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Match: `representative`.
- Visual review: Clearly shallow decorative metal basin with floating flowers, photographed overhead. Real visible texture and aged rim, no AI. Source labels decorative brass bowl.
- Original: 3024×4032, **2,707,630 B**. Main: 1050×1400, **331,334 B**. Thumbnail: 288×384, **29,716 B**.
- Storage objects: `decor/urlis-2dc945f77170.webp`; `decor/urlis-b8b860ddc6a9-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/urlis-2dc945f77170.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/urlis-b8b860ddc6a9-thumb.webp).
- image_alt: “A shallow copper-colored decorative urli filled with water and floating flowers”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Kalash** — `decor:kalash`

- Source: [Unsplash / Pranav Shirali](https://unsplash.com/photos/a-religious-offering-with-a-coconut-and-ganesha-idol-GEs6tCVt7P0); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 2268×4032, **1,535,426 B**. Main: 787×1400, **195,400 B**. Thumbnail: 216×384, **25,856 B**.
- Storage objects: `decor/kalash-5014830e88f2.webp`; `decor/kalash-a3d1d49a929d-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/kalash-5014830e88f2.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/kalash-a3d1d49a929d-thumb.webp).
- image_alt: “A ceremonial kalash with coconut, flowers, and traditional offerings”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Fanoos and lanterns** — `decor:fanoos-and-lanterns`

- Source: [Unsplash / Sonika Agarwal](https://unsplash.com/photos/a-bunch-of-lights-that-are-hanging-from-a-ceiling-f-n-igyuMRg); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 5400×3600, **2,939,930 B**. Main: 1400×933, **168,330 B**. Thumbnail: 384×256, **18,730 B**.
- Storage objects: `decor/fanoos-and-lanterns-4df02b555ead.webp`; `decor/fanoos-and-lanterns-b773111edbc2-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/fanoos-and-lanterns-4df02b555ead.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/fanoos-and-lanterns-b773111edbc2-thumb.webp).
- image_alt: “Colorful hanging fanoos lanterns displayed for Diwali”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Marigold garlands and malas** — `decor:marigold-garlands-and-malas`

- Source: [Pexels / Sunannya Das](https://www.pexels.com/photo/bright-orange-marigold-garlands-in-close-up-35124359/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 3072×4096, **2,332,046 B**. Main: 1050×1400, **485,158 B**. Thumbnail: 288×384, **48,094 B**.
- Storage objects: `decor/marigold-garlands-and-malas-eb983e3da036.webp`; `decor/marigold-garlands-and-malas-77fa20beae11-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/marigold-garlands-and-malas-eb983e3da036.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/marigold-garlands-and-malas-77fa20beae11-thumb.webp).
- image_alt: “Orange marigold malas arranged together in close-up”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Rose garlands** — `decor:rose-garlands`

- Source: [Pexels / Nomadic Journey (VikramSingh Valera)](https://www.pexels.com/photo/vibrant-floral-garland-display-with-roses-and-chrysanthemums-34071580/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 5568×3712, **2,745,287 B**. Main: 1400×933, **157,340 B**. Thumbnail: 384×256, **19,054 B**.
- Storage objects: `decor/rose-garlands-653aa42f24d6.webp`; `decor/rose-garlands-23ccf8f605af-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/rose-garlands-653aa42f24d6.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/decor/rose-garlands-23ccf8f605af-thumb.webp).
- image_alt: “Traditional floral garlands with red roses, jasmine, and other flowers”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

### Serveware

**Thaal and platters** — `serveware:thaal-and-platters`

- Source: [Unsplash / fuseviews](https://unsplash.com/photos/a-metal-tray-topped-with-different-types-of-food-bKmSUcAGrvI); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 5590×3802, **3,661,545 B**. Main: 1400×952, **164,054 B**. Thumbnail: 384×261, **16,848 B**.
- Storage objects: `serveware/thaal-and-platters-8ea2b4e901a3.webp`; `serveware/thaal-and-platters-7cd1096cd7dc-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/thaal-and-platters-8ea2b4e901a3.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/thaal-and-platters-7cd1096cd7dc-thumb.webp).
- image_alt: “A traditional Indian metal thaal arranged with a shared meal”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Handi** — `serveware:handi`

- Source: [Pexels / Narasimhan AVPL](https://www.pexels.com/photo/traditional-indian-dish-cooking-outdoors-37173431/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 4000×6000, **2,930,802 B**. Main: 933×1400, **225,800 B**. Thumbnail: 256×384, **22,220 B**.
- Storage objects: `serveware/handi-3a22c21b9853.webp`; `serveware/handi-d53f2cdc7c64-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/handi-3a22c21b9853.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/handi-d53f2cdc7c64-thumb.webp).
- image_alt: “An Indian dish cooking in a brass pot”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Chafing dishes** — `serveware:chafing-dishes`

- Source: [Unsplash / You Le](https://unsplash.com/photos/a-chafing-dish-filled-with-cooked-vegetables-gfo8ESLIaCA); [Unsplash License](https://unsplash.com/license). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 6000×4000, **3,481,198 B**. Main: 1400×933, **111,060 B**. Thumbnail: 384×256, **18,390 B**.
- Storage objects: `serveware/chafing-dishes-43f0a438c9e4.webp`; `serveware/chafing-dishes-b6c9ff6f742e-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/chafing-dishes-43f0a438c9e4.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/chafing-dishes-b6c9ff6f742e-thumb.webp).
- image_alt: “A stainless steel chafing dish filled with food”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Plates and glasses** — `serveware:plates-and-glasses`

- Source: [Pexels / Mister Mister](https://www.pexels.com/photo/plates-with-dishes-and-drinking-glasses-on-a-table-5829931/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Reviewed original and 900px local variant. The named product type is identifiable; preserve full framing. Stock photograph represents the type, not verified business inventory.
- Original: 4000×6000, **2,463,825 B**. Main: 933×1400, **92,242 B**. Thumbnail: 256×384, **12,848 B**.
- Storage objects: `serveware/plates-and-glasses-3a3ab601d84c.webp`; `serveware/plates-and-glasses-0a120bb62e6d-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/plates-and-glasses-3a3ab601d84c.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/plates-and-glasses-0a120bb62e6d-thumb.webp).
- image_alt: “Dinner plates and drinking glasses arranged on a dining table”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

**Katori** — `serveware:katori`

- Source: [Pexels / Anna Pou](https://www.pexels.com/photo/person-holding-stainless-steel-bowl-with-brown-beans-9345658/); [Pexels License](https://www.pexels.com/license/). Match: `representative`.
- Visual review: Three metal katori bowls clearly visible close-up; genuine Indian serving context. Some filled bowls in foreground have intentional depth of field; bowl shape legible. Representative filled serving vessels, not exact inventory.
- Original: 4000×6000, **4,685,821 B**. Main: 1393×1400, **208,336 B**. Thumbnail: 382×384, **24,152 B**.
- Storage objects: `serveware/katori-2f2effb2db82.webp`; `serveware/katori-5a1928ccb5c0-thumb.webp`.
- Database image_url: [main WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/katori-2f2effb2db82.webp); thumbnail_url: [thumbnail WebP](https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/serveware/katori-5a1928ccb5c0-thumb.webp).
- image_alt: “Small stainless steel katori bowls serving an Indian meal on a round tray”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.

## Storage, database and frontend implementation

The existing project xuiohhowgpfesakxikvo was inspected. Only the unrelated public EventsBySomia bucket existed initially. The uploader created rental-product-images once as PUBLIC, with image/webp allowed and a 2MiB per-object limit, and reused it on the next run. It did not alter the other bucket or create public upload policies. Files use content-hash-versioned descriptive paths and one-year cache control. Supabase Storage serves the actual bytes through its public delivery infrastructure.

All **80 uploaded objects** were downloaded publicly and hash-verified. See [storage-verification.json](phase5.1.1-evidence/storage-verification.json), including MIME, bytes, paths, URLs, cache-control and SHA-256. There are zero duplicate original-photograph hashes, optimized image hashes or product image assignments.

The uploader uses an authenticated Supabase CLI to obtain a server key into process memory, or an explicit SUPABASE_SERVICE_ROLE_KEY environment variable. It never writes keys to disk, logs values, or exposes them in VITE_ variables. Frontend code uses only the existing public client and RLS-protected SELECT access.

Migration 20261112000002_product_storage_images.sql updates only image_url, thumbnail_url, image_alt and image_match_type on existing product rows. It checks the expected 42-record catalogue and each approved ID/name/category, rejects duplicate assignments, and skips unchanged updates. Product IDs, names, slugs, categories, descriptions, active flags, sort order and created_at were compared to the before snapshot and preserved. updated_at naturally changes through the existing trigger. No table was recreated and no application schema change was made.

Direct supabase db push --dry-run could not connect because this network lacks the project database IPv6 route. Controlled image SQL was applied through supabase db query using the authenticated management API; migration history receipts were inserted in the same transactions. The fallback is reproducible via scripts/apply-product-image-update.mjs; no database password is embedded.

CatalogueProvider fetches categories and products once per page using a shared Promise, including StrictMode remounts. Category cards use database product records and URLs. ProductImage resolves the same stable product ID in cards, cart, review and confirmation; persisted legacy cart image paths cannot override the current record. Small views select thumbnail_url with image_url fallback. Image failures show explicit unavailable text, and catalogue network failures offer retry. Existing IDs and the somia-rental-cart-v1 storage contract remain unchanged. There are no image-path literals from the historical manifest in the primary product rendering flow.

## Responsive and functional verification

Local Chromium rendered **72 category/viewport cases**: all six categories at 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440 and 1920px. At every width each card was scrolled into view, its actual image decoded and its rendered box inspected. 480 approved-image render/decode checks passed. All 40 approved photographs loaded in every width; the 2 documented missing photos retained explicit unavailable states.

Mobile/tablet profiles use touch/mobile emulation and DPR 2; desktop uses DPR 1. These are **browser-emulated layouts, not physical-device tests**. No horizontal page/card overflow, stretched images, blank failure containers, broken category heroes or runtime exceptions were observed. Existing 230px image boxes preserve alignment; object-fit is contain throughout. Lazy loading was observed before scrolling and every card was decoded after scrolling. Maximum measured local whole-page CLS was **0.0060**, including editorial heroes and fonts. Each page made exactly one products GET and one categories GET; CORS OPTIONS requests are not counted as database reads.

All 18 required category screenshots are in [phase5.1.1-evidence/local/](phase5.1.1-evidence/local/): <category>-390.webp, <category>-820.webp and <category>-1440.webp. Full measured results are [local/responsive-results.json](phase5.1.1-evidence/local/responsive-results.json).

Production rendered verification: **72 cases** across the same six categories; widths 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440, 1920px. All assigned images decoded from Supabase Storage URLs. Maximum final production whole-page CLS: **0.0000**. Measured results, element-level shift attribution and production screenshots are in [production/](phase5.1.1-evidence/production/).

Unrelated production imagery: all 22 homepage images and all 49 gallery images decoded successfully at both 390px and 1440px, with no browser runtime errors. See [production/editorial-results.json](phase5.1.1-evidence/production/editorial-results.json).

Functional regression: **PASS**. All 42 items were inspected in cart, request review and confirmation; each surface decoded 40 current database thumbnails and showed 2 unavailable states. Legacy localStorage image paths, quantity +/- controls, required-field validation, request payload shape, confirmation session storage/cart clearing, CDN failure fallback and catalogue error/retry passed. The final run uses a page-level fetch mock plus a blocked live endpoint and asserts **0 submission network requests**. See [functional-regression.json](phase5.1.1-evidence/functional-regression.json).

The same protected regression also passed directly against **production**: all 42 IDs on each of the three surfaces, 40 decoded thumbnails per surface and **0 submission network requests**. Production screenshots and [functional-regression.json](phase5.1.1-evidence/production/functional-regression.json) are retained under production/.

Delayed-response regression: **12 cases passed** across all six categories at 390px and 1440px. The products GET was paused, loading grid dimensions and related-section positions measured, then the response released. Loading and loaded geometry matched exactly, removing the observed catalogue-insertion shift.

The public submit_rental_request(jsonb,jsonb) RPC definition was compared before/after and is byte-for-byte unchanged; evidence and its SHA-256 are in [request-rpc-preservation.json](phase5.1.1-evidence/request-rpc-preservation.json). Authentication, the Edge Function and request-processing logic were not changed by this work.

QA incident and correction: an early driver-side mock failure allowed one live QA submission (reserved image-qa@example.test address, request EBS-4CD569781E). A reviewed transaction checked the exact customer/request IDs, creation timestamp, name, event fields and complete three-item payload, refused to proceed if any other request referenced the test customer, and removed only that test request and its otherwise-unused test customer. Verification returned zero remaining fixture rows. No genuine customer/request record was changed. The mock was moved inside the page before Supabase client initialization, with the live endpoint additionally blocked; the final rerun asserts zero submission network requests. See [qa-fixture-cleanup.json](phase5.1.1-evidence/qa-fixture-cleanup.json).

Checks run:

- npm run audit:images — PASS for editorial registry, gallery and placements.
- npm run audit:rental-images — asset integrity PASS for 80 current optimized objects and 80 retained legacy variants; explicitly reports 40/42 coverage.
- npm run db:verify:phase5.1 — PASS for six categories, 42 products and all other Phase 5.1 content.
- npm run db:verify:product-images -- --allow-unmapped — PASS for all approved CDN bytes, URLs, image metadata and preserved fields, explicitly reports 2 blockers.
- npm run db:verify:product-images without the audit-only flag returns nonzero while 2 photographs remain missing. This is intentional; the full acceptance gate does not pass.
- npm run build — PASS. Existing bundle-size advisory remains; main bundle is approximately 682.70kB minified.
- git diff --check — PASS.
- No pre-existing npm test suite is configured. The new rendered QA scripts provide the requested relevant regression checks.

## Reproducing or completing the work

1. Review scripts/product-storage-sources.json; change only deliberately approved source records. Keep the exact 42 product IDs. A false approval must never be used to suppress a blocker.
2. Run npm run images:prepare-storage. It verifies cached optimized bytes, downloads new originals, preserves aspect ratio, applies only reviewed crops, and retains prior files. Originals are temporary, not database data.
3. Run npm run images:upload-storage with the already authenticated Supabase CLI or a local/server-only key. All objects must verify before a migration is generated. Run node scripts/generate-product-credits.mjs.
4. For a later image change, pass --only=<product-id> and --migration-version=<new 14-digit timestamp> to the uploader; pass the same migration version to the apply helper. Scoped uploads require the existing bucket, upload only the selected products, verify all other objects read-only, and generate only the selected image updates. Changed image sets cannot overwrite an existing image migration. Preserve image-only identity checks and CDN-before-database ordering; do not replay historical seeds against later admin-edited catalogue data.
5. Verify database images, both existing audits and the build. Start local preview at port 4173 and isolated Chrome CDP at port 9333, then run npm run qa:product-images and npm run qa:rental-regression. QA_BASE_URL can target production for read-only category checks.

6. For this closure, run node scripts/verify-product-image-closure.mjs --allow-unmapped to verify preservation against the captured baseline. Omitting the flag additionally enforces the 42/42 coverage gate. The flag acknowledges blockers; it does not mark missing photographs as passing.

## Remaining blockers and acceptance

- **Chowki** (`seating:chowki`): Accurate isolated retailer/CEPT furniture photographs lack a commercial reuse grant. Newly reviewed commercially licensed scenes do not provide a distinct, sharp, complete high-resolution seating chowki photograph. The approved low-table photograph is not reused or relabelled as seating.
- **Brocade runners** (`linens:brocade-runners`): No researched photograph simultaneously establishes an actual brocade table runner, suitable clear product framing/resolution, and affirmative commercial reuse rights. Public-domain actual runner photos lack documented brocade construction and/or usable photography; documented contemporary brocade runner photos do not grant commercial reuse. No image inferred from appearance or unrelated textile assigned.

The accurate chowki retailer photograph found at https://www.flickr.com/photos/indian-wedding-crafts/19313052978/ has embedded license 0 (All Rights Reserved); it was rejected. Brocade research covered Pexels/Unsplash and museum/open collections; reusable covers, samples or undocumented textiles were rejected rather than relabelled as runners. Detailed research and rejection notes are in [source-research.json](phase5.1.1-evidence/source-research.json).

**Required to reach 42/42:** owner-provided photographs with permission, written reproduction permission from a suitable photographer/vendor, or newly verified licensed photographs for the 2 remaining products. These have not been fabricated. Final approved coverage is **40/42 (95.2%)**, with **80 verified Storage objects**. Phase 5.2 remains out of scope and should not be treated as cleared by this partial result.
