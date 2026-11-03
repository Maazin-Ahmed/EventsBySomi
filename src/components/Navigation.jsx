import { useState } from 'react'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const links = [['Celebrations', '/celebrations'], ['Rentals', '/collections'], ['Gallery', '/gallery'], ['About', '/about']]
  return <header className="site-nav">
    <a className="brand-mark" href="/" aria-label="Events by Somia, home"><span className="brand-mark__ornament" aria-hidden="true">✳</span><span>EVENTS <i>BY</i> SOMIA</span></a>
    <nav className={open ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-quote" href="/contact#enquiry" onClick={() => setOpen(false)}>Get a quote <span>↗</span></a>
    </nav>
    <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/></button>
  </header>
}
