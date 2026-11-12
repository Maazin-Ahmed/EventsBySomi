import { celebrations, imageSrcSet, imageUrl, rentalGroups } from '../content.js'
import { imageById, rentalListingHero } from '../imageManifest.js'
import { useCatalogue } from '../rental/Catalogue.jsx'
import ProductImage from '../rental/ProductImage.jsx'
import { rentalProductId } from '../rental/productIdentity.js'
import Navigation from './Navigation.jsx'
import { SiteFooter } from './StorySections.jsx'
import { useCart } from '../rental/Cart.jsx'

// Unsplash editorial photography, including subject-matched mandap, haldi, stage, diya, and thali images.
export function PageHero({ image, eyebrow, title, intro, action, palette, crumb = '', quoteHref }) {
  const crumbHref = crumb === 'Celebrations' ? '/celebrations' : crumb === 'Rentals' ? '/collections' : '/'
  return <section className={`inner-hero${image ? '' : ' inner-hero--text'}`}>
    {image && <img className="inner-hero__image" src={imageUrl(image, 1400)} srcSet={imageSrcSet(image)} sizes="100vw" width={imageById[image]?.sourceSample.width} height={imageById[image]?.sourceSample.height} style={{ objectPosition: imageById[image]?.objectPosition }} alt={imageById[image]?.alt || ''} fetchPriority="high"/>}
    <div className="inner-hero__shade"/><Navigation/>
    <div className="inner-hero__content"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>{crumb && crumb !== title && <><span>/</span><a href={crumbHref}>{crumb}</a></>}<span>/</span><span aria-current="page">{title}</span></nav>
      <p className="eyebrow"><span/>{eyebrow}</p><h1>{title}</h1><p className="inner-hero__intro">{intro}</p>{palette && <p className="palette-note">{palette}</p>}
      <div className="inner-hero__actions"><a className="button button-light" href="#catalogue">{action || 'Explore the Collection'} <span>↓</span></a><a className="button button-outline" href={quoteHref || `/contact?${crumb === 'Celebrations' ? 'event' : 'category'}=${crumb === 'Celebrations' ? (celebrations.find(item => item.name === title)?.slug || '') : (rentalGroups.find(item => item.title === title)?.slug || '')}#enquiry`}>Request a Quote <span>↗</span></a></div>
    </div>
    <a className="inner-hero__scroll" href="#catalogue">DISCOVER <span>↓</span></a>
  </section>
}

function RelatedCollections({ groups, label = 'Explore the rentals' }) {
  return <section className="related-section"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">{label}</p><h2>Pieces for a gathering<br/><em>made your own.</em></h2></div><div className="related-grid">{groups.map(group => <a className="related-card related-card--text" key={group.slug} href={`/collections/${group.slug}`}><span>View collection ↗</span><h3>{group.title}</h3><p>{group.description}</p></a>)}</div></section>
}

function InquiryBanner({ event, category }) {
  const query = event ? `event=${event}` : `category=${category}`
  return <section className="inquiry-banner"><p className="eyebrow">A GATHERING, CONSIDERED</p><h2>Let’s shape a setting<br/><em>around your story.</em></h2><p>Tell us what you’re planning, and our team can help you explore the relevant decor and rental pieces.</p><a className="button button-light" href={`/contact?${query}#enquiry`}>Request a Quote <span>↗</span></a></section>
}

export function CelebrationPage({ item }) {
  const related = rentalGroups.filter(group => item.collections.includes(group.title))
  return <><PageHero image={item.pageImage || item.image} eyebrow="SOUTH ASIAN CELEBRATIONS" title={item.name} intro={item.intro} palette={item.palette} crumb="Celebrations"/>
    <main className="catalog-main" id="catalogue">
      <section className="inspiration-section"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">{item.local.toUpperCase()}</p><h2>Ideas for a day<br/><em>that feels like yours.</em></h2><p>Traditional and contemporary details can come together in a way that reflects your family, community, and celebration.</p></div><div className="inspiration-list__visual"><p>{item.palette}</p><span>{item.collections.join('  ·  ')}</span></div></section>
      <section className="inspiration-list"><div><p className="eyebrow eyebrow-dark">EVENT INSPIRATION</p><h2>Thoughtful details<br/><em>for gathering.</em></h2></div><ul>{item.inspiration.map(value => <li key={value}>{value}</li>)}</ul></section>
      <RelatedCollections groups={related} label={`Rental ideas for ${item.name.toLowerCase()}`}/>
      <div className="related-inline"><a href="/celebrations">← All celebrations</a><a href="/collections">Browse all rental collections →</a></div>
    </main><InquiryBanner event={item.slug}/><SiteFooter/></>
}

export function CollectionPage({ group }) {
  const { add, items } = useCart()
  const { products, categories, loading, error, retry } = useCatalogue()
  const category = categories.find(item => item.slug === group.slug)
  const categoryProducts = products.filter(product => product.category_id === category?.id)
  // Reserve the existing catalogue geometry before its database response. These
  // invisible shells use the preserved legacy identity list only for sizing;
  // visible cards and all photographs still come from the database records.
  const displayedProducts = loading ? group.items.map(name => ({ id: rentalProductId(group.slug, name), name })) : categoryProducts
  const related = rentalGroups.filter(item => item.slug !== group.slug).slice(0, 3)
  return <><PageHero image={group.pageImage || group.image} eyebrow="EVENT RENTALS" title={group.title} intro={group.description} crumb="Rentals"/>
    <main className="catalog-main" id="catalogue">
      <section className="inventory-section"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">THE RENTAL CATALOGUE</p><h2>Considered pieces,<br/><em>gathered with care.</em></h2><p>Explore the items in this collection. Rental details and availability are confirmed directly with our team.</p></div>
        {loading && <p className="catalogue-loading-status" role="status">Loading rental catalogue…</p>}
        {error && <p role="alert">{error} <button type="button" onClick={retry}>Try again</button></p>}
        {!loading && !error && !categoryProducts.length && <p>No rental pieces are currently listed in this collection.</p>}
        <div className="inventory-grid inventory-grid--catalogue" aria-busy={loading}>{displayedProducts.map(product => {
          const item = product.name
          const inCart = items.some(cartItem => cartItem.id === product.id && cartItem.quantity > 0)
          return <article className="inventory-card inventory-card--text rental-item" key={product.id} data-product-id={loading ? undefined : product.id} aria-hidden={loading || undefined} style={loading ? { visibility: 'hidden' } : undefined}>
            <div className="rental-product-image">
              <ProductImage productId={product.id} name={item}/>
            </div>
            <div><p className="eyebrow eyebrow-dark">{group.title}</p><h3>{item}</h3><p>Ask our team about this piece and how it can fit into your celebration setting.</p><button type="button" className="button button-wine" disabled={loading} onClick={() => inCart ? window.location.assign('/cart') : add(group, item)}>{inCart ? 'View Cart' : 'Add to Cart'}</button></div>
          </article>
        })}</div>
      </section>
      <RelatedCollections groups={related} label="Related collections"/>
      <div className="related-inline"><a href="/collections">← All rental collections</a><a href="/celebrations">Explore celebrations →</a></div>
    </main><InquiryBanner category={group.slug}/><SiteFooter/></>
}

export function ListingPage({ type }) {
  const isEvents = type === 'celebrations'
  const entries = isEvents ? celebrations : rentalGroups
  const title = isEvents ? 'Celebrations' : 'Rental Collections'
  const intro = isEvents ? 'South Asian celebrations, thoughtfully gathered around your traditions, people, and vision.' : 'Considered pieces for ceremonies, shared meals, and the moments in between.'
  return <><PageHero image={isEvents ? null : rentalListingHero} eyebrow={isEvents ? 'MOMENTS WORTH GATHERING FOR' : 'GATHERED WITH CARE'} title={title} intro={intro} crumb={isEvents ? 'Celebrations' : 'Rentals'} action="Explore the catalogue"/>
    <main className="catalog-main listing-main" id="catalogue"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">EVENTS BY SOMIA</p><h2>{isEvents ? <>Every reason to<br/><em>come together.</em></> : <>The details that<br/><em>make it yours.</em></>}</h2></div><div className="listing-grid">{entries.map(item => {
      const image = isEvents ? null : item.listingImage
      const asset = image ? imageById[image] : null
      return <a className={`listing-card${image ? '' : ' listing-card--text'}`} href={isEvents ? `/celebrations/${item.slug}` : `/collections/${item.slug}`} key={item.slug}>
        {image && <img src={imageUrl(image, 900)} srcSet={imageSrcSet(image)} sizes="(max-width: 600px) 86vw, (max-width: 899px) 42vw, 29vw" width={asset.sourceSample.width} height={asset.sourceSample.height} style={{ objectPosition: asset.objectPosition }} alt={asset.alt} loading="lazy"/>}
        <div><p className="eyebrow">{isEvents ? item.local : 'EVENT RENTALS'}</p><h3>{item.name || item.title}</h3><p>{isEvents ? item.note : item.description}</p><span>Explore {isEvents ? 'celebration' : 'collection'} ↗</span></div>
      </a>
    })}</div></main><SiteFooter/></>
}

export function SimplePage({ type }) {
  const about = type === 'about'
  const title = about ? 'About Events by Somia' : 'Gallery'
  const copy = about ? 'Royal Indian heritage meets modern American luxury. Events by Somia brings thoughtful rental and decor selections to South Asian celebrations and cultural gatherings across the community.' : 'A visual collection of celebration settings, floral details, and the traditions that inspire us.'
  return <><PageHero image={null} eyebrow={about ? 'OUR STORY' : 'COLLECTED MOMENTS'} title={title} intro={copy}/>{about ? <main className="simple-content"><p className="eyebrow eyebrow-dark">OUR APPROACH</p><h2>Rooted in tradition.<br/><em>Personal by nature.</em></h2><p>We work with families and hosts to bring traditions, loved ones, and a personal vision together through thoughtful decor and rental selections. Our work makes space for many South Asian communities and ways of celebrating.</p><a className="button button-wine" href="/contact#enquiry">Begin an enquiry <span>↗</span></a><address><a href="tel:+19544960556">+1 954-496-0556</a><br/><a href="mailto:contact@eventsbysomia.com">contact@eventsbysomia.com</a><br/><a href="https://maps.google.com/?q=9266+Delemar+Ct,+Wellington,+FL+33414" target="_blank" rel="noreferrer">9266 Delemar Ct, Wellington, FL 33414, United States</a></address></main> : <main className="simple-gallery"><a className="button button-wine" href="/gallery">Explore the visual catalogue <span>↗</span></a></main>}<SiteFooter/></>
}
