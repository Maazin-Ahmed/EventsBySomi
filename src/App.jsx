import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Hero from './components/Hero.jsx'
import Celebrations from './components/Celebrations.jsx'
import { MandapShowcase, RentalCollections, DecorativeDetails } from './components/Showcases.jsx'
import { Introduction, Process, Gallery, SiteFooter } from './components/StorySections.jsx'
import Enquiry from './components/Enquiry.jsx'
import Navigation from './components/Navigation.jsx'
import GalleryPage from './components/GalleryPage.jsx'
import { CelebrationPage, CollectionPage, ListingPage, SimplePage } from './components/CatalogPages.jsx'
import { celebrations, rentalGroups } from './content.js'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const celebrationMatch = path.match(/^\/celebrations\/([^/]+)$/)
  const collectionMatch = path.match(/^\/collections\/([^/]+)$/)
  const celebration = celebrationMatch && celebrations.find(item => item.slug === celebrationMatch[1])
  const collection = collectionMatch && rentalGroups.find(item => item.slug === collectionMatch[1])
  useEffect(() => {
    const titles = {
      '/': 'Events by Somia — South Asian celebrations, thoughtfully designed',
      '/celebrations': 'Celebrations — Events by Somia',
      '/collections': 'Rental Collections — Events by Somia',
      '/gallery': 'Gallery Inspiration — Events by Somia', '/about': 'About — Events by Somia', '/contact': 'Request a Quote — Events by Somia',
    }
    const descriptions = {
      '/celebrations': 'Explore weddings, Mehendi, Haldi, Sangeet, and other South Asian celebrations with Events by Somia.',
      '/collections': 'Explore seating, tables, linens, mandap and stage, decor, and serveware rentals from Events by Somia.',
      '/gallery': 'Editorial inspiration for South Asian celebrations, ceremony settings, event decor, and rental collections. Images are not a portfolio of Events by Somia client work.',
      '/about': 'Learn about Events by Somia, bringing thoughtful rental and decor selections to South Asian celebrations in the United States.',
      '/contact': 'Tell Events by Somia about your celebration and request a quote for decor and event rentals.',
    }
    const page = celebration || collection
    document.title = page ? `${page.name || page.title} — Events by Somia` : titles[path] || 'Events by Somia'
    const description = page?.intro || page?.description || descriptions[path] || 'Thoughtfully designed South Asian celebrations, decor, and event rentals by Events by Somia in Wellington, Florida.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [path, celebration, collection])
  useEffect(() => {
    if (path === '/contact' && window.location.hash === '#enquiry') {
      window.requestAnimationFrame(() => document.getElementById('enquiry')?.scrollIntoView({ block: 'start' }))
    }
  }, [path])
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)')
    let lenis
    const tick = time => lenis?.raf(time * 1000)
    const sync = () => {
      if (query.matches && !lenis) {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: true })
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
      } else if (!query.matches && lenis) {
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenis = undefined
      }
    }
    sync()
    query.addEventListener('change', sync)
    return () => {
      query.removeEventListener('change', sync)
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy() }
    }
  }, [])
  if (celebration) return <CelebrationPage item={celebration}/>
  if (collection) return <CollectionPage group={collection}/>
  if (path === '/celebrations' || path === '/collections') return <ListingPage type={path.slice(1)}/>
  if (path === '/gallery') return <GalleryPage/>
  if (path === '/about') return <SimplePage type="about"/>
  if (path === '/contact') return <><section className="contact-intro"><Navigation/><p className="eyebrow"><span/>EVENTS BY SOMIA</p><h1>Let’s begin<br/><em>with your story.</em></h1><p>Tell us a little about the celebration you have in mind.</p></section><Enquiry/><SiteFooter/></>
  return <><Hero/><main><Introduction/><Celebrations/><MandapShowcase/><RentalCollections/><DecorativeDetails/><Process/><Gallery/><Enquiry/></main><SiteFooter/></>
}
