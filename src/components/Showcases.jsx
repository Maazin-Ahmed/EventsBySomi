import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { rentalGroups, imageSrcSet, imageUrl } from '../content.js'

export function MandapShowcase() {
  const ref = useRef(null)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const scope = gsap.context(() => {
      gsap.fromTo('.mandap-image', { scale: 1.17 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.mandap-section', start: 'top bottom', end: 'center center', scrub: true } })
      gsap.from('.mandap-copy > *', { y: 30, opacity: 0, stagger: .12, scrollTrigger: { trigger: '.mandap-section', start: 'top 60%' } })
    }, ref)
    return () => scope.revert()
  }, [])
  return <section className="mandap-section" ref={ref}>
    <div className="mandap-image-wrap"><img className="mandap-image" src={imageUrl('photo-1519167758481-83f550bb49b3', 1400)} srcSet={imageSrcSet('photo-1519167758481-83f550bb49b3')} sizes="(max-width: 899px) 86vw, 58vw" alt="Ivory and champagne wedding mandap with a floral backdrop" loading="lazy" /><div className="mandap-image-shade"/><span className="mandap-stamp">THE WEDDING EDITION<br/>A CANOPY FOR YOUR STORY</span><span className="image-corner image-corner--tl"/><span className="image-corner image-corner--br"/></div>
    <div className="mandap-copy"><p className="eyebrow">A PLACE FOR YOUR PROMISE</p><h2>Under one<br/>beautiful <em>canopy.</em></h2><p>A mandap is more than a setting. It is the heart of the ceremony. Bring together pillars, arches, floral backdrops, and fabric details in a space that feels deeply personal.</p><a className="text-link" href="#enquiry">Enquire about a mandap <span>↗</span></a></div>
    <div className="mandap-detail mandap-detail--one"><span>01</span> PILLARS & ARCHES</div><div className="mandap-detail mandap-detail--two"><span>02</span> FLORAL BACKDROPS</div>
  </section>
}

export function RentalCollections() {
  const ref = useRef(null)
  const [first, ...rest] = rentalGroups
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
    <div className="rental-intro"><p className="eyebrow">GATHERED WITH CARE</p><h2>The details<br/>that make it <em>yours.</em></h2><p>Considered pieces for a beautifully composed celebration.</p><span className="rental-index">COLLECTIONS / 06</span></div>
    <div className="rental-track">
      <article className="rental-panel rental-panel--lead"><img src={imageUrl('photo-1464366400600-7168b8af9bc3', 800)} srcSet={imageSrcSet('photo-1464366400600-7168b8af9bc3')} sizes="(max-width: 899px) 84vw, 470px" alt="An elegant event table setting with warm candlelight" loading="lazy"/><div><span>01 / {first.title.toUpperCase()}</span><h3>{first.title}</h3><p>{first.items.join(' · ')}</p></div></article>
      {rest.map((group, i) => <article className={`rental-panel rental-panel--${i % 2 ? 'sand' : 'wine'}`} key={group.title}><div className="rental-panel__ornament">✳</div><span>0{i + 2} / COLLECTION</span><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}
    </div>
  </section>
}

export function DecorativeDetails() {
  const items = [
    ['Torans', 'A welcoming detail for an entrance or ceremony.', 'photo-1600210492486-724fe5c67fb0'],
    ['Diyas & urlis', 'Traditional accents that bring warmth to a gathering.', 'photo-1603006905003-be475563bc59'],
    ['Garlands', 'Marigold and rose garlands for meaningful moments.', 'photo-1519741497674-611481863552'],
    ['Fanoos & kalash', 'A considered finishing touch for your setting.', 'photo-1519167758481-83f550bb49b3'],
  ]
  return <section className="details-section"><div className="details-heading"><p className="eyebrow eyebrow-dark">A CLOSER LOOK</p><h2>Little rituals.<br/><em>Lasting beauty.</em></h2></div><div className="details-grid">{items.map(([title, text, image], i) => <article className="detail-card" key={title}><div className="detail-image"><img src={imageUrl(image, 800)} srcSet={imageSrcSet(image)} sizes="(max-width: 600px) 43vw, 21vw" alt={`${title} decor detail`} loading="lazy"/><span>0{i + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}
