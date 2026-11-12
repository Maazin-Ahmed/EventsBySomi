// Read-only remote closure verification; never mutates products or request data.
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const root = path.resolve(import.meta.dirname, '..')
const evidence = path.join(root, 'docs/phase5.1.1-evidence/final-closure')
const baseline = JSON.parse(await fs.readFile(path.join(evidence, 'baseline.json'), 'utf8'))
const sql = `SELECT jsonb_build_object(
 'products',(SELECT jsonb_agg(p ORDER BY id) FROM public.products p),
 'objects',(SELECT jsonb_agg(o ORDER BY name) FROM (SELECT name,metadata FROM storage.objects WHERE bucket_id='rental-product-images') o),
 'counts',jsonb_build_object('customer_count',(SELECT count(*) FROM public.customers),'request_count',(SELECT count(*) FROM public.rental_requests),'reserved_qa_customer_count',(SELECT count(*) FROM public.customers WHERE email='image-qa@example.test'))
) AS snapshot;`
let output
try { output = execFileSync('npx', ['--yes', 'supabase', 'db', 'query', '--remote=xuiohhowgpfesakxikvo', '--read-only', sql, '--output', 'json'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }
catch { throw new Error('Read-only closure snapshot failed; credential output suppressed.') }
const current = JSON.parse(output).rows[0].snapshot
assert.equal(current.products.length, 42)
const byId = new Map(current.products.map(product => [product.id, product]))
assert.equal(byId.size, 42, 'Product IDs must remain unique.')
const assigned = current.products.filter(product => product.image_url)
assert.equal(new Set(assigned.map(product => product.image_url)).size, assigned.length, 'Duplicate primary image assignment.')
for (const id of ['seating:chowki', 'linens:brocade-runners']) {
  for (const field of ['image_url', 'thumbnail_url', 'image_alt', 'image_match_type']) assert.equal(byId.get(id)[field], null, 'Unapproved product image must remain null: ' + id + '/' + field)
}
const targets = new Set(['seating:chowki', 'tables:low-chowki-tables', 'linens:brocade-runners'])
for (const before of baseline.products) {
  const after = byId.get(before.id)
  assert.ok(after, 'Missing original product ID: ' + before.id)
  for (const field of Object.keys(before)) {
    if (targets.has(before.id) && ['image_url', 'thumbnail_url', 'image_alt', 'image_match_type', 'updated_at'].includes(field)) continue
    assert.deepEqual(after[field], before[field], 'Unexpected product change: ' + before.id + '/' + field)
  }
}
const objectByName = new Map(current.objects.map(object => [object.name, object]))
for (const before of baseline.objects) assert.deepEqual(objectByName.get(before.name), before, 'Existing Storage object changed: ' + before.name)
const digest = value => createHash('sha256').update(value).digest('hex')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'scripts/product-storage-manifest.json'), 'utf8'))
for (const before of baseline.approvedImages) {
  assert.deepEqual(manifest.find(product => product.id === before.id), before, 'Existing approved asset metadata changed: ' + before.id)
  for (const type of ['image', 'thumbnail']) assert.equal(digest(await fs.readFile(path.join(root, 'public/images/rental-product-images', before[type].objectPath))), before[type].sha256)
}
for (const [file, hash] of Object.entries(baseline.frontendHashes)) assert.equal(digest(await fs.readFile(path.join(root, file))), hash, 'Unrelated frontend file changed: ' + file)
assert.deepEqual(current.counts, baseline.counts, 'Live customer/request counts changed; investigate without deleting records.')
assert.equal(current.counts.reserved_qa_customer_count, 0, 'Reserved QA customer must never be created.')
const regression = JSON.parse(await fs.readFile(path.join(root, 'docs/phase5.1.1-evidence/functional-regression.json'), 'utf8'))
const productionRegression = JSON.parse(await fs.readFile(path.join(root, 'docs/phase5.1.1-evidence/production/functional-regression.json'), 'utf8'))
for (const run of [regression, productionRegression]) {
 assert.ok(Date.parse(run.testedAt) >= Date.parse(baseline.capturedAt), 'Closure requires fresh protected regression runs, not historical evidence.')
 assert.equal(run.submitNetworkRequests, 0)
 assert.deepEqual(run.surfaces.map(surface => surface.route).sort(), ['/cart', '/request-confirmation', '/request-quote'])
 for (const surface of run.surfaces) {
  assert.equal(new Set(surface.rows.map(row => row.id)).size, 42, 'Request surface must retain all 42 IDs: ' + surface.route)
  for (const row of surface.rows) {
    const product = byId.get(row.id)
    assert.ok(product, 'Unknown request-surface product ID: ' + row.id)
    const expected = product.thumbnail_url || product.image_url
    assert.equal(row.src, expected, 'Request surface image differs from its current database record: ' + surface.route + '/' + row.id)
    assert.ok(expected ? row.decoded : row.placeholder, 'Invalid request image state: ' + row.id)
  }
 }
}
const responsive = JSON.parse(await fs.readFile(path.join(root, 'docs/phase5.1.1-evidence/production/responsive-results.json'), 'utf8'))
assert.ok(Date.parse(responsive.testedAt) >= Date.parse(baseline.capturedAt), 'Production checks must be fresh for this closure.')
assert.equal(responsive.results.length, 72, 'Expected all six categories at all 12 production widths.')
for (const category of responsive.results) for (const image of category.products) {
  const product = byId.get(image.id)
  assert.ok(product, 'Unknown production card ID: ' + image.id)
  assert.equal(image.src, product.image_url, 'Production card differs from current database image: ' + image.id)
  assert.ok(product.image_url ? image.decoded : image.placeholder, 'Invalid production image state: ' + image.id)
}
const missing = current.products.filter(product => !product.image_url).map(product => product.id)
const result = {
  verifiedAt: new Date().toISOString(), products: 42,
  preservedOriginalIds: true, preservedApprovedAssignments: baseline.approvedImages.length,
  originalObjectsUnchanged: baseline.objects.length, currentObjectCount: current.objects.length,
  frontendUnchanged: true, nonImageProductDataUnchanged: true,
  requestCountsBefore: baseline.counts, requestCountsAfter: current.counts,
  qaSubmitNetworkRequests: regression.submitNetworkRequests,
  productionQaSubmitNetworkRequests: productionRegression.submitNetworkRequests,
  requestSurfaceImageConsistency: true, productionImageConsistency: true,
  coverage: `${42 - missing.length}/42`, coveragePercent: Number(((42 - missing.length) / 42 * 100).toFixed(1)), missing,
  imageUpdates: baseline.products.filter(before => targets.has(before.id)).map(before => ({
    id: before.id, before: Object.fromEntries(['image_url','thumbnail_url','image_alt','image_match_type'].map(field => [field,before[field]])),
    after: Object.fromEntries(['image_url','thumbnail_url','image_alt','image_match_type'].map(field => [field,byId.get(before.id)[field]])),
  })),
}
await fs.writeFile(path.join(evidence, 'preservation-verification.json'), JSON.stringify(result, null, 2) + '\n')
console.log(`Preservation PASS: all 42 IDs, ${baseline.approvedImages.length} approved assignments, ${baseline.objects.length} original objects, frontend source, and live request/customer counts unchanged. Coverage ${result.coverage}; ${missing.length} blockers.`)
if (missing.length && !process.argv.includes('--allow-unmapped')) process.exitCode = 1
