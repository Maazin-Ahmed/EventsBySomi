import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { celebrations, rentalGroups, slugify } from '../src/content.js'
import { galleryImages } from '../src/imageManifest.js'
import { imageUrl } from '../src/content.js'
import { productImageFor, rentalProductId } from '../src/rental/productImageManifest.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const storageManifestPath = new URL('./product-storage-manifest.json', import.meta.url)
const storageImages = existsSync(storageManifestPath) ? new Map(JSON.parse(readFileSync(storageManifestPath, 'utf8')).map(product => [product.id, product])) : null
if (!supabaseUrl || !anonKey) throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env before running this read-only check.')

async function readTable(table, columns) {
  const query = new URLSearchParams({ select: columns.join(',') })
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Prefer: 'count=exact' },
  })
  if (!response.ok) throw new Error(`Anonymous SELECT ${table} failed with HTTP ${response.status}.`)
  return response.json()
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function stableJson(value) {
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']'
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stableJson(value[key])).join(',') + '}'
  return JSON.stringify(value)
}

function stableUuid(name) {
  const namespace = Buffer.from('6ba7b8119dad11d180b400c04fd430c8', 'hex')
  const digest = createHash('sha1').update(namespace).update(name).digest().subarray(0, 16)
  digest[6] = (digest[6] & 0x0f) | 0x50
  digest[8] = (digest[8] & 0x3f) | 0x80
  const hex = digest.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const [categories, products, celebrationRows, galleryRows, testimonials, content, settings] = await Promise.all([
  readTable('categories', ['id', 'slug', 'name', 'description', 'image_url', 'is_active', 'sort_order']),
  readTable('products', ['id', 'category_id', 'slug', 'name', 'image_url', 'thumbnail_url', 'image_alt', 'image_match_type', 'is_active']),
  readTable('celebrations', ['id', 'slug', 'name', 'description', 'hero_image_url', 'thumbnail_url', 'is_active']),
  readTable('gallery_images', ['id', 'title', 'image_url', 'thumbnail_url', 'category', 'alt_text', 'is_published']),
  readTable('testimonials', ['id', 'customer_name', 'testimonial', 'event_type', 'is_published']),
  readTable('site_content', ['section_key', 'content', 'is_published']),
  readTable('site_settings', ['key', 'value']),
])

const expectedCategories = new Map(rentalGroups.map((group, sortOrder) => [group.slug, { name: group.title, description: group.description, image_url: imageUrl(group.image, 800), sortOrder }]))
assert(categories.length === expectedCategories.size, `Expected ${expectedCategories.size} public categories, received ${categories.length}.`)
for (const row of categories) {
  const expected = expectedCategories.get(row.id)
  assert(expected && row.slug === row.id && row.name === expected.name && row.description === expected.description && row.image_url === expected.image_url && row.is_active, `Category mismatch: ${row.id}.`)
}

const expectedProducts = new Map(rentalGroups.flatMap(group => group.items.map((name, sortOrder) => {
  const image = productImageFor(group.slug, name)
  const storageImage = storageImages?.get(rentalProductId(group.slug, name))
  const storageBase = `${supabaseUrl}/storage/v1/object/public/rental-product-images/`
  return [rentalProductId(group.slug, name), {
    category_id: group.slug,
    slug: slugify(name),
    name,
    image_url: storageImages ? (storageImage ? storageBase + storageImage.image.objectPath : null) : image?.image || null,
    thumbnail_url: storageImages ? (storageImage ? storageBase + storageImage.thumbnail.objectPath : null) : image?.thumbnail || null,
    image_alt: storageImages ? storageImage?.alt || null : image?.alt || null,
    image_match_type: storageImages ? storageImage?.matchType || null : image?.matchType || null,
    sort_order: sortOrder,
  }]
})))
assert(products.length === expectedProducts.size, `Expected ${expectedProducts.size} public products, received ${products.length}.`)
for (const row of products) {
  const expected = expectedProducts.get(row.id)
  assert(expected, `Unexpected product ID: ${row.id}.`)
  for (const field of ['category_id', 'slug', 'name', 'image_url', 'thumbnail_url', 'image_alt', 'image_match_type']) {
    assert(row[field] === expected[field], `Product ${row.id} differs for ${field}.`)
  }
  assert(row.is_active, `Product ${row.id} is not active.`)
}

const expectedCelebrations = new Map(celebrations.map(item => [item.slug, {
  name: item.name,
  description: item.intro,
  hero_image_url: imageUrl(item.pageImage || item.image, 1400),
  thumbnail_url: imageUrl(item.image, 800),
}]))
assert(celebrationRows.length === expectedCelebrations.size, `Expected ${expectedCelebrations.size} public celebrations, received ${celebrationRows.length}.`)
for (const row of celebrationRows) {
  const expected = expectedCelebrations.get(row.id)
  assert(expected && row.id === row.slug && row.name === expected.name && row.description === expected.description && row.hero_image_url === expected.hero_image_url && row.thumbnail_url === expected.thumbnail_url && row.is_active, `Celebration mismatch: ${row.id}.`)
}
assert(galleryRows.length === galleryImages.length, `Expected ${galleryImages.length} public gallery images, received ${galleryRows.length}.`)
const expectedGallery = new Map(galleryImages.map(item => [stableUuid('gallery:' + item.id), {
  title: item.caption,
  image_url: imageUrl(item.image, 1200),
  thumbnail_url: imageUrl(item.image, 480),
  category: item.category,
  alt_text: item.alt,
}]))
for (const row of galleryRows) {
  const expected = expectedGallery.get(row.id)
  assert(expected && Object.entries(expected).every(([field, value]) => row[field] === value) && row.is_published, `Gallery image mismatch: ${row.id}.`)
}
assert(testimonials.length === 0, 'Unexpected testimonials were seeded; the inspected site had none.')
assert(content.length === 34 && content.every(row => row.is_published), `Expected 34 published content sections, received ${content.length}.`)
const expectedContentKeys = [
  'homepage.hero', 'homepage.introduction', 'homepage.celebrations', 'homepage.mandap_showcase', 'homepage.rental_collections', 'homepage.decorative_details', 'homepage.process', 'homepage.gallery_teaser', 'homepage.enquiry', 'homepage.footer',
  'about.hero', 'about.philosophy', 'about.approach', 'about.explore', 'about.callout',
  'celebrations.index', 'collections.index', 'collections.media', 'gallery.page', 'gallery.category_tags', 'contact.page', 'faq', 'privacy-policy', 'terms',
  ...celebrations.map(item => 'celebration:' + item.slug),
]
assert(content.length === expectedContentKeys.length && expectedContentKeys.every(key => content.some(row => row.section_key === key)), 'Published site content keys differ from the expected seed.')
const expectedSettings = new Map([
  ['business_name', 'Events by Somia'],
  ['contact_email', 'contact@eventsbysomia.com'],
  ['contact_phone', { display: '+1 954-496-0556', e164: '+19544960556' }],
  ['business_address', { street: '9266 Delemar Ct', city: 'Wellington', state: 'FL', postal_code: '33414', country: 'United States', formatted: '9266 Delemar Ct, Wellington, FL 33414, United States' }],
  ['whatsapp_url', 'https://wa.me/19544960556'],
  ['maps_url', 'https://maps.google.com/?q=9266+Delemar+Ct,+Wellington,+FL+33414'],
  ['website_url', 'https://eventsbysomia.com'],
])
assert(settings.length === expectedSettings.size && settings.every(row => stableJson(row.value) === stableJson(expectedSettings.get(row.key))), 'Public settings differ from the verified seed.')

console.log('Anonymous read access: PASS')
console.log(`Categories: ${categories.length}; products: ${products.length}; exact image mappings: ${products.filter(row => row.image_match_type === 'exact').length}; representative: ${products.filter(row => row.image_match_type === 'representative').length}; unmapped: ${products.filter(row => !row.image_url).length}`)
console.log(`Celebrations: ${celebrationRows.length}; gallery images: ${galleryRows.length}; testimonials: ${testimonials.length}; site content: ${content.length}; public settings: ${settings.length}`)
console.log('Local product IDs, names, categories, image paths, alt text, match types, and active flags: PASS')
