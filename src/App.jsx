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
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
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
  return <><Hero/><main><Introduction/><Celebrations/><MandapShowcase/><RentalCollections/><DecorativeDetails/><Process/><Gallery/><Enquiry/></main><SiteFooter/></>
}
