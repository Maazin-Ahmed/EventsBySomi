import fs from 'node:fs/promises'
import { rentalGroups } from '../src/content.js'

const read = async file => JSON.parse(await fs.readFile(new URL('../' + file, import.meta.url), 'utf8'))
const manifest = await read('scripts/product-storage-manifest.json')
const sources = await read('scripts/product-storage-sources.json')
const initial = await read('docs/phase5.1.1-evidence/initial-image-audit.json')
const before = await read('docs/phase5.1.1-evidence/products-before.json')
const storage = await read('docs/phase5.1.1-evidence/storage-verification.json')
const database = await read('docs/phase5.1.1-evidence/database-verification.json')
const local = await read('docs/phase5.1.1-evidence/local/responsive-results.json')
let production, functional, editorial
try { production = await read('docs/phase5.1.1-evidence/production/responsive-results.json') } catch {}
try { functional = await read('docs/phase5.1.1-evidence/functional-regression.json') } catch {}
try { editorial = await read('docs/phase5.1.1-evidence/production/editorial-results.json') } catch {}
const base = 'https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/'
const originalBytes = manifest.reduce((sum, item) => sum + item.originalBytes, 0)
const mainBytes = manifest.reduce((sum, item) => sum + item.image.bytes, 0)
const thumbnailBytes = manifest.reduce((sum, item) => sum + item.thumbnail.bytes, 0)
const maxCLS = Math.max(...local.results.map(result => result.layout.cls))
const missing = sources.filter(source => !source.approved)
const oldPhotoResponseFailures = initial.results.filter(result => result.url && !result.validImage).length
const lines = [
 '# Phase 5.1.1 — Product image Storage audit', '',
 `**Status: implemented with ${missing.length} unresolved sourcing blockers; acceptance is NOT complete.**`,
 `**Coverage: ${manifest.length}/42 (${database.coveragePercent}%).** All 42 records and all six rendered categories were audited. Only ${manifest.length} products have approved photography; missing photographs are never counted as passing images.`, '',
 'The implementation is live through the existing GitHub/Vercel project. No Phase 5.2, admin application, authentication change, new customer/request workflow, brand redesign, S3 or CloudFront was introduced.', '',
 '## Coverage and initial findings', '',
 '| Category | Products | Before | Approved now | Unresolved |',
 '| --- | ---: | ---: | ---: | --- |',
 ...rentalGroups.map(group => `| ${group.title} | ${group.items.length} | ${before.filter(product => product.category_id === group.slug && product.image_url).length} | ${manifest.filter(product => product.category === group.slug).length} | ${missing.filter(product => product.category === group.slug).map(product => product.name).join('; ') || 'None'} |`), '',
 `Before this work, 16 database records pointed to local WebP paths and 26 had null image metadata. All 16 assigned paths returned HTTP 200 from production at the initial check, but ${oldPhotoResponseFailures} responses were HTML rather than images: the SPA fallback hid missing asset failures. See [initial-image-audit.json](phase5.1.1-evidence/initial-image-audit.json). A successful HTTP status alone did not establish image availability.`, '',
 'The retained local variants were visually reviewed. The Chiavari portrait was especially susceptible to soft rendering because the old srcset sizes string requested only 130 CSS pixels and could select a small portrait variant. Primary cards now request the approved larger database image. The prior sofa studio image was replaced with a verified real photograph of an event loveseat; photographic provenance of the previous image was insufficient. The folding chairs clearly depict folding metal chairs and were retained. All other retained images received larger locally optimized variants and verified photographer attribution.', '',
 'Rendered screenshot review also identified an intrinsic CSS grid sizing bug: portrait image elements could grow beyond the reserved 230px parent even with object-fit: contain, causing the parent to clip chairs, swings and other tall objects. An explicit minmax(0,1fr) grid track and zero minimum image size now constrain each element to its frame. The browser audit asserts actual rendered image height and width, so a contain declaration alone cannot pass this check.', '',
 'Element-level layout-shift tracing also identified the related-collections section moving when the asynchronous catalogue response inserted its grid. Invisible, non-interactive loading shells now reserve the existing grid geometry using the preserved legacy category identities. Once loaded, visible cards and image URLs come from database records. The loading message is out of normal flow. No finished layout or branding changed, and the QA gate now rejects whole-page CLS above 0.1.', '',
 'The Phase 4.5 audit and Phase 5.1 architecture were read. The old product image manifest, all 80 old local variants, category listing, shared cart, request review, and confirmation were inspected. No separate rental product detail route exists in this application. Editorial category heroes remain separate from product photography.', '',
 '## Initial audit of all 42 records', '',
 'Dimensions below describe the local main WebP referenced before the change; production responses were HTML and had no decodable image dimensions. Existing image URLs were unique across the 16 assigned products.', '',
 '| Product ID | Name / category | Previous image URL | Local dimensions | Initial loading / quality / replacement decision |',
 '| --- | --- | --- | --- | --- |',
 ...before.map(product => {
   const old = initial.results.find(result => result.id === product.id)
   const source = sources.find(source => source.id === product.id)
   const quality = !old.url ? 'No photograph; source required.' : product.id === 'seating:chiavari-chairs' ? 'Undersized responsive selection could appear blurry; larger variant required.' : product.id === 'seating:sofas-and-loveseats' ? 'Replace prior studio composition with verified event photograph.' : 'Product type identifiable locally; publish larger optimized copy to Storage.'
   return `| ${product.id} | ${product.name} / ${product.category_id} | ${old.url ? '`' + old.url + '`' : 'NULL'} | ${old.width ? old.width + '×' + old.height : '—'} | ${old.url ? old.status + ' / ' + old.contentType + '; not a decodable product image. ' : ''}${quality} ${source.approved ? 'Approved final assignment below.' : 'Still blocked.'} |`
 }), '',
 '## Final assignments, source attribution and optimization', '',
 'All approved photographs are classified **representative**. They genuinely depict the named product type, but neither the actual Events by Somia inventory design nor exact dimensions/materials can be established from stock photography. An exact type match is not presented as an exact inventory photograph. For multi-item product names, the image represents a visibly depicted member of that product group; e.g. the event marquee does not claim to be a traditional shamiyana, and the table photograph does not establish a 6ft/8ft measurement.', '',
 'The silk runner is an explicitly disclosed historic Japanese silk/metallic-thread runner from Cleveland Museum of Art accession 1939.145. Its museum record verifies the material; age-related fading is visible. It is not presented as a photograph of modern rental inventory. The bolster uses a reviewed native 1000×750 crop of a real traditional cylindrical cushion; it is not upscaled. It has moderate source detail rather than studio-level textile detail.', '',
 `Downloaded originals total **${originalBytes.toLocaleString('en-US')} bytes**. Main WebP files total **${mainBytes.toLocaleString('en-US')} bytes** (${(100 * (1 - mainBytes / originalBytes)).toFixed(1)}% smaller); thumbnails total **${thumbnailBytes.toLocaleString('en-US')} bytes**. Combined optimized storage is **${(mainBytes + thumbnailBytes).toLocaleString('en-US')} bytes**. Sizes are measured download/file lengths, not estimated original sizes.`, '',
 'Main variants preserve aspect ratio at a maximum edge of 1400px, thumbnails at 384px, with no upscaling. Crops are individually reviewed normalized coordinates in the source manifest. Cards and request rows use object-fit: contain and existing reserved boxes. Unused originals remain outside the repository; previously existing assets were retained.', '',
 'Public attribution, original links, license links and adaptation notices are provided at [/rental-photo-credits.html](https://www.eventsbysomia.com/rental-photo-credits.html), linked in the footer. The cropped bolster derivative remains CC BY-SA 4.0. The gaddi source is CC BY 2.0. Other licenses are recorded per item below. No generated images or commercial images without reuse rights were used.', '',
]
for (const group of rentalGroups) {
 lines.push('### ' + group.title, '')
 for (const name of group.items) {
  const source = sources.find(source => source.category === group.slug && source.name === name)
  const product = manifest.find(product => product.id === source.id)
  lines.push(`**${name}** — \`${source.id}\``, '')
  if (!product) { lines.push(`**BLOCKED:** ${source.blocker} Database image_url, thumbnail_url, image_alt and image_match_type remain NULL. The UI displays “Photo unavailable”.`, ''); continue }
  lines.push(
   `- Source: [${product.provider} / ${product.photographer}](${product.sourcePage}); [${product.license}](${product.licenseUrl}). Match: \`${product.matchType}\`.`,
   `- Visual review: ${product.visualReview}`,
   `- Original: ${product.originalWidth}×${product.originalHeight}, **${product.originalBytes.toLocaleString('en-US')} B**. Main: ${product.image.width}×${product.image.height}, **${product.image.bytes.toLocaleString('en-US')} B**. Thumbnail: ${product.thumbnail.width}×${product.thumbnail.height}, **${product.thumbnail.bytes.toLocaleString('en-US')} B**.`,
   `- Storage objects: \`${product.image.objectPath}\`; \`${product.thumbnail.objectPath}\`.`,
   `- Database image_url: [main WebP](${base + product.image.objectPath}); thumbnail_url: [thumbnail WebP](${base + product.thumbnail.objectPath}).`,
   `- image_alt: “${product.alt}”. Upload/public GET verification: both **200**, image/webp, matching SHA-256.`, ''
  )
 }
}
lines.push(
 '## Storage, database and frontend implementation', '',
 'The existing project xuiohhowgpfesakxikvo was inspected. Only the unrelated public EventsBySomia bucket existed initially. The uploader created rental-product-images once as PUBLIC, with image/webp allowed and a 2MiB per-object limit, and reused it on the next run. It did not alter the other bucket or create public upload policies. Files use content-hash-versioned descriptive paths and one-year cache control. Supabase Storage serves the actual bytes through its public delivery infrastructure.', '',
 `All **${storage.objects.length} uploaded objects** were downloaded publicly and hash-verified. See [storage-verification.json](phase5.1.1-evidence/storage-verification.json), including MIME, bytes, paths, URLs, cache-control and SHA-256. There are zero duplicate original-photograph hashes, optimized image hashes or product image assignments.`, '',
 'The uploader uses an authenticated Supabase CLI to obtain a server key into process memory, or an explicit SUPABASE_SERVICE_ROLE_KEY environment variable. It never writes keys to disk, logs values, or exposes them in VITE_ variables. Frontend code uses only the existing public client and RLS-protected SELECT access.', '',
 'Migration 20261112000002_product_storage_images.sql updates only image_url, thumbnail_url, image_alt and image_match_type on existing product rows. It checks the expected 42-record catalogue and each approved ID/name/category, rejects duplicate assignments, and skips unchanged updates. Product IDs, names, slugs, categories, descriptions, active flags, sort order and created_at were compared to the before snapshot and preserved. updated_at naturally changes through the existing trigger. No table was recreated and no application schema change was made.', '',
 'Direct supabase db push --dry-run could not connect because this network lacks the project database IPv6 route. The exact controlled SQL was applied through supabase db query using the authenticated management API; the migration history receipt was inserted in the same transaction. Remote migration list confirms all three migration versions are applied. The fallback is reproducible via scripts/apply-product-image-update.mjs; no database password is embedded.', '',
 'CatalogueProvider fetches categories and products once per page using a shared Promise, including StrictMode remounts. Category cards use database product records and URLs. ProductImage resolves the same stable product ID in cards, cart, review and confirmation; persisted legacy cart image paths cannot override the current record. Small views select thumbnail_url with image_url fallback. Image failures show explicit unavailable text, and catalogue network failures offer retry. Existing IDs and the somia-rental-cart-v1 storage contract remain unchanged. There are no image-path literals from the historical manifest in the primary product rendering flow.', '',
 '## Responsive and functional verification', '',
 `Local Chromium rendered **${local.results.length} category/viewport cases**: all six categories at 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440 and 1920px. At every width each card was scrolled into view, its actual image decoded and its rendered box inspected. ${local.results.flatMap(result => result.products).filter(product => product.decoded).length} approved-image render/decode checks passed. All 39 approved photographs loaded in every width; the three documented missing photos retained explicit unavailable states.`, '',
 `Mobile/tablet profiles use touch/mobile emulation and DPR 2; desktop uses DPR 1. These are **browser-emulated layouts, not physical-device tests**. No horizontal page/card overflow, stretched images, blank failure containers, broken category heroes or runtime exceptions were observed. Existing 230px image boxes preserve alignment; object-fit is contain throughout. Lazy loading was observed before scrolling and every card was decoded after scrolling. Maximum measured local whole-page CLS was **${maxCLS.toFixed(4)}**, including editorial heroes and fonts. Each page made exactly one products GET and one categories GET; CORS OPTIONS requests are not counted as database reads.`, '',
 'All 18 required category screenshots are in [phase5.1.1-evidence/local/](phase5.1.1-evidence/local/): <category>-390.webp, <category>-820.webp and <category>-1440.webp. Full measured results are [local/responsive-results.json](phase5.1.1-evidence/local/responsive-results.json).', '',
 production ? `Production rendered verification: **${production.results.length} cases** across the same six categories; widths ${[...new Set(production.results.map(result => result.width))].join(', ')}px. All assigned images decoded from Supabase Storage URLs. Maximum final production whole-page CLS: **${Math.max(...production.results.map(result => result.layout.cls)).toFixed(4)}**. Measured results, element-level shift attribution and production screenshots are in [production/](phase5.1.1-evidence/production/).` : 'Production browser verification: pending; do not count as complete.', '',
 editorial ? 'Unrelated production imagery: all 22 homepage images and all 49 gallery images decoded successfully at both 390px and 1440px, with no browser runtime errors. See [production/editorial-results.json](phase5.1.1-evidence/production/editorial-results.json).' : 'Unrelated editorial browser checks: pending.', '',
 functional ? `Functional regression: **PASS**. All 42 items were inspected in cart, request review and confirmation; each surface decoded ${functional.surfaces[0].rows.filter(row => row.decoded).length} current database thumbnails and showed the same three unavailable states. Legacy localStorage image paths, quantity +/- controls, required-field validation, request payload shape, confirmation session storage/cart clearing, CDN failure fallback and catalogue error/retry passed. The final run uses a page-level fetch mock plus a blocked live endpoint and asserts **${functional.submitNetworkRequests} submission network requests**. See [functional-regression.json](phase5.1.1-evidence/functional-regression.json).` : 'Functional browser regression: pending; do not count as complete.', '',
 functional?.loadingGridReservation ? `Delayed-response regression: **${functional.loadingGridReservation.length} cases passed** across all six categories at 390px and 1440px. The products GET was paused, loading grid dimensions and related-section positions measured, then the response released. Loading and loaded geometry matched exactly, removing the observed catalogue-insertion shift.` : '', '',
 'The public submit_rental_request(jsonb,jsonb) RPC definition was compared before/after and is byte-for-byte unchanged; evidence and its SHA-256 are in [request-rpc-preservation.json](phase5.1.1-evidence/request-rpc-preservation.json). Authentication, the Edge Function and request-processing logic were not changed by this work.', '',
 'QA incident and correction: an early driver-side mock failure allowed one live QA submission (reserved image-qa@example.test address, request EBS-4CD569781E). A reviewed transaction checked the exact customer/request IDs, creation timestamp, name, event fields and complete three-item payload, refused to proceed if any other request referenced the test customer, and removed only that test request and its otherwise-unused test customer. Verification returned zero remaining fixture rows. No genuine customer/request record was changed. The mock was moved inside the page before Supabase client initialization, with the live endpoint additionally blocked; the final rerun asserts zero submission network requests. See [qa-fixture-cleanup.json](phase5.1.1-evidence/qa-fixture-cleanup.json).', '',
 'Checks run:', '',
 '- npm run audit:images — PASS for editorial registry, gallery and placements.',
 '- npm run audit:rental-images — asset integrity PASS for 78 current optimized objects and 80 retained legacy variants; explicitly reports incomplete 39/42 coverage.',
 '- npm run db:verify:phase5.1 — PASS for six categories, 42 products and all other Phase 5.1 content.',
 '- npm run db:verify:product-images -- --allow-unmapped — PASS for all approved CDN bytes, URLs, image metadata and preserved fields, explicitly reports three blockers.',
 '- npm run db:verify:product-images without the audit-only flag returns nonzero while three photographs remain missing. This is intentional; the full acceptance gate does not pass.',
 '- npm run build — PASS. Existing bundle-size advisory remains; main bundle is approximately 682.70kB minified.',
 '- git diff --check — PASS.',
 '- No pre-existing npm test suite is configured. The new rendered QA scripts provide the requested relevant regression checks.', '',
 '## Reproducing or completing the work', '',
 '1. Review scripts/product-storage-sources.json; change only deliberately approved source records. Keep the exact 42 product IDs. A false approval must never be used to suppress a blocker.',
 '2. Run npm run images:prepare-storage. It verifies cached optimized bytes, downloads new originals, preserves aspect ratio, applies only reviewed crops, and retains prior files. Originals are temporary, not database data.',
 '3. Run npm run images:upload-storage with the already authenticated Supabase CLI or a local/server-only key. All objects must verify before a migration is generated. Run node scripts/generate-product-credits.mjs.',
 '4. For a later image change, pass --migration-version=<new 14-digit timestamp> to the uploader and apply helper. Changed image sets cannot overwrite an existing image migration. Preserve image-only identity checks and CDN-before-database ordering. The current generated migration and helper reproduce this phase on a fresh Phase 5.1 baseline; do not replay historical seeds against later admin-edited catalogue data.',
 '5. Verify database images, both existing audits and the build. Start local preview at port 4173 and isolated Chrome CDP at port 9333, then run npm run qa:product-images and npm run qa:rental-regression. QA_BASE_URL can target production for read-only category checks.', '',
 '## Remaining blockers and acceptance', '',
 ...missing.map(source => `- **${source.name}** (\`${source.id}\`): ${source.blocker}`), '',
 'The accurate chowki retailer photograph found at https://www.flickr.com/photos/indian-wedding-crafts/19313052978/ has embedded license 0 (All Rights Reserved); it was rejected. Brocade research covered Pexels/Unsplash and museum/open collections; reusable covers, samples or undocumented textiles were rejected rather than relabelled as runners. Detailed research and rejection notes are in [source-research.json](phase5.1.1-evidence/source-research.json).', '',
 '**Required to reach 42/42:** owner-provided photographs with permission, written reproduction permission from a suitable photographer/vendor, or newly verified licensed photographs for the three specific products. These have not been fabricated. Final approved coverage is **39/42 (92.9%)**, with **78 verified Storage objects**. Phase 5.2 remains out of scope and should not be treated as cleared by this partial result.', ''
)
await fs.writeFile(new URL('../docs/phase5.1.1-product-image-storage-audit.md', import.meta.url), lines.join('\n'))
console.log('Generated complete 42-record audit; coverage remains ' + manifest.length + '/42.')
