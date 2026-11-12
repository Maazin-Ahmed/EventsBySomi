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
const storageManifestFile = path.join(root, 'scripts/product-storage-manifest.json')
let storageProducts = []
let storageBytes = 0
if (fs.existsSync(storageManifestFile)) {
  storageProducts = JSON.parse(fs.readFileSync(storageManifestFile, 'utf8'))
  const sourceHashes = new Set()
  const imageHashes = new Set()
  const objectPaths = new Set()
  for (const product of storageProducts) {
    if (!expectedIds.includes(product.id)) failures.push('Unknown storage product: ' + product.id)
    if (!product.sourcePage || !product.photographer || !product.licenseUrl || !product.visualReview) failures.push('Incomplete storage attribution: ' + product.id)
    if (sourceHashes.has(product.originalSha256)) failures.push('Duplicate source photograph: ' + product.id)
    sourceHashes.add(product.originalSha256)
    for (const type of ['image', 'thumbnail']) {
      const asset = product[type]
      if (objectPaths.has(asset.objectPath)) failures.push('Duplicate storage path: ' + asset.objectPath)
      objectPaths.add(asset.objectPath)
      const file = path.join(root, 'public/images/rental-product-images', asset.objectPath)
      if (!fs.existsSync(file)) { failures.push('Missing upload asset: ' + asset.objectPath); continue }
      const bytes = fs.readFileSync(file)
      const hash = crypto.createHash('sha256').update(bytes).digest('hex')
      if (imageHashes.has(hash) || hash !== asset.sha256) failures.push('Duplicate or changed storage bytes: ' + asset.objectPath)
      imageHashes.add(hash)
      if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') failures.push('Invalid storage WebP: ' + asset.objectPath)
      if (!asset.width || !asset.height || Math.max(asset.width, asset.height) > (type === 'image' ? 1400 : 384)) failures.push('Invalid storage dimensions: ' + asset.objectPath)
      if (bytes.length !== asset.bytes || bytes.length > (type === 'image' ? 512000 : 60000)) failures.push('Storage image size budget exceeded: ' + asset.objectPath)
      storageBytes += bytes.length
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Catalogue products: ${products.length}`)
  console.log(`Retained legacy variants: ${images}; ${totalBytes} bytes (historical 16-product manifest)`)
  console.log(`Current approved Storage products: ${storageProducts.length}/${products.length}`)
  console.log(`Current products missing suitable images: ${products.length - storageProducts.length}`)
  console.log(`Current optimized upload objects: ${storageProducts.length * 2}; ${storageBytes} bytes`)
  console.log('Asset integrity: PASS — local paths, WebP format, unique photograph hashes, attribution, dimensions, and size budgets')
  if (storageProducts.length !== products.length) console.log('COVERAGE INCOMPLETE — see phase5.1.1 audit; missing photographs are not counted as passing images.')
}
