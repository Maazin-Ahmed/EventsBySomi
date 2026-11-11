import { lazy, Suspense, useEffect } from 'react'
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
import { CelebrationPage, CollectionPage, ListingPage } from './components/CatalogPages.jsx'
import { celebrations, rentalGroups } from './content.js'
import { applyPageSeo } from './seo.js'
import './styles.css'
import { CartProvider, useCart } from './rental/Cart.jsx'
import { CartPage, QuotePage, ConfirmationPage, RentalProcess } from './rental/Pages.jsx'

const InfoPage = lazy(() => import('./components/InfoPages.jsx'))
gsap.registerPlugin(ScrollTrigger)

function AppContent() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const celebrationMatch = path.match(/^\/celebrations\/([^/]+)$/)
  const collectionMatch = path.match(/^\/collections\/([^/]+)$/)
  const celebration = celebrationMatch && celebrations.find(item => item.slug === celebrationMatch[1])
  const collection = collectionMatch && rentalGroups.find(item => item.slug === collectionMatch[1])
  useEffect(() => {
    applyPageSeo(path)
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
  if (path === '/cart') return <CartPage/>
  if (path === '/request-quote') return <QuotePage/>
  if (path === '/request-confirmation') return <ConfirmationPage/>
  if (path === '/collections') return <><ListingPage type="collections"/><RentalProcess/></>
  if (celebration) return <CelebrationPage item={celebration}/>
  if (collection) return <CollectionPage group={collection}/>
  if (path === '/celebrations' || path === '/collections') return <ListingPage type={path.slice(1)}/>
  if (path === '/gallery') return <GalleryPage/>
  if (path === '/about') return <Suspense fallback={<div className="page-loading" role="status">Loading page…</div>}><InfoPage type="about"/></Suspense>
  if (path === '/faq') return <Suspense fallback={<div className="page-loading" role="status">Loading page…</div>}><InfoPage type="faq"/></Suspense>
  if (path === '/privacy-policy') return <Suspense fallback={<div className="page-loading" role="status">Loading page…</div>}><InfoPage type="privacy"/></Suspense>
  if (path === '/terms') return <Suspense fallback={<div className="page-loading" role="status">Loading page…</div>}><InfoPage type="terms"/></Suspense>
  if (path === '/contact') return <><section className="contact-intro"><Navigation/><p className="eyebrow"><span/>EVENTS BY SOMIA</p><h1>Let’s begin<br/><em>with your story.</em></h1><p>Tell us a little about the celebration you have in mind.</p></section><Enquiry/><SiteFooter/></>
  return <><Hero/><main><Introduction/><Celebrations/><MandapShowcase/><RentalCollections/><DecorativeDetails/><Process/><Gallery/><Enquiry/></main><SiteFooter/></>
}

export default function App() { return <CartProvider><AppContent/></CartProvider> }
