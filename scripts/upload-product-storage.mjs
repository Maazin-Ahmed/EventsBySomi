// Local/server-only uploader. No privileged values are written to disk or logged.
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

const project = 'xuiohhowgpfesakxikvo'
const base = `https://${project}.supabase.co`
const bucket = 'rental-product-images'
const root = path.resolve(import.meta.dirname, '..')
const version = process.argv.find(argument => argument.startsWith('--migration-version='))?.split('=')[1] || '20261112000002'
if (!/^\d{14}$/.test(version) || version < '20261112000002') throw new Error('Invalid image migration version.')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'scripts/product-storage-manifest.json'), 'utf8'))
let secret = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!secret) {
  // The already-authenticated CLI returns keys into this process's memory only.
  let output
  try {
    output = execFileSync('npx', ['--yes', 'supabase', 'projects', 'api-keys', `--remote=${project}`, '--reveal', '--output', 'json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch { throw new Error('Authenticated CLI key lookup failed; no credential output is logged.') }
  const data = JSON.parse(output.slice(output.indexOf('[') >= 0 && output.indexOf('[') < output.indexOf('{') ? output.indexOf('[') : output.indexOf('{')))
  const keys = Array.isArray(data) ? data : data.keys || data.api_keys || []
  secret = keys.find(key => key.name === 'service_role')?.api_key || keys.find(key => key.type === 'secret')?.api_key
}
if (!secret) throw new Error('A server-side Supabase key or authenticated CLI with API-key access is required.')
const admin = createClient(base, secret, { auth: { persistSession: false, autoRefreshToken: false } })
const { data: buckets, error: bucketError } = await admin.storage.listBuckets()
if (bucketError) throw new Error('Could not inspect Storage buckets: ' + bucketError.message)
const existing = buckets.find(item => item.id === bucket)
if (existing && !existing.public) throw new Error('Existing rental bucket is private; inspect before changing access.')
if (!existing) {
  const { error } = await admin.storage.createBucket(bucket, { public: true, allowedMimeTypes: ['image/webp'], fileSizeLimit: 2 * 1024 * 1024 })
  if (error) throw new Error('Could not create rental bucket: ' + error.message)
  console.log('Created public rental-product-images bucket.')
} else console.log('Reusing existing public rental-product-images bucket.')

const verified = []
// Upload immutable, content-versioned paths. Idempotent reruns retain existing
// objects and verify their bytes before applying any database update.
for (const product of manifest) {
  for (const type of ['image', 'thumbnail']) {
    const asset = product[type]
    const bytes = await fs.readFile(path.join(root, 'public/images/rental-product-images', asset.objectPath))
    const { error } = await admin.storage.from(bucket).upload(asset.objectPath, bytes, { contentType: 'image/webp', cacheControl: '31536000', upsert: false })
    if (error && !['409', '400'].includes(String(error.statusCode))) throw new Error(`Upload ${asset.objectPath}: ${error.message}`)
    const url = `${base}/storage/v1/object/public/${bucket}/${asset.objectPath}`
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) })
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/webp')) throw new Error('Object verification failed: ' + asset.objectPath)
    const downloaded = Buffer.from(await response.arrayBuffer())
    if (createHash('sha256').update(downloaded).digest('hex') !== asset.sha256) throw new Error('Object hash mismatch: ' + asset.objectPath)
    verified.push({ id: product.id, type, objectPath: asset.objectPath, url, status: response.status, bytes: downloaded.length, contentType: response.headers.get('content-type'), cacheControl: response.headers.get('cache-control'), sha256: asset.sha256 })
  }
  console.log('Verified image and thumbnail: ' + product.id)
}
await fs.mkdir(path.join(root, 'docs/phase5.1.1-evidence'), { recursive: true })
await fs.writeFile(path.join(root, 'docs/phase5.1.1-evidence/storage-verification.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), bucket, objects: verified }, null, 2) + '\n')

const quote = value => "'" + value.replaceAll("'", "''") + "'"
const values = manifest.map(product => `  (${[product.id, product.name, product.id.split(':')[0], `${base}/storage/v1/object/public/${bucket}/${product.image.objectPath}`, `${base}/storage/v1/object/public/${bucket}/${product.thumbnail.objectPath}`, product.alt, product.matchType].map(quote).join(', ')})`).join(',\n')
const sql = `-- Phase 5.1.1: only product image metadata; generated after CDN hash verification.\n-- Run the uploader first. Product identity, descriptions and workflow tables are untouched.\nBEGIN;\nCREATE TEMP TABLE approved_product_images (id text PRIMARY KEY, name text, category_id text, image_url text, thumbnail_url text, image_alt text, image_match_type text) ON COMMIT DROP;\nINSERT INTO approved_product_images VALUES\n${values};\nDO $$\nBEGIN\n  IF (SELECT count(*) FROM public.products) <> 42 THEN RAISE EXCEPTION 'Expected 42 existing products; review catalogue drift'; END IF;\n  IF EXISTS (SELECT 1 FROM approved_product_images a LEFT JOIN public.products p ON p.id=a.id AND p.name=a.name AND p.category_id=a.category_id WHERE p.id IS NULL) THEN RAISE EXCEPTION 'Approved product identity mismatch'; END IF;\n  IF EXISTS (SELECT image_url FROM approved_product_images GROUP BY image_url HAVING count(*)>1) THEN RAISE EXCEPTION 'Duplicate product image'; END IF;\nEND $$;\nUPDATE public.products p SET image_url=a.image_url, thumbnail_url=a.thumbnail_url, image_alt=a.image_alt, image_match_type=a.image_match_type FROM approved_product_images a WHERE p.id=a.id AND (p.image_url,p.thumbnail_url,p.image_alt,p.image_match_type) IS DISTINCT FROM (a.image_url,a.thumbnail_url,a.image_alt,a.image_match_type);\nCOMMIT;\n`
const migrationPath = path.join(root, `supabase/migrations/${version}_product_storage_images.sql`)
let previousSql
try { previousSql = await fs.readFile(migrationPath, 'utf8') } catch {}
if (previousSql && previousSql !== sql) throw new Error('Refusing to overwrite an existing image migration. Pass --migration-version=<new 14-digit timestamp> for a changed image set.')
await fs.writeFile(migrationPath, sql)
console.log(`Verified ${verified.length} objects. Generated image-only migration; database changes have NOT been applied.`)
