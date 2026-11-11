import { useEffect, useRef, useState } from 'react'
import { useCart } from '../rental/Cart.jsx'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)
  const links = [['Celebrations', '/celebrations'], ['Rentals', '/collections'], ['Gallery', '/gallery'], ['About', '/about'], ['FAQs', '/faq']]
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
  return <header className="site-nav">
    <a className="brand-mark" href="/" aria-label="Events by Somia, home"><span className="brand-mark__ornament" aria-hidden="true">✳</span><span>EVENTS <i>BY</i> SOMIA</span></a>
    <nav id="primary-navigation" className={open ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      {links.map(([label, href], index) => <a key={href} href={href} ref={index === 0 ? firstLinkRef : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-cart-cta" href="/cart" onClick={() => setOpen(false)}>Cart ({count})</a>
    </nav>
    <button ref={toggleRef} className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span/><span/></button>
  </header>
}
