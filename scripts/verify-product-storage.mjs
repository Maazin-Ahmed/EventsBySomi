import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

const root = path.resolve(import.meta.dirname, '..')
const directory = path.join(root, 'docs/phase5.1.1-evidence')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'scripts/product-storage-manifest.json'), 'utf8'))
const before = JSON.parse(await fs.readFile(path.join(directory, 'products-before.json'), 'utf8'))
const base = process.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const key = process.env.VITE_SUPABASE_ANON_KEY
assert.ok(base && key, 'Public Supabase configuration is required')
async function read(table) {
  const response = await fetch(`${base}/rest/v1/${table}?select=*&order=sort_order`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  assert.equal(response.status, 200, table + ' anonymous read')
  return response.json()
}
const [products, categories] = await Promise.all([read('products'), read('categories')])
assert.equal(products.length, 42)
assert.equal(categories.length, 6)
const approved = new Map(manifest.map(item => [item.id, item]))
const original = new Map(before.map(item => [item.id, item]))
const imageUrls = new Set()
const checks = []
for (const product of products) {
  const old = original.get(product.id)
  assert.ok(old, 'Unexpected product ' + product.id)
  for (const field of ['id', 'name', 'slug', 'category_id', 'description', 'is_active', 'sort_order', 'created_at']) assert.deepEqual(product[field], old[field], product.id + ': preserved ' + field)
  const source = approved.get(product.id)
  if (!source) { checks.push({ id: product.id, status: 'BLOCKED', image_url: product.image_url }); continue }
  assert.equal(product.image_alt, source.alt)
  assert.equal(product.image_match_type, source.matchType)
  assert.ok(!imageUrls.has(product.image_url), 'Duplicate assignment ' + product.id)
  imageUrls.add(product.image_url)
  for (const [field, variant] of [['image_url', 'image'], ['thumbnail_url', 'thumbnail']]) {
    const asset = source[variant]
    const expected = `${base}/storage/v1/object/public/rental-product-images/${asset.objectPath}`
    assert.equal(product[field], expected)
    const response = await fetch(expected, { signal: AbortSignal.timeout(45000) })
    assert.equal(response.status, 200, expected)
    assert.match(response.headers.get('content-type'), /^image\/webp/)
    const bytes = Buffer.from(await response.arrayBuffer())
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256)
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
  }
  checks.push({ id: product.id, status: 'PASS', image_url: product.image_url, thumbnail_url: product.thumbnail_url, image_alt: product.image_alt, image_match_type: product.image_match_type })
}
const missing = checks.filter(item => item.status === 'BLOCKED')
await fs.writeFile(path.join(directory, 'database-verification.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), products: products.length, categories: categories.length, approved: approved.size, coveragePercent: Number((approved.size / 42 * 100).toFixed(1)), duplicateAssignments: 0, preservedFields: true, missing: missing.map(item => item.id), checks }, null, 2) + '\n')
await fs.writeFile(path.join(directory, 'products-after.json'), JSON.stringify(products, null, 2) + '\n')
console.log(`Database: ${products.length} preserved products, ${categories.length} categories. ${approved.size}/42 images (${(approved.size/42*100).toFixed(1)}%). ${approved.size*2} public WebP URLs returned 200 with matching content hashes. No duplicate assignments.`)
if (missing.length) {
  console.log('UNRESOLVED: ' + missing.map(item => item.id).join(', '))
  if (!process.argv.includes('--allow-unmapped')) process.exitCode = 1
}
