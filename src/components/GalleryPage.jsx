import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { imageSrcSet, imageUrl } from '../content.js'
import { galleryCategories, galleryImages } from '../imageManifest.js'
import { PageHero } from './CatalogPages.jsx'
import { SiteFooter } from './StorySections.jsx'

export default function GalleryPage() {
  const [category, setCategory] = useState('All')
  const [activeIndex, setActiveIndex] = useState(null)
  const galleryRef = useRef(null)
  const closeButtonRef = useRef(null)
  const returnFocusRef = useRef(null)

  const filteredImages = category === 'All'
    ? galleryImages
    : galleryImages.filter(item => item.categories.includes(category))
  const isOpen = activeIndex !== null

  useEffect(() => {
    const root = galleryRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const scope = gsap.context(() => {
      gsap.fromTo('.gallery-shot', { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: .45,
        stagger: .045,
        ease: 'power2.out',
        clearProps: 'transform',
      })
    }, root)
    return () => scope.revert()
  }, [category])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const close = () => setActiveIndex(null)
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex(index => (index - 1 + filteredImages.length) % filteredImages.length)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex(index => (index + 1) % filteredImages.length)
      } else if (event.key === 'Tab') {
        const dialog = document.querySelector('.gallery-lightbox')
        const focusable = [...dialog.querySelectorAll('button:not([disabled])')]
        const first = focusable[0]
        const last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusRef.current?.focus?.()
    }
  }, [isOpen, filteredImages.length])

  const openImage = index => {
    returnFocusRef.current = document.activeElement
    setActiveIndex(index)
  }
  const closeImage = () => setActiveIndex(null)
  const move = direction => setActiveIndex(index => (index + direction + filteredImages.length) % filteredImages.length)
  const activeImage = isOpen ? filteredImages[activeIndex] : null

  return <>
    <PageHero
      image={null}
      eyebrow="EDITORIAL INSPIRATION"
      title="Gallery"
      intro="A considered collection of ceremony settings, color, flowers, and thoughtful details to help shape your own celebration."
      crumb="Gallery"
      quoteHref="/contact?origin=gallery#enquiry"
    />
    <main className="gallery-page" id="catalogue">
      <section className="gallery-editorial-intro" aria-labelledby="gallery-intro-title">
        <div>
          <p className="eyebrow eyebrow-dark">A VISUAL REFERENCE</p>
          <h2 id="gallery-intro-title">Ideas for the moments<br/><em>you’ll make your own.</em></h2>
        </div>
        <p>These photographs are editorial inspiration, not a portfolio of events hosted by Events by Somia. Explore settings and details that may help you describe the celebration you have in mind.</p>
      </section>

      <nav className="gallery-filters" aria-label="Filter gallery inspiration by category">
        <div className="gallery-filters__track" role="group" aria-label="Gallery categories">
          {galleryCategories.map(item => <button
            type="button"
            key={item}
            className={category === item ? 'gallery-filter gallery-filter--active' : 'gallery-filter'}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >{item}</button>)}
        </div>
      </nav>

      <section className="gallery-masonry" ref={galleryRef} aria-label={`${category === 'All' ? 'All' : category} editorial inspiration`}>
        {filteredImages.map((item, index) => <figure className="gallery-shot" key={item.id}>
          <button type="button" className="gallery-shot__button" onClick={() => openImage(index)} aria-label={`Open larger image: ${item.alt}`}>
            <img
              src={imageUrl(item.image, 1000)}
              srcSet={imageSrcSet(item.image)}
              sizes="(max-width: 600px) 92vw, (max-width: 950px) 45vw, 31vw"
              alt={item.alt}
              width={item.sourceSample.width}
              height={item.sourceSample.height}
              style={{ objectPosition: item.objectPosition, aspectRatio: item.aspectRatio }}
              loading="lazy"
            />
            <span className="gallery-shot__caption"><span>{item.category}</span><span>{item.caption}</span></span>
          </button>
        </figure>)}
      </section>

      <section className="gallery-enquiry">
        <p className="eyebrow">WHEN AN IDEA FEELS RIGHT</p>
        <h2>Let’s bring your<br/><em>gathering together.</em></h2>
        <a className="button button-light" href="/contact?origin=gallery#enquiry">Request a Quote <span>↗</span></a>
      </section>
    </main>

    {isOpen && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onMouseDown={event => { if (event.target === event.currentTarget) closeImage() }}>
      <button ref={closeButtonRef} type="button" className="gallery-lightbox__close" onClick={closeImage} aria-label="Close image viewer">×</button>
      <button type="button" className="gallery-lightbox__control gallery-lightbox__previous" onClick={() => move(-1)} aria-label="Previous image">‹</button>
      <figure className="gallery-lightbox__figure" key={activeImage.id}>
        <img src={imageUrl(activeImage.image, 2200)} srcSet={imageSrcSet(activeImage.image)} sizes="100vw" alt={activeImage.alt} width={activeImage.sourceSample.width} height={activeImage.sourceSample.height}/>
        <figcaption><span>{activeImage.category}</span>{activeImage.caption}</figcaption>
      </figure>
      <button type="button" className="gallery-lightbox__control gallery-lightbox__next" onClick={() => move(1)} aria-label="Next image">›</button>
    </div>}
    <SiteFooter/>
  </>
}
