import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Navigation from './Navigation.jsx'
import { imageSrcSet, imageUrl } from '../content.js'

export default function Hero() {
  const root = useRef(null)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scope = gsap.context(() => {
      if (!reduced) {
        gsap.from('.hero-copy > *', { y: 32, opacity: 0, duration: 1, stagger: .13, ease: 'power3.out', delay: .15 })
        gsap.to('.hero-image', { yPercent: 16, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
        gsap.from('.hanging-light', { y: -50, opacity: 0, duration: 1.3, ease: 'power2.out', delay: .5 })
      }
    }, root)
    return () => scope.revert()
  }, [])
  return <section className="hero" id="home" ref={root}>
    <div className="hero-photo"><img className="hero-image" src={imageUrl('photo-1519741497674-611481863552', 1400)} srcSet={imageSrcSet('photo-1519741497674-611481863552')} sizes="100vw" alt="An elegant wedding reception set for an evening celebration" fetchPriority="high" /></div>
    <div className="hero-overlay" />
    <Navigation />
    <div className="hanging-light" aria-hidden="true"><span className="light-chain"/><span className="light-top"/><span className="light-bowl"/><span className="light-drop"/></div>
    <div className="hero-copy">
      <p className="eyebrow"><span/> INDIAN CELEBRATIONS, THOUGHTFULLY DESIGNED</p>
      <h1>Where tradition<br/>becomes <em>your story.</em></h1>
      <p className="hero-lede">A gathering of color, ritual, and the people who make it yours.</p>
      <a className="button button-light" href="#celebrations">Explore our celebrations <span>↓</span></a>
    </div>
    <div className="hero-caption"><span>01 / A celebration in every detail</span><span>EVENTS BY SOMI · EST. WITH INTENTION</span></div>
    <a className="hero-scroll" href="#intro" aria-label="Scroll to introduction">SCROLL <span>↓</span></a>
  </section>
}
