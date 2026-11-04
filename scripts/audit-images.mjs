import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { celebrations, rentalGroups } from '../src/content.js'
import { auditedSampleHashes, galleryCategories, galleryImages, imageManifest } from '../src/imageManifest.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const galleryIds = galleryImages.map(asset => asset.image)
const registryIds = imageManifest.map(asset => asset.image)
const homepagePlacements = [
  'photo-1519741497674-611481863552',
  ...celebrations.filter(item => item.image).map(item => item.image),
  ...rentalGroups.filter(group => group.image && group.slug !== 'serveware').map(group => group.image),
  'photo-1772127822552-ce9ef537bdcf',
]
const detailPlacements = [
  ...celebrations.map(item => item.pageImage || item.image).filter(Boolean),
  ...rentalGroups.map(group => group.pageImage || group.image).filter(Boolean),
  'photo-1744804298789-437504006ff8',
]
const contentPlacements = [...homepagePlacements, ...detailPlacements]

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))]
}

function readTree(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? readTree(target) : [target]
  })
}

if (duplicates(registryIds).length) failures.push(`Duplicate manifest IDs: ${duplicates(registryIds).join(', ')}`)
if (duplicates(galleryIds).length) failures.push(`Duplicate Gallery entries: ${duplicates(galleryIds).join(', ')}`)
if (duplicates(contentPlacements).length) failures.push(`Repeated content placements: ${duplicates(contentPlacements).join(', ')}`)

const hashesToImages = new Map()
for (const [imageId, hash] of Object.entries(auditedSampleHashes)) {
  hashesToImages.set(hash, [...(hashesToImages.get(hash) || []), imageId])
}
const exactDuplicateGroups = [...hashesToImages.values()].filter(images => images.length > 1)
if (exactDuplicateGroups.length) {
  failures.push(`Exact duplicate audit samples: ${exactDuplicateGroups.map(images => images.join(' = ')).join('; ')}`)
}

for (const imageId of registryIds) {
  if (!auditedSampleHashes[imageId]) failures.push(`Missing audited sample hash: ${imageId}`)
}

for (const imageId of contentPlacements) {
  if (!galleryIds.includes(imageId)) failures.push(`Gallery is missing ${imageId}`)
}

for (const asset of imageManifest) {
  const sample = asset.sourceSample
  const measuredRatio = sample.width / sample.height
  if (!sample.width || !sample.height || !sample.bytes || !sample.format) failures.push(`Incomplete sample metadata: ${asset.image}`)
  if (Math.abs(measuredRatio - asset.aspectRatio) > 0.006) failures.push(`Aspect ratio mismatch: ${asset.image}`)
  if (!auditedSampleHashes[asset.image]) failures.push(`Missing audited sample hash: ${asset.image}`)
  if (!asset.assignment?.length || !asset.categories?.length || !asset.alt) failures.push(`Incomplete assignment metadata: ${asset.image}`)
}

for (const category of galleryCategories.filter(category => category !== 'All')) {
  if (!galleryImages.some(asset => asset.categories.includes(category))) failures.push(`Empty Gallery category: ${category}`)
}

const sourceFiles = readTree(path.join(root, 'src')).filter(file => /\.(js|jsx|ts|tsx|html|css)$/.test(file))
const unregisteredReferences = new Set()
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(/photo-[A-Za-z0-9_-]+/g)) {
    if (!registryIds.includes(match[0])) unregisteredReferences.add(match[0])
  }
}
if (unregisteredReferences.size) failures.push(`Unregistered source references: ${[...unregisteredReferences].join(', ')}`)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Assets in registry: ${imageManifest.length}`)
  console.log(`Unique content placements: ${contentPlacements.length}`)
  console.log(`Unique Gallery entries: ${galleryImages.length}`)
  console.log(`Category filters with images: ${galleryCategories.length - 1}`)
  console.log(`Exact duplicate sample groups: ${exactDuplicateGroups.length}`)
  console.log('Manifest, unique placements, Gallery coverage, categories, and sample metadata: PASS')
}
