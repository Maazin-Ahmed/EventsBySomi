import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rentalGroups } from '../src/content.js'
import { productImageManifest } from '../src/rental/productImageManifest.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const products = rentalGroups.flatMap(group => group.items.map(name => ({ group, name })))
const expectedIds = products.map(({ group, name }) => group.slug + ':' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
const seenFiles = new Set()
const hashes = new Map()
let totalBytes = 0
let images = 0

if (new Set(productImageManifest.map(item => item.id)).size !== productImageManifest.length) failures.push('Duplicate product IDs found.')
for (const product of productImageManifest) if (!expectedIds.includes(product.id)) failures.push(`Unknown product mapping: ${product.id}`)

for (const product of productImageManifest) {
  if (!['exact', 'representative'].includes(product.matchType)) failures.push(`Invalid match type: ${product.id}`)
  if (!product.source?.photoId || !product.source.license || !product.alt) failures.push(`Incomplete source or alt metadata: ${product.id}`)
  for (const [key, maxBytes] of [['thumbnail', 30_000], ['requestImage', 50_000], ['image', 100_000], ['imageMobile', 100_000], ['imageLarge', 180_000]]) {
    const assetPath = product[key]
    if (!assetPath || !assetPath.startsWith('/images/rentals/') || assetPath.includes('://')) {
      failures.push(`Nonlocal or missing ${key} for ${product.id}`)
      continue
    }
    if (seenFiles.has(assetPath)) failures.push(`Duplicate variant reference: ${assetPath}`)
    seenFiles.add(assetPath)
    const filename = path.join(root, 'public', assetPath.slice(1))
    if (!fs.existsSync(filename)) {
      failures.push(`Broken local image path: ${assetPath}`)
      continue
    }
    const bytes = fs.readFileSync(filename)
    if (bytes.length < 12 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') failures.push(`Invalid WebP file: ${assetPath}`)
    const acceptedBudget = product.source?.sizeBudgetOverrides?.[key] || maxBytes
    if (bytes.length > acceptedBudget) failures.push(`Oversized ${key} (${bytes.length} bytes, budget ${acceptedBudget}): ${assetPath}`)
    const hash = crypto.createHash('sha256').update(bytes).digest('hex')
    if (hashes.has(hash)) failures.push(`Duplicate image data: ${hashes.get(hash)} and ${assetPath}`)
    hashes.set(hash, assetPath)
    totalBytes += bytes.length
    images++
  }
  if (product.width !== product.imageWidth || product.height !== product.imageHeight) failures.push(`Image dimensions disagree with the 480 variant: ${product.id}`)
}

const expectedImages = productImageManifest.length * 5
if (images !== expectedImages) failures.push(`Expected ${expectedImages} optimized variants, checked ${images}.`)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Catalogue products: ${products.length}`)
  console.log(`Exact matches: ${productImageManifest.filter(item => item.matchType === 'exact').length}`)
  console.log(`Representative matches: ${productImageManifest.filter(item => item.matchType === 'representative').length}`)
  console.log(`Products missing suitable images: ${products.length - productImageManifest.length}`)
  console.log(`Optimized local WebP variants: ${images}`)
  console.log(`Total image storage: ${totalBytes} bytes`)
  console.log('Local paths, WebP format, unique assets, dimensions, and file size budgets: PASS')
}
