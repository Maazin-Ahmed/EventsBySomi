import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { celebrations, imageSrcSet, imageUrl } from '../content.js'

export default function Celebrations() {
  const section = useRef(null)
  useEffect(() => {
    const root = section.current
    const media = gsap.matchMedia()
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = root.querySelector('.celebration-track')
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true } })
    })
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.reveal', root).forEach(el => gsap.from(el, { y: 30, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 86%' } }))
    })
    return () => media.revert()
  }, [])
  return <section id="celebrations" className="celebrations-section" ref={section}>
    <div className="section-heading celebration-heading"><div className="reveal"><p className="eyebrow eyebrow-dark">MOMENTS WORTH GATHERING FOR</p><h2>Every reason to<br/><em>come together.</em></h2></div><p className="section-note reveal">Rooted in tradition, shaped around you. We create settings for the milestones and everyday moments that bring your loved ones close.</p></div>
    <div className="celebration-track">
      {celebrations.map((item, i) => <article className="celebration-card" key={item.name}>
        <img src={imageUrl(item.image, 800)} srcSet={imageSrcSet(item.image)} sizes="(max-width: 899px) 80vw, 35vw" alt={`${item.name} celebration decor`} loading="lazy" />
        <div className="celebration-card__shade"/><span className="card-index">{String(i + 1).padStart(2, '0')}</span>
        <div className="celebration-card__copy"><p>{item.local}</p><h3>{item.name}</h3><span>{item.note}</span></div>
      </article>)}
    </div>
    <div className="gallery-progress" aria-hidden="true"><span/> <span>SCROLL TO DISCOVER</span> <span>10 CELEBRATIONS</span></div>
  </section>
}
