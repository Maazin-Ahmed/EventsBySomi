import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Navigation from './Navigation.jsx'
import { imageSrcSet, imageUrl } from '../content.js'

export default function Hero() {
  const root = useRef(null)
  useEffect(() => {
    const section = root.current
    if (!section) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scope = gsap.context(() => {
      if (!reduced) {
        gsap.from('.hero-copy > *', { y: 32, opacity: 0, duration: 1, stagger: .13, ease: 'power3.out', delay: .15 })
        gsap.to('.hero-image', { yPercent: 16, scale: 1.12, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } })
        gsap.from('.hanging-light', { y: -50, opacity: 0, duration: 1.3, ease: 'power2.out', delay: .5 })
      }
    }, root)
    return () => scope.revert()
  }, [])
  return <section className="hero" id="home" ref={root}>
    <div className="hero-photo"><img className="hero-image" src={imageUrl('photo-1519741497674-611481863552', 1400)} srcSet={imageSrcSet('photo-1519741497674-611481863552')} sizes="100vw" alt="An elegant wedding reception set for an evening celebration" fetchPriority="high" /></div>
    <div className="hero-overlay" />
    <Navigation />
      <svg className="hanging-light" aria-hidden="true" viewBox="0 0 150 310" fill="none">
        <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
          <path d="M75 0v66M69 14h12M70 30h10M71 46h8M75 66l-22 18M75 66l22 18M53 84l-17 30M97 84l17 30M75 66v24" />
          <path d="M53 84c4 10 10 15 22 15s18-5 22-15M36 114c8 5 19 7 39 7s31-2 39-7M44 121c1 20 12 34 31 37 19-3 30-17 31-37M50 126c7 6 15 9 25 9s18-3 25-9M56 149c5 11 11 18 19 21 8-3 14-10 19-21M65 159c0 18 4 29 10 39 6-10 10-21 10-39" />
          <path d="M36 114l-4 18 10 6 4-13M114 114l4 18-10 6-4-13M47 127l-10 17 12 7 6-13M103 127l10 17-12 7-6-13M63 158l-8 18 11 5 4-10M87 158l8 18-11 5-4-10" />
          <path d="M28 140l-4 8m6-3-5 8m99-13 4 8m-6-3 5 8M48 170l-5 7m59-7 5 7M71 202v23m8-23v23" />
          <path d="M24 148l-3 13 6 8 5-8-3-13M126 148l3 13-6 8-5-8 3-13M42 178l-3 10 7 8 5-9-4-9M108 178l4 10-7 8-5-9 4-9M75 225c-8 9-11 17 0 25 11-8 8-16 0-25Z" />
          <path d="M75 77c-4 5-4 9 0 13 4-4 4-8 0-13ZM46 109c-4 4-4 8 0 12 4-4 4-8 0-12ZM104 109c-4 4-4 8 0 12 4-4 4-8 0-12ZM59 145c-3 4-3 7 0 10 3-3 3-6 0-10ZM91 145c-3 4-3 7 0 10 3-3 3-6 0-10Z" />
        </g>
        <g fill="currentColor" opacity=".76"><path d="M75 259c-3 5-5 8-5 11a5 5 0 0 0 10 0c0-3-2-6-5-11ZM24 176c-3 4-4 7-4 9a4 4 0 0 0 8 0c0-2-1-5-4-9ZM126 176c-3 4-4 7-4 9a4 4 0 0 0 8 0c0-2-1-5-4-9ZM44 200c-3 4-4 7-4 9a4 4 0 0 0 8 0c0-2-1-5-4-9ZM106 200c-3 4-4 7-4 9a4 4 0 0 0 8 0c0-2-1-5-4-9Z"/></g>
      </svg>
    <div className="hero-copy">
      <p className="eyebrow"><span/> SOUTH ASIAN CELEBRATIONS, THOUGHTFULLY DESIGNED</p>
      <h1>Where tradition<br/>becomes <em>your story.</em></h1>
      <p className="hero-lede">A gathering of color, ritual, and the people who make it yours.</p>
      <a className="button button-light" href="#celebrations">Explore our celebrations <span>↓</span></a>
    </div>
  </section>
}
