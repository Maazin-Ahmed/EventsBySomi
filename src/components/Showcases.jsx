import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { rentalGroups, imageSrcSet, imageUrl } from '../content.js'
import { imageById } from '../imageManifest.js'

export function MandapShowcase() {
  const ref = useRef(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const scope = gsap.context(() => {
      gsap.fromTo('.mandap-image', { scale: 1.17 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'center center', scrub: true } })
      gsap.from('.mandap-copy > *', { y: 30, opacity: 0, stagger: .12, scrollTrigger: { trigger: section, start: 'top 60%' } })
    }, section)
    return () => scope.revert()
  }, [])
  return <section className="mandap-section" ref={ref}>
    <div className="mandap-image-wrap"><img className="mandap-image" src={imageUrl('photo-1772127822552-ce9ef537bdcf', 1400)} srcSet={imageSrcSet('photo-1772127822552-ce9ef537bdcf')} sizes="(max-width: 899px) 86vw, 58vw" width={imageById['photo-1772127822552-ce9ef537bdcf'].sourceSample.width} height={imageById['photo-1772127822552-ce9ef537bdcf'].sourceSample.height} style={{ objectPosition: imageById['photo-1772127822552-ce9ef537bdcf'].objectPosition }} alt="A floral wedding arch and ceremony aisle set beneath the open sky" loading="lazy" /><div className="mandap-image-shade"/><span className="mandap-stamp">THE WEDDING EDITION<br/>A CANOPY FOR YOUR STORY</span><span className="image-corner image-corner--tl"/><span className="image-corner image-corner--br"/></div>
    <div className="mandap-copy"><p className="eyebrow">A PLACE FOR YOUR PROMISE</p><h2>Under one<br/>beautiful <em>canopy.</em></h2><p>A mandap is more than a setting. It is the heart of the ceremony. Bring together pillars, arches, floral backdrops, and fabric details in a space that feels deeply personal.</p><a className="text-link" href="#enquiry">Enquire about a mandap <span>↗</span></a></div>
    <div className="mandap-detail mandap-detail--one">PILLARS & ARCHES</div><div className="mandap-detail mandap-detail--two">FLORAL BACKDROPS</div>
  </section>
}

export function RentalCollections() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    const media = gsap.matchMedia()
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = root.querySelector('.rental-track')
      gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 120), ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 120}`, scrub: 1, pin: true, invalidateOnRefresh: true } })
    })
    return () => media.revert()
  }, [])
  return <section className="rental-section" id="rentals" ref={ref}>
    <div className="rental-intro"><p className="eyebrow">GATHERED WITH CARE</p><h2>The details<br/>that make it <em>yours.</em></h2><p>Considered pieces for a beautifully composed celebration.</p><a className="text-link" href="/collections">Explore all rentals <span>↗</span></a></div>
    <div className="rental-track">
      {rentalGroups.map((group, i) => <a href={`/collections/${group.slug}`} className={`rental-panel ${i === 0 ? 'rental-panel--lead' : `rental-panel--${i % 2 ? 'wine' : 'sand'}`}${group.slug === 'serveware' ? ' rental-panel--text' : ''}`} key={group.slug}>
        {group.slug !== 'serveware' && <img src={imageUrl(group.image, 800)} srcSet={imageSrcSet(group.image)} sizes="(max-width: 899px) 84vw, 470px" width={imageById[group.image].sourceSample.width} height={imageById[group.image].sourceSample.height} style={{ objectPosition: imageById[group.image].objectPosition }} alt={`${group.title} event rental inspiration`} loading="lazy"/>}
        <div className="rental-panel__copy"><span>EXPLORE RENTALS</span><h3>{group.title}</h3><p>{group.items.join(' · ')}</p></div>
      </a>)}
    </div>
  </section>
}

export function DecorativeDetails() {
  const items = [
    ['Torans', 'A welcoming detail for an entrance or ceremony.'],
    ['Diyas & urlis', 'Traditional accents that bring warmth to a gathering.'],
    ['Garlands', 'Marigold and rose garlands for meaningful moments.'],
    ['Fanoos & kalash', 'A considered finishing touch for your setting.'],
  ]
  return <section className="details-section"><div className="details-heading"><p className="eyebrow eyebrow-dark">A CLOSER LOOK</p><h2>Little rituals.<br/><em>Lasting beauty.</em></h2></div><div className="details-grid">{items.map(([title, text]) => <article className="detail-card detail-card--text" key={title}><div className="detail-image" aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}
