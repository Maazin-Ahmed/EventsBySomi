import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rentalGroups } from '../src/content.js'
import { rentalImageSources } from './rentalImageSources.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetDirectory = path.join(root, 'public/images/rentals')
const manifestPath = path.join(root, 'src/rental/productImageManifest.js')
const variants = [
  { key: 'thumbnail', width: 160, quality: 78 },
  { key: 'requestImage', width: 240, quality: 80 },
  { key: 'image', width: 480, quality: 82 },
  { key: 'imageMobile', width: 720, quality: 68 },
  { key: 'imageLarge', width: 900, quality: 78 },
]

const sourceByProduct = new Map(rentalImageSources.map(source => [source.category + ':' + source.name, source]))
const products = rentalGroups.flatMap(group => group.items.map(name => ({
  id: group.slug + ':' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  category: group.slug,
  categoryName: group.title,
  name,
  source: sourceByProduct.get(group.slug + ':' + name),
})))

if (sourceByProduct.size !== rentalImageSources.length) throw new Error('Duplicate product source mappings found.')
for (const source of rentalImageSources) {
  if (!products.some(product => product.source === source)) throw new Error('Source does not match a catalogue product: ' + source.category + ':' + source.name)
  if (!source.photoId || !(source.imageUrl || source.photoId.startsWith('photo-')) || !source.alt || !source.matchType) throw new Error('Incomplete source record: ' + source.slug)
}

await fs.mkdir(assetDirectory, { recursive: true })
const manifest = []
for (const product of products) {
  const source = product.source
  if (!source) continue

  const downloaded = []
  for (const variant of variants) {
    const url = new URL(source.imageUrl || 'https://images.unsplash.com/' + source.photoId)
    url.search = new URLSearchParams({ auto: 'format', fit: 'max', w: String(variant.width), h: String(variant.width), q: String(variant.quality), fm: 'webp' }).toString()
    const response = await fetch(url)
    if (!response.ok) throw new Error('Unsplash returned ' + response.status + ' for ' + source.slug + ' (' + variant.width + 'px).')
    const bytes = Buffer.from(await response.arrayBuffer())
    if (!bytes.length || bytes[0] !== 0x52 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x46) {
      throw new Error('Expected a WebP image for ' + source.slug + ' (' + variant.width + 'px).')
    }
    const scale = Math.min(1, variant.width / source.sourceWidth, variant.width / source.sourceHeight)
    downloaded.push({ ...variant, pixelWidth: Math.round(source.sourceWidth * scale), pixelHeight: Math.round(source.sourceHeight * scale), bytes })
  }

  const contentHasher = createHash('sha256')
  for (const item of downloaded) contentHasher.update(item.bytes)
  const contentVersion = contentHasher.digest('hex').slice(0, 10)
  const paths = {}
  for (const item of downloaded) {
    const filename = source.slug + '-' + item.width + '-' + item.pixelWidth + 'x' + item.pixelHeight + '-' + contentVersion + '.webp'
    await fs.writeFile(path.join(assetDirectory, filename), item.bytes)
    paths[item.key] = '/images/rentals/' + filename
    paths[item.key + 'Width'] = item.pixelWidth
    paths[item.key + 'Height'] = item.pixelHeight
  }
  manifest.push({
    ...product,
    source: { provider: source.provider || 'Unsplash', photoId: source.photoId, sourcePage: source.sourcePage || null, photographer: source.photographer || null, license: source.license || 'Unsplash License', sizeBudgetOverrides: source.sizeBudgetOverrides || null, sizeBudgetNote: source.sizeBudgetNote || null },
    ...paths,
    matchType: source.matchType,
    alt: source.alt,
    width: paths.imageWidth,
    height: paths.imageHeight,
    sourceWidth: source.sourceWidth,
    sourceHeight: source.sourceHeight,
  })
}

// Retire only files previously produced by this generator and no longer named
// by the manifest. Hand-maintained files and other public assets are untouched.
  const livePaths = new Set(manifest.flatMap(product => [product.thumbnail, product.requestImage, product.image, product.imageMobile, product.imageLarge]).filter(Boolean).map(value => path.basename(value)))
const sourceFiles = []
async function collectSourceFiles(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) await collectSourceFiles(target)
    else if (/\.(js|jsx|css|html)$/.test(entry.name) && entry.name !== path.basename(manifestPath)) sourceFiles.push(target)
  }
}
await collectSourceFiles(path.join(root, 'src'))
const sourceText = await Promise.all(sourceFiles.map(filename => fs.readFile(filename, 'utf8')))
for (const entry of await fs.readdir(assetDirectory, { withFileTypes: true })) {
  if (entry.isFile() && /^[a-z0-9-]+-(160|240|480|720|900)-(?:\d+x\d+-)?[a-f0-9]{10}\.webp$/.test(entry.name) && !livePaths.has(entry.name) && !sourceText.some(text => text.includes(entry.name))) {
    await fs.unlink(path.join(assetDirectory, entry.name))
  }
}

const moduleText = [
  '// Generated by scripts/sync-rental-images.mjs. Edit its curated source list instead.',
  'export const productImageManifest = ' + JSON.stringify(manifest, null, 2),
  '',
  'export const productImageById = Object.fromEntries(productImageManifest.map(product => [product.id, product]))',
  '',
  'export function rentalProductId(category, name) {',
  "  return category + ':' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-')",
  '}',
  '',
  'export function productImageFor(category, name) {',
  '  return productImageById[rentalProductId(category, name)]',
  '}',
  '',
].join('\n')
await fs.writeFile(manifestPath, moduleText)
console.log('Generated ' + manifest.length + ' sourced rental product mappings (' + (products.length - manifest.length) + ' products remain unmapped).')
