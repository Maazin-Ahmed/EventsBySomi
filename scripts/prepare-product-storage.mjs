import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const sources = JSON.parse(await fs.readFile(path.join(root, 'scripts/product-storage-sources.json'), 'utf8'))
const directory = path.join(root, 'public/images/rental-product-images')
const scratch = '/tmp/somia-product-originals'
await fs.mkdir(directory, { recursive: true })
await fs.mkdir(scratch, { recursive: true })
const results = []
let previous = []
try { previous = JSON.parse(await fs.readFile(path.join(root, 'scripts/product-storage-manifest.json'), 'utf8')) } catch {}
for (const source of sources) {
  if (!source.approved) continue
  if (!source.sourcePage || !source.licenseUrl || !source.photographer || !source.visualReview) throw new Error('Incomplete approval: ' + source.id)
  const existing = previous.find(item => item.id === source.id && item.downloadUrl === source.downloadUrl && JSON.stringify(item.crop) === JSON.stringify(source.crop))
  if (existing) {
    let valid = true
    for (const type of ['image', 'thumbnail']) {
      try {
        const bytes = await fs.readFile(path.join(directory, existing[type].objectPath))
        valid &&= createHash('sha256').update(bytes).digest('hex') === existing[type].sha256
      } catch { valid = false }
    }
    if (valid) { results.push({ ...existing, ...source }); console.log(source.id + ': verified existing optimized files'); continue }
  }
  const response = await fetch(source.downloadUrl, { signal: AbortSignal.timeout(90000) })
  if (!response.ok) throw new Error(`Download ${source.id}: HTTP ${response.status}`)
  const original = Buffer.from(await response.arrayBuffer())
  const input = path.join(scratch, source.id.replace(':', '-') + '.original')
  await fs.writeFile(input, original)
  const prefix = path.join(scratch, source.id.replace(':', '-'))
  const variants = JSON.parse(execFileSync('python3', [path.join(root, 'scripts/optimise-product-images.py'), input, prefix, JSON.stringify(source.crop || null)], { encoding: 'utf8' }))
  const record = { ...source, originalBytes: original.length, originalSha256: createHash('sha256').update(original).digest('hex'), originalWidth: variants.originalWidth, originalHeight: variants.originalHeight }
  const category = source.id.split(':')[0]
  const slug = source.id.split(':')[1]
  await fs.mkdir(path.join(directory, category), { recursive: true })
  for (const type of ['image', 'thumbnail']) {
    const bytes = await fs.readFile(variants[type].file)
    const hash = createHash('sha256').update(bytes).digest('hex')
    const objectPath = `${category}/${slug}-${hash.slice(0, 12)}${type === 'thumbnail' ? '-thumb' : ''}.webp`
    await fs.writeFile(path.join(directory, objectPath), bytes)
    record[type] = { objectPath, sha256: hash, bytes: bytes.length, width: variants[type].width, height: variants[type].height }
  }
  results.push(record)
  console.log(source.id + ': optimized ' + record.image.width + '×' + record.image.height + ', ' + record.image.bytes + ' bytes')
}
if (new Set(results.map(row => row.originalSha256)).size !== results.length) throw new Error('Duplicate source photography')
if (new Set(results.map(row => row.image.sha256)).size !== results.length) throw new Error('Duplicate optimized images')
await fs.writeFile(path.join(root, 'scripts/product-storage-manifest.json'), JSON.stringify(results, null, 2) + '\n')
console.log(`Prepared ${results.length} individually sourced products; ${results.length * 2} WebP objects. Existing files retained.`)
