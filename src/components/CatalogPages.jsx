import { celebrations, imageSrcSet, imageUrl, rentalGroups } from '../content.js'
import Navigation from './Navigation.jsx'
import { SiteFooter } from './StorySections.jsx'

// Unsplash editorial photography, including subject-matched mandap, haldi, stage, diya, and thali images.
const editorialImages = [
  'photo-1587271636175-90d58cdad458', 'photo-1747041807213-197ed4037279',
  'photo-1780227103127-399b439cdd4a', 'photo-1717011969223-0217a302ec6f',
  'photo-1745573673583-a51f665ae48e', 'photo-1700765020008-7fd77c847f8a',
  'photo-1630764883659-69ddbac02e40', 'photo-1507504031003-b417219a0fde',
  'photo-1519167758481-83f550bb49b3', 'photo-1464366400600-7168b8af9bc3',
]

function PageHero({ image, eyebrow, title, intro, action, palette, crumb = '' }) {
  const crumbHref = crumb === 'Celebrations' ? '/celebrations' : crumb === 'Rentals' ? '/collections' : '/'
  return <section className="inner-hero" style={{ '--hero-image': `url(${imageUrl(image, 2000)})` }}>
    <div className="inner-hero__shade"/><Navigation/>
    <div className="inner-hero__content"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>{crumb && crumb !== title && <><span>/</span><a href={crumbHref}>{crumb}</a></>}<span>/</span><span aria-current="page">{title}</span></nav>
      <p className="eyebrow"><span/>{eyebrow}</p><h1>{title}</h1><p className="inner-hero__intro">{intro}</p>{palette && <p className="palette-note">{palette}</p>}
      <div className="inner-hero__actions"><a className="button button-light" href="#catalogue">{action || 'Explore the Collection'} <span>↓</span></a><a className="button button-outline" href={`/contact?${crumb === 'Celebrations' ? 'event' : 'category'}=${crumb === 'Celebrations' ? (celebrations.find(item => item.name === title)?.slug || '') : (rentalGroups.find(item => item.title === title)?.slug || '')}#enquiry`}>Request a Quote <span>↗</span></a></div>
    </div>
    <a className="inner-hero__scroll" href="#catalogue">DISCOVER <span>↓</span></a>
  </section>
}

function ImageTile({ image, alt, className = '' }) {
  return <figure className={`editorial-tile ${className}`}><img src={imageUrl(image, 1100)} srcSet={imageSrcSet(image)} sizes="(max-width: 700px) 90vw, 42vw" alt={alt} loading="lazy"/><figcaption>{alt}</figcaption></figure>
}

function RelatedCollections({ groups, label = 'Explore the rentals' }) {
  return <section className="related-section"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">{label}</p><h2>Pieces for a gathering<br/><em>made your own.</em></h2></div><div className="related-grid">{groups.map(group => <a className="related-card" key={group.slug} href={`/collections/${group.slug}`}><img src={imageUrl(group.image, 900)} srcSet={imageSrcSet(group.image)} sizes="(max-width: 700px) 85vw, 30vw" alt={`${group.title} rental collection`} loading="lazy"/><span>View collection ↗</span><h3>{group.title}</h3><p>{group.description}</p></a>)}</div></section>
}

function InquiryBanner({ event, category }) {
  const query = event ? `event=${event}` : `category=${category}`
  return <section className="inquiry-banner"><p className="eyebrow">A GATHERING, CONSIDERED</p><h2>Let’s shape a setting<br/><em>around your story.</em></h2><p>Tell us what you’re planning, and our team can help you explore the relevant decor and rental pieces.</p><a className="button button-light" href={`/contact?${query}#enquiry`}>Request a Quote <span>↗</span></a></section>
}

export function CelebrationPage({ item }) {
  const related = rentalGroups.filter(group => item.collections.includes(group.title))
  const base = celebrations.findIndex(entry => entry.slug === item.slug)
  const gallery = [item.image, ...[1, 4, 6].map(offset => editorialImages[(base + offset + 1) % editorialImages.length])]
  return <><PageHero image={item.image} eyebrow="SOUTH ASIAN CELEBRATIONS" title={item.name} intro={item.intro} palette={item.palette} crumb="Celebrations"/>
    <main className="catalog-main" id="catalogue">
      <section className="inspiration-section"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">{item.local.toUpperCase()}</p><h2>Ideas for a day<br/><em>that feels like yours.</em></h2><p>Traditional and contemporary details can come together in a way that reflects your family, community, and celebration.</p></div><div className="editorial-grid editorial-grid--celebration"><ImageTile image={gallery[0]} alt={`${item.name} celebration setting`} className="editorial-tile--large"/><ImageTile image={gallery[1]} alt={`Floral and fabric details for ${item.name}`}/><ImageTile image={gallery[2]} alt={`Seating and gathering inspiration for ${item.name}`}/><ImageTile image={gallery[3]} alt={`A celebratory table setting for ${item.name}`}/></div></section>
      <section className="inspiration-list"><div><p className="eyebrow eyebrow-dark">EVENT INSPIRATION</p><h2>Thoughtful details<br/><em>for gathering.</em></h2></div><ul>{item.inspiration.map(value => <li key={value}>{value}</li>)}</ul></section>
      <RelatedCollections groups={related} label={`Rental ideas for ${item.name.toLowerCase()}`}/>
      <section className="page-gallery"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">A VISUAL GALLERY</p><h2>Tradition with room<br/><em>for your own style.</em></h2></div><div className="gallery-strip">{gallery.slice(1).map((image, index) => <ImageTile key={`${image}-${index}`} image={image} alt={`${item.name} decor inspiration`} className={index === 1 ? 'editorial-tile--tall' : ''}/>)}</div></section>
      <div className="related-inline"><a href="/celebrations">← All celebrations</a><a href="/collections">Browse all rental collections →</a></div>
    </main><InquiryBanner event={item.slug}/><SiteFooter/></>
}

export function CollectionPage({ group }) {
  const itemImages = [group.image, ...editorialImages.filter(image => image !== group.image)]
  const related = rentalGroups.filter(item => item.slug !== group.slug).slice(0, 3)
  return <><PageHero image={group.image} eyebrow="EVENT RENTALS" title={group.title} intro={group.description} crumb="Rentals"/>
    <main className="catalog-main" id="catalogue">
      <section className="inventory-section"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">THE RENTAL CATALOGUE</p><h2>Considered pieces,<br/><em>gathered with care.</em></h2><p>Explore the items in this collection. Rental details and availability are confirmed directly with our team.</p></div>
        <div className="inventory-grid">{group.items.map((item, index) => {
          const image = itemImages[index % itemImages.length]
          return <article className="inventory-card" key={item}><img src={imageUrl(image, 1000)} srcSet={imageSrcSet(image)} sizes="(max-width: 700px) 90vw, 30vw" alt={`${group.title} rental inspiration`} loading="lazy"/><div><p className="eyebrow eyebrow-dark">{group.title}</p><h3>{item}</h3><p>Ask our team about this piece and how it can fit into your celebration setting.</p></div></article>
        })}</div>
      </section>
      <section className="page-gallery"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">INSPIRATION</p><h2>Styled for moments<br/><em>worth gathering for.</em></h2></div><div className="gallery-strip"><ImageTile image={group.image} alt={`${group.title} arranged for a cultural celebration`} className="editorial-tile--tall"/><ImageTile image={itemImages[3]} alt={`${group.title} in an elegant event setting`}/><ImageTile image={itemImages[5]} alt={`${group.title} detail`} /></div></section>
      <RelatedCollections groups={related} label="Related collections"/>
      <div className="related-inline"><a href="/collections">← All rental collections</a><a href="/celebrations">Explore celebrations →</a></div>
    </main><InquiryBanner category={group.slug}/><SiteFooter/></>
}

export function ListingPage({ type }) {
  const isEvents = type === 'celebrations'
  const entries = isEvents ? celebrations : rentalGroups
  const title = isEvents ? 'Celebrations' : 'Rental Collections'
  const intro = isEvents ? 'South Asian celebrations, thoughtfully gathered around your traditions, people, and vision.' : 'Considered pieces for ceremonies, shared meals, and the moments in between.'
  return <><PageHero image={isEvents ? celebrations[0].image : rentalGroups[0].image} eyebrow={isEvents ? 'MOMENTS WORTH GATHERING FOR' : 'GATHERED WITH CARE'} title={title} intro={intro} crumb={isEvents ? 'Celebrations' : 'Rentals'} action="Explore the catalogue"/>
    <main className="catalog-main listing-main" id="catalogue"><div className="catalog-heading"><p className="eyebrow eyebrow-dark">EVENTS BY SOMIA</p><h2>{isEvents ? <>Every reason to<br/><em>come together.</em></> : <>The details that<br/><em>make it yours.</em></>}</h2></div><div className="listing-grid">{entries.map(item => <a className="listing-card" href={isEvents ? `/celebrations/${item.slug}` : `/collections/${item.slug}`} key={item.slug}><img src={imageUrl(item.image, 1100)} srcSet={imageSrcSet(item.image)} sizes="(max-width: 700px) 88vw, 42vw" alt={`${item.name || item.title} ${isEvents ? 'celebration' : 'rental collection'}`} loading="lazy"/><div><p className="eyebrow">{isEvents ? item.local : 'EVENT RENTALS'}</p><h3>{item.name || item.title}</h3><p>{isEvents ? item.note : item.description}</p><span>Explore {isEvents ? 'celebration' : 'collection'} ↗</span></div></a>)}</div></main><SiteFooter/></>
}

export function SimplePage({ type }) {
  const about = type === 'about'
  const title = about ? 'About Events by Somia' : 'Gallery'
  const copy = about ? 'Royal Indian heritage meets modern American luxury. Events by Somia brings thoughtful rental and decor selections to South Asian celebrations and cultural gatherings across the community.' : 'A visual collection of celebration settings, floral details, and the traditions that inspire us.'
  return <><PageHero image={about ? 'photo-1519167758481-83f550bb49b3' : 'photo-1464366400600-7168b8af9bc3'} eyebrow={about ? 'OUR STORY' : 'COLLECTED MOMENTS'} title={title} intro={copy}/>{about ? <main className="simple-content"><p className="eyebrow eyebrow-dark">OUR APPROACH</p><h2>Rooted in tradition.<br/><em>Personal by nature.</em></h2><p>We work with families and hosts to bring traditions, loved ones, and a personal vision together through thoughtful decor and rental selections. Our work makes space for many South Asian communities and ways of celebrating.</p><a className="button button-wine" href="/contact#enquiry">Begin an enquiry <span>↗</span></a><address><a href="tel:+19544960556">+1 954-496-0556</a><br/><a href="mailto:contact@eventsbysomia.com">contact@eventsbysomia.com</a><br/><a href="https://maps.google.com/?q=9266+Delemar+Ct,+Wellington,+FL+33414" target="_blank" rel="noreferrer">9266 Delemar Ct, Wellington, FL 33414, United States</a></address></main> : <main className="simple-gallery"><div className="editorial-grid editorial-grid--celebration">{editorialImages.slice(0, 8).map((image, index) => <ImageTile key={image} image={image} alt="South Asian celebration setting and decor details" className={index % 4 === 0 ? 'editorial-tile--large' : ''}/>)}</div></main>}<SiteFooter/></>
}
