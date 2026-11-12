import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { celebrations, imageUrl, rentalGroups, slugify } from '../src/content.js'
import { faqGroups, privacySections, termsSections } from '../src/pageContent.js'
import { galleryCategories, galleryImages, imageAssignments, imageById } from '../src/imageManifest.js'
import { productImageManifest, productImageFor, rentalProductId } from '../src/rental/productImageManifest.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const migrationPath = path.join(root, 'supabase/migrations/20261112000001_seed_existing_website_content.sql')
const uuidNamespace = Buffer.from('6ba7b8119dad11d180b400c04fd430c8', 'hex')

function stableUuid(name) {
  const digest = createHash('sha1').update(uuidNamespace).update(name).digest().subarray(0, 16)
  digest[6] = (digest[6] & 0x0f) | 0x50
  digest[8] = (digest[8] & 0x3f) | 0x80
  const hex = digest.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function sqlText(value) {
  if (value === null || value === undefined) return 'NULL'
  return "'" + String(value).replaceAll("'", "''") + "'"
}

function sqlJson(value) {
  if (value === null || value === undefined) return 'NULL'
  return sqlText(JSON.stringify(value)) + '::jsonb'
}

function insertRows(table, columns, rows, conflictTarget, updates) {
  if (!rows.length) return `-- No records to seed into ${table}.\n`
  const values = rows.map(row => '  (' + row.map(value => value === undefined ? 'NULL' : value).join(', ') + ')').join(',\n')
  return `INSERT INTO public.${table} (${columns.join(', ')})\nVALUES\n${values}\nON CONFLICT (${conflictTarget}) DO UPDATE SET\n  ${updates.join(',\n  ')};\n`
}

const categories = rentalGroups.map((group, sortOrder) => [
  sqlText(group.slug),
  sqlText(group.title),
  sqlText(group.slug),
  sqlText(group.description),
  sqlText(imageUrl(group.image, 800)),
  'true',
  String(sortOrder),
])

const products = rentalGroups.flatMap(group => group.items.map((name, sortOrder) => {
  const image = productImageFor(group.slug, name)
  return [
    sqlText(rentalProductId(group.slug, name)),
    sqlText(group.slug),
    sqlText(name),
    sqlText(slugify(name)),
    'NULL',
    sqlText(image?.image || null),
    sqlText(image?.thumbnail || null),
    sqlText(image?.alt || null),
    sqlText(image?.matchType || null),
    'true',
    String(sortOrder),
  ]
}))

if (products.length !== 42) throw new Error(`Expected 42 products, found ${products.length}.`)
if (new Set(products.map(row => row[3])).size !== products.length) throw new Error('Product slugs are not unique.')
if (productImageManifest.length !== 16) throw new Error(`Expected 16 verified image mappings, found ${productImageManifest.length}.`)

const celebrationRows = celebrations.map((item, sortOrder) => [
  sqlText(item.slug),
  sqlText(item.name),
  sqlText(item.slug),
  sqlText(item.intro),
  sqlText(imageUrl(item.pageImage || item.image, 1400)),
  sqlText(imageUrl(item.image, 800)),
  'true',
  String(sortOrder),
])

const galleryIds = new Map(galleryImages.map(item => [item.id, stableUuid('gallery:' + item.id)]))
const galleryRows = galleryImages.map((item, sortOrder) => [
  sqlText(galleryIds.get(item.id)) + '::uuid',
  sqlText(item.caption),
  'NULL',
  sqlText(imageUrl(item.image, 1200)),
  sqlText(imageUrl(item.image, 480)),
  sqlText(item.category),
  sqlText(item.alt),
  'true',
  String(sortOrder),
])

const siteSections = []
function addSection(sectionKey, title, content) {
  siteSections.push([stableUuid('site-content:' + sectionKey), sectionKey, title, content, true])
}

const assignedImage = (key, width = 1400) => {
  const imageId = imageAssignments[key]
  const asset = imageById[imageId]
  if (!asset) throw new Error(`Missing assigned image: ${key} (${imageId}).`)
  return { image_url: imageUrl(imageId, width), alt_text: asset.alt }
}

addSection('homepage.hero', 'Where tradition becomes your story.', {
  eyebrow: 'SOUTH ASIAN CELEBRATIONS, THOUGHTFULLY DESIGNED',
  headline: { before: 'Where tradition', emphasized: 'your story.' },
  body: 'A gathering of color, ritual, and the people who make it yours.',
  cta_label: 'Explore our celebrations',
  cta_href: '#celebrations',
  image: assignedImage('homepageHero'),
})
addSection('homepage.introduction', 'Old-world soul. Personal by nature.', {
  eyebrow: 'A HERITAGE OF CELEBRATION',
  headline: { before: 'Old-world soul.', emphasized: 'Personal by nature.' },
  body: 'At Events by Somia, South Asian celebrations are honored with thoughtful design and a personal touch. From the first gathering to the final detail, we help bring your traditions, loved ones, and vision together in a setting that feels unmistakably yours.',
  link_label: 'Our way of bringing it together',
  link_href: '#approach',
})
addSection('homepage.celebrations', 'Every reason to come together.', {
  eyebrow: 'MOMENTS WORTH GATHERING FOR',
  headline: { before: 'Every reason to', emphasized: 'come together.' },
  body: 'Rooted in tradition, shaped around you. We create settings for the milestones and everyday moments that bring your loved ones close.',
  image_source: 'celebrations table thumbnails',
})
addSection('homepage.mandap_showcase', 'Under one beautiful canopy.', {
  eyebrow: 'A PLACE FOR YOUR PROMISE',
  headline: { before: 'Under one', emphasized: 'beautiful canopy.' },
  body: 'A mandap is more than a setting. It is the heart of the ceremony. Bring together pillars, arches, floral backdrops, and fabric details in a space that feels deeply personal.',
  cta_label: 'Enquire about a mandap',
  cta_href: '#enquiry',
  details: ['PILLARS & ARCHES', 'FLORAL BACKDROPS'],
  image: assignedImage('mandapShowcase'),
})
addSection('homepage.rental_collections', 'The details that make it yours.', {
  eyebrow: 'GATHERED WITH CARE',
  headline: { before: 'The details', emphasized: 'that make it yours.' },
  body: 'Considered pieces for a beautifully composed celebration.',
  cta_label: 'Explore all rentals',
  cta_href: '/collections',
  cards_source: 'categories and products tables',
})
addSection('homepage.decorative_details', 'Little rituals. Lasting beauty.', {
  eyebrow: 'A CLOSER LOOK',
  headline: { before: 'Little rituals.', emphasized: 'Lasting beauty.' },
  items: [
    { title: 'Torans', body: 'A welcoming detail for an entrance or ceremony.', image: imageUrl(imageAssignments.decorativeDetails.torans, 800) },
    { title: 'Diyas & Urlis', body: 'Traditional accents that bring warmth to a gathering.', image: imageUrl(imageAssignments.decorativeDetails.diyasAndUrlis, 800) },
    { title: 'Garlands', body: 'Marigold and rose garlands for meaningful moments.', image: imageUrl(imageAssignments.decorativeDetails.garlands, 800) },
    { title: 'Fanoos & Kalash', body: 'Lanterns and auspicious details for a festive setting.', image: imageUrl(imageAssignments.decorativeDetails.fanoosAndKalash, 800) },
  ],
})
addSection('homepage.process', 'From first thought to gathered together.', {
  eyebrow: 'A CONSIDERED APPROACH',
  headline: { before: 'From first thought', emphasized: 'to gathered together.' },
  body: 'A few thoughtful steps make room for the celebration you have imagined.',
  steps: [
    { title: 'Listen', body: 'Tell us about your celebration, your traditions, and what you want guests to feel.' },
    { title: 'Shape', body: 'We bring your ideas together with decor, mandap, and rental selections.' },
    { title: 'Gather', body: 'Your setting comes together around the moments you are there to share.' },
  ],
})
addSection('homepage.gallery_teaser', 'A feeling, in full bloom.', {
  eyebrow: 'COLLECTED MOMENTS',
  headline: { before: 'A feeling, in', emphasized: 'full bloom.' },
  body: 'A visual reference of ceremony settings, cultural details, and rental inspiration to help you shape your own gathering.',
  cta_label: 'Explore the Gallery',
  cta_href: '/gallery',
})
addSection('homepage.enquiry', 'Tell us what you’re dreaming.', {
  eyebrow: 'LET’S BEGIN',
  headline: { before: 'Tell us what', emphasized: 'you’re dreaming.' },
  body: 'Share a few details and our team can learn what matters most to you and your celebration.',
  quick_question_label: 'Have a quick question?',
})
addSection('homepage.footer', 'Events by Somia', {
  brand_name: 'EVENTS BY SOMIA',
  body: 'Thoughtful decor and rental pieces for South Asian celebrations and cultural gatherings.',
  cta_label: 'Request a Quote',
  cta_href: '/contact#enquiry',
  tagline: 'Rooted in tradition. Designed for your story.',
})

addSection('about.hero', 'About us', {
  eyebrow: 'OUR PHILOSOPHY',
  body: 'Royal Indian heritage meets modern American luxury. Events by Somia brings thoughtful decor and rental selections to South Asian celebrations and cultural gatherings.',
  image: assignedImage('aboutPage'),
  cta_label: 'Our approach',
})
addSection('about.philosophy', 'A setting should feel like it belongs to you.', {
  eyebrow: 'ROOTED IN TRADITION. PERSONAL BY NATURE.',
  paragraphs: [
    'Celebrations carry the stories, rituals, and people that matter to us. Our approach begins by listening to what your gathering means, then considering how its setting can reflect that meaning.',
    'We bring traditional references and contemporary event design into conversation through thoughtful details, beautifully composed spaces, and room for personal expression. The goal is a celebration that feels considered, welcoming, and true to your vision.',
  ],
})
addSection('about.approach', 'From first conversation to a clear direction', {
  eyebrow: 'A CONSIDERED APPROACH',
  steps: [
    { title: 'Understand the celebration', body: 'Share the occasion, the traditions you want to honor, and what you hope the space will feel like.' },
    { title: 'Explore the details', body: 'Discuss decor, furniture, linens, and rental requirements that could support your plans.' },
    { title: 'Shape the aesthetic', body: 'Talk through colors, materials, floral direction, and the balance of traditional and contemporary elements.' },
    { title: 'Coordinate the enquiry', body: 'Share the event date, location, and practical requirements so the team can respond to your enquiry.' },
  ],
})
addSection('about.explore', 'Explore what we offer', {
  eyebrow: 'FIND YOUR STARTING POINT',
  links: [
    { eyebrow: 'Discover', title: 'Celebrations', href: '/celebrations' },
    { eyebrow: 'Browse', title: 'Rental Collections', href: '/collections' },
    { eyebrow: 'Gather inspiration', title: 'Gallery', href: '/gallery' },
  ],
})
addSection('about.callout', 'Let’s begin with your story.', {
  eyebrow: 'LET’S BEGIN WITH YOUR IDEAS',
  body: 'Share what you are planning and the details that matter to you.',
  cta_label: 'Request a Quote',
  cta_href: '/contact#enquiry',
})

addSection('celebrations.index', 'Celebrations', {
  eyebrow: 'MOMENTS WORTH GATHERING FOR',
  body: 'South Asian celebrations, thoughtfully gathered around your traditions, people, and vision.',
})
addSection('collections.index', 'Rental Collections', {
  eyebrow: 'GATHERED WITH CARE',
  body: 'Considered pieces for ceremonies, shared meals, and the moments in between.',
})
addSection('collections.media', 'Rental collection page imagery', Object.fromEntries(rentalGroups.map(group => [group.slug, {
  homepage_image_url: imageUrl(group.image, 800),
  listing_image_url: imageUrl(group.listingImage, 1200),
  hero_image_url: imageUrl(group.pageImage || group.image, 1400),
}])))
addSection('gallery.page', 'Gallery', {
  eyebrow: 'EDITORIAL INSPIRATION',
  body: 'A considered collection of ceremony settings, color, flowers, and thoughtful details to help shape your own celebration.',
  editorial_eyebrow: 'A VISUAL REFERENCE',
  editorial_title: { before: 'Ideas for the moments', emphasized: 'you’ll make your own.' },
  editorial_body: 'These photographs are editorial inspiration, not a portfolio of events hosted by Events by Somia. Explore settings and details that may help you describe the celebration you have in mind.',
  filters: galleryCategories,
})
addSection('gallery.category_tags', 'Gallery image filter tags', Object.fromEntries(galleryImages.map(item => [galleryIds.get(item.id), item.categories])))
addSection('contact.page', 'Let’s begin with your story.', {
  eyebrow: 'EVENTS BY SOMIA',
  body: 'Tell us a little about the celebration you have in mind.',
  form_title: 'Your celebration',
  form_note: 'Fields marked * are required.',
  aside_title: 'Tell us what you’re dreaming.',
  aside_body: 'Share a few details and our team can learn what matters most to you and your celebration.',
})
addSection('faq', 'Frequently asked questions', { groups: faqGroups })
addSection('privacy-policy', 'Privacy Policy', { sections: privacySections })
addSection('terms', 'Terms & Conditions', { sections: termsSections })

for (const item of celebrations) {
  addSection('celebration:' + item.slug, item.name, {
    local: item.local,
    note: item.note,
    palette: item.palette,
    collections: item.collections,
    inspiration: item.inspiration,
  })
}

const settings = [
  ['business_name', 'Events by Somia'],
  ['contact_email', 'contact@eventsbysomia.com'],
  ['contact_phone', { display: '+1 954-496-0556', e164: '+19544960556' }],
  ['business_address', { street: '9266 Delemar Ct', city: 'Wellington', state: 'FL', postal_code: '33414', country: 'United States', formatted: '9266 Delemar Ct, Wellington, FL 33414, United States' }],
  ['whatsapp_url', 'https://wa.me/19544960556'],
  ['maps_url', 'https://maps.google.com/?q=9266+Delemar+Ct,+Wellington,+FL+33414'],
  ['website_url', 'https://eventsbysomia.com'],
]

const duplicateSectionKeys = siteSections.map(row => row[1]).filter((key, index, all) => all.indexOf(key) !== index)
if (duplicateSectionKeys.length) throw new Error('Duplicate site_content keys: ' + duplicateSectionKeys.join(', '))
if (galleryImages.length !== 49) throw new Error(`Expected 49 gallery images, found ${galleryImages.length}.`)

const statements = [
  insertRows('categories', ['id', 'name', 'slug', 'description', 'image_url', 'is_active', 'sort_order'], categories, 'id', ['name = EXCLUDED.name', 'slug = EXCLUDED.slug', 'description = EXCLUDED.description', 'image_url = EXCLUDED.image_url', 'is_active = EXCLUDED.is_active', 'sort_order = EXCLUDED.sort_order', 'updated_at = now()']),
  insertRows('products', ['id', 'category_id', 'name', 'slug', 'description', 'image_url', 'thumbnail_url', 'image_alt', 'image_match_type', 'is_active', 'sort_order'], products, 'id', ['category_id = EXCLUDED.category_id', 'name = EXCLUDED.name', 'slug = EXCLUDED.slug', 'description = EXCLUDED.description', 'image_url = EXCLUDED.image_url', 'thumbnail_url = EXCLUDED.thumbnail_url', 'image_alt = EXCLUDED.image_alt', 'image_match_type = EXCLUDED.image_match_type', 'is_active = EXCLUDED.is_active', 'sort_order = EXCLUDED.sort_order', 'updated_at = now()']),
  insertRows('celebrations', ['id', 'name', 'slug', 'description', 'hero_image_url', 'thumbnail_url', 'is_active', 'sort_order'], celebrationRows, 'id', ['name = EXCLUDED.name', 'slug = EXCLUDED.slug', 'description = EXCLUDED.description', 'hero_image_url = EXCLUDED.hero_image_url', 'thumbnail_url = EXCLUDED.thumbnail_url', 'is_active = EXCLUDED.is_active', 'sort_order = EXCLUDED.sort_order', 'updated_at = now()']),
  insertRows('gallery_images', ['id', 'title', 'description', 'image_url', 'thumbnail_url', 'category', 'alt_text', 'is_published', 'sort_order'], galleryRows, 'id', ['title = EXCLUDED.title', 'description = EXCLUDED.description', 'image_url = EXCLUDED.image_url', 'thumbnail_url = EXCLUDED.thumbnail_url', 'category = EXCLUDED.category', 'alt_text = EXCLUDED.alt_text', 'is_published = EXCLUDED.is_published', 'sort_order = EXCLUDED.sort_order', 'updated_at = now()']),
  insertRows('site_content', ['id', 'section_key', 'title', 'content', 'is_published'], siteSections.map(([id, key, title, content, published]) => [sqlText(id) + '::uuid', sqlText(key), sqlText(title), sqlJson(content), String(published)]), 'section_key', ['id = EXCLUDED.id', 'title = EXCLUDED.title', 'content = EXCLUDED.content', 'is_published = EXCLUDED.is_published', 'updated_at = now()']),
  insertRows('site_settings', ['key', 'value'], settings.map(([key, value]) => [sqlText(key), sqlJson(value)]), 'key', ['value = EXCLUDED.value', 'updated_at = now()']),
]

const sql = [
  '-- Seed snapshot generated from the inspected public website content.',
  '-- Product and gallery identifiers are stable across generator runs.',
  '-- No testimonials were present in the website source; none are fabricated.',
  'BEGIN;',
  ...statements,
  'COMMIT;',
  '',
].join('\n')
fs.mkdirSync(path.dirname(migrationPath), { recursive: true })
fs.writeFileSync(migrationPath, sql)
console.log(`Generated ${path.relative(root, migrationPath)}`)
console.log(`Categories: ${categories.length}; products: ${products.length}; verified product images: ${productImageManifest.length}; celebrations: ${celebrationRows.length}; gallery images: ${galleryRows.length}; testimonials: 0; site_content: ${siteSections.length}; site_settings: ${settings.length}`)
