import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../rental/Cart.jsx'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0)
  const { count } = useCart()
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)
  const links = [['Celebrations', '/celebrations'], ['Rentals', '/collections'], ['Gallery', '/gallery'], ['About', '/about'], ['FAQs', '/faq']]
  useEffect(() => {
    let lastY = Math.max(0, window.scrollY)
    let movement = 0
    let idleTimer
    const handleScroll = () => {
      // Clamp elastic overscroll so bouncing at either page edge cannot hide it.
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight))
      const delta = y - lastY
      lastY = y
      setScrolled(y > 0)
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => { movement = 0; setHidden(false) }, 1000)
      if (open || y <= 16 || headerRef.current?.contains(document.activeElement)) {
        movement = 0
        setHidden(false)
        return
      }
      movement = Math.sign(delta) === Math.sign(movement) ? movement + delta : delta
      if (movement >= 12) { setHidden(true); movement = 0 }
      else if (movement <= -4) { setHidden(false); movement = 0 }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.clearTimeout(idleTimer)
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])
  // Escape hero clipping/stacking contexts while keeping every page's shared header.
  return createPortal(<header ref={headerRef} className={`site-nav${scrolled ? ' site-nav--scrolled' : ''}${hidden && !open ? ' site-nav--hidden' : ''}`} onFocusCapture={() => setHidden(false)}>
    <a className="brand-mark" href="/" aria-label="Events by Somia, home"><span className="brand-mark__ornament" aria-hidden="true">✳</span><span>EVENTS <i>BY</i> SOMIA</span></a>
    <nav id="primary-navigation" className={open ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      {links.map(([label, href], index) => <a key={href} href={href} ref={index === 0 ? firstLinkRef : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-cart-cta" href="/cart" onClick={() => setOpen(false)}>Cart ({count})</a>
    </nav>
    <button ref={toggleRef} className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span/><span/></button>
  </header>, document.body)
}
