import { celebrations, imageUrl, rentalGroups } from './content.js'
import { faqGroups } from './pageContent.js'

const siteUrl = 'https://events-by-somi.vercel.app'
const fallbackImage = imageUrl('photo-1519741497674-611481863552', 1600)

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.append(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}

function ensureCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }
  element.href = href
}

function getPage(path) {
  const celebration = celebrations.find(item => path === `/celebrations/${item.slug}`)
  const collection = rentalGroups.find(item => path === `/collections/${item.slug}`)
  if (celebration) return {
    title: `${celebration.name} Decor & Rentals | Events by Somia — Wellington, FL`,
    description: celebration.intro,
    image: imageUrl(celebration.image, 1600),
    crumbs: ['Celebrations', celebration.name],
  }
  if (collection) return {
    title: `${collection.title} Rentals | Events by Somia — Wellington, FL`,
    description: collection.description,
    image: imageUrl(collection.image, 1600),
    crumbs: ['Rental Collections', collection.title],
  }
  const pages = {
    '/': {
      title: 'Events by Somia | South Asian Celebrations & Event Rentals',
      description: 'Thoughtful decor, mandaps, and event rentals for South Asian celebrations and cultural gatherings. Events by Somia is based in Wellington, Florida.',
      image: fallbackImage,
      crumbs: [],
    },
    '/celebrations': {
      title: 'South Asian Celebrations & Event Styling | Events by Somia',
      description: 'Explore wedding, Mehendi, Haldi, Sangeet, family, and cultural celebration styling inspiration with Events by Somia.',
      image: imageUrl(celebrations[0].image, 1600),
      crumbs: ['Celebrations'],
    },
    '/collections': {
      title: 'Event Rental Collections in Wellington, FL | Events by Somia',
      description: 'Explore seating, tables, linens, mandap and stage, decor, and serveware rentals for cultural celebrations.',
      image: imageUrl(rentalGroups[3].image, 1600),
      crumbs: ['Rental Collections'],
    },
    '/gallery': {
      title: 'South Asian Celebration Inspiration Gallery | Events by Somia',
      description: 'Editorial inspiration for South Asian celebrations, ceremony settings, event decor, and rental collections. Images are not a portfolio of client events.',
      image: imageUrl('photo-1745573673583-a51f665ae48e', 1600),
      crumbs: ['Gallery'],
    },
    '/about': {
      title: 'About Events by Somia | Wellington, Florida',
      description: 'Discover the Events by Somia approach to South Asian celebrations, thoughtful details, and contemporary event styling.',
      image: imageUrl('photo-1519167758481-83f550bb49b3', 1600),
      crumbs: ['About'],
    },
    '/faq': {
      title: 'Event Rental & Celebration FAQs | Events by Somia',
      description: 'Answers about South Asian celebrations, rental collections, event enquiries, availability, and contacting Events by Somia.',
      image: imageUrl('photo-1464366400600-7168b8af9bc3', 1600),
      crumbs: ['FAQ'],
    },
    '/contact': {
      title: 'Request an Event Decor & Rental Quote | Events by Somia',
      description: 'Enquire about event decor and rental collections for your South Asian celebration in Wellington, Florida.',
      image: fallbackImage,
      crumbs: ['Contact'],
    },
    '/privacy-policy': {
      title: 'Privacy Policy | Events by Somia',
      description: 'Learn what information Events by Somia collects through its enquiry form and how enquiry details are handled.',
      image: imageUrl('photo-1600210492486-724fe5c67fb0', 1600),
      crumbs: ['Privacy Policy'],
    },
    '/terms': {
      title: 'Terms & Conditions | Events by Somia',
      description: 'Website terms for using Events by Somia celebration inspiration, rental catalogue, and enquiry form.',
      image: imageUrl('photo-1519225421980-715cb0215aed', 1600),
      crumbs: ['Terms & Conditions'],
    },
  }
  return pages[path] || pages['/']
}

function breadcrumbs(path, crumbs) {
  const items = [{ name: 'Home', item: `${siteUrl}/` }]
  let current = ''
  crumbs.forEach((name, index) => {
    if (index === 0 && name === 'Celebrations') current = '/celebrations'
    else if (index === 0 && name === 'Rental Collections') current = '/collections'
    else if (index === 0 && ['Weddings', 'Mehendi', 'Haldi', 'Sangeet', 'Baby Showers', 'Birthdays', 'Anniversaries', 'Pooja', 'Griha Pravesh', 'Cultural Gatherings & Get-togethers'].includes(name)) current = '/celebrations'
    else if (index === 0 && ['Seating', 'Tables', 'Linens', 'Mandap & stage', 'Decor', 'Serveware'].includes(name)) current = '/collections'
    else if (index === 0) current = path
    else current = path
    if (!items.some(item => item.item === `${siteUrl}${current}` && item.name === name)) items.push({ name, item: `${siteUrl}${current}` })
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.item })),
  }
}

export function applyPageSeo(path) {
  const normalizedPath = path.replace(/\/$/, '') || '/'
  const page = getPage(normalizedPath)
  const canonical = `${siteUrl}${normalizedPath === '/' ? '/' : normalizedPath}`
  document.title = page.title
  ensureMeta('meta[name="description"]', { name: 'description', content: page.description })
  ensureMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' })
  ensureMeta('meta[property="og:title"]', { property: 'og:title', content: page.title })
  ensureMeta('meta[property="og:description"]', { property: 'og:description', content: page.description })
  ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
  ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  ensureMeta('meta[property="og:image"]', { property: 'og:image', content: page.image })
  ensureMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `Events by Somia — ${page.title}` })
  ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: page.title })
  ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: page.description })
  ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: page.image })
  ensureCanonical(canonical)

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Events by Somia',
    url: siteUrl,
    image: page.image,
    telephone: '+1-954-496-0556',
    email: 'contact@eventsbysomia.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9266 Delemar Ct',
      addressLocality: 'Wellington',
      addressRegion: 'FL',
      postalCode: '33414',
      addressCountry: 'US',
    },
  }
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Events by Somia', url: `${siteUrl}/` }
  const schemas = [localBusiness, website, breadcrumbs(normalizedPath, page.crumbs)]
  if (normalizedPath === '/faq') schemas.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap(group => group.questions.map(([name, answer]) => ({
      '@type': 'Question', name,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    }))),
  })
  let structuredData = document.getElementById('events-by-somia-structured-data')
  if (!structuredData) {
    structuredData = document.createElement('script')
    structuredData.id = 'events-by-somia-structured-data'
    structuredData.type = 'application/ld+json'
    document.head.append(structuredData)
  }
  structuredData.textContent = JSON.stringify(schemas)
}

