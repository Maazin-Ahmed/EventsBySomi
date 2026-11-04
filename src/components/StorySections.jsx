import { celebrations, rentalGroups } from '../content.js'

export function Introduction() {
  return <section className="intro-section" id="intro"><div className="intro-seal" aria-hidden="true">✳</div><p className="eyebrow eyebrow-dark">A HERITAGE OF CELEBRATION</p><h2>Old-world soul.<br/><em>Personal by nature.</em></h2><p className="intro-body">At Events by Somia, South Asian celebrations are honored with thoughtful design and a personal touch. From the first gathering to the final detail, we help bring your traditions, loved ones, and vision together in a setting that feels unmistakably yours.</p><a className="text-link" href="#approach">Our way of bringing it together <span>↓</span></a></section>
}

export function Process() {
  const steps = [['Listen', 'Tell us about your celebration, your traditions, and what you want guests to feel.'], ['Shape', 'We bring your ideas together with decor, mandap, and rental selections.'], ['Gather', 'Your setting comes together around the moments you are there to share.']]
  return <section className="process-section" id="approach"><div className="process-top"><p className="eyebrow">A CONSIDERED APPROACH</p><h2>From first thought<br/>to <em>gathered together.</em></h2><p>A few thoughtful steps make room for the celebration you have imagined.</p></div><div className="process-steps">{steps.map(([name, text]) => <article key={name}><div className="step-line"/><h3>{name}</h3><p>{text}</p></article>)}</div></section>
}

export function Gallery() {
  return <section className="gallery-section gallery-section--teaser" id="gallery"><div className="gallery-head"><p className="eyebrow eyebrow-dark">COLLECTED MOMENTS</p><h2>A feeling, in <em>full bloom.</em></h2><p>A visual reference of ceremony settings, cultural details, and rental inspiration to help you shape your own gathering.</p><a className="button button-wine" href="/gallery">Explore the Gallery <span>↗</span></a></div></section>
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top">
      <div className="footer-brand-block">
        <a className="brand-mark brand-mark--footer" href="/" aria-label="Events by Somia, home"><span className="brand-mark__ornament" aria-hidden="true">✳</span><span>EVENTS <i>BY</i> SOMIA</span></a>
        <p>Thoughtful decor and rental pieces for South Asian celebrations and cultural gatherings.</p>
      </div>
      <a className="footer-cta" href="/contact#enquiry">Request a Quote <span>↗</span></a>
    </div>
    <div className="footer-link-columns">
      <nav className="footer-link-group" aria-label="Website links"><h3>Explore</h3><a href="/about">About</a><a href="/faq">FAQs</a><a href="/gallery">Gallery</a><a href="/contact">Contact</a></nav>
      <nav className="footer-link-group footer-link-group--celebrations" aria-label="Celebration pages"><h3>Celebrations</h3>{celebrations.map(item => <a href={`/celebrations/${item.slug}`} key={item.slug}>{item.name}</a>)}</nav>
      <nav className="footer-link-group" aria-label="Rental collections"><h3>Rental collections</h3>{rentalGroups.map(item => <a href={`/collections/${item.slug}`} key={item.slug}>{item.title}</a>)}</nav>
      <div className="footer-link-group footer-contact"><h3>Contact</h3><a href="tel:+19544960556">+1 954-496-0556</a><a href="mailto:contact@eventsbysomia.com">contact@eventsbysomia.com</a><a href="https://wa.me/19544960556" target="_blank" rel="noreferrer">WhatsApp</a><a href="https://maps.google.com/?q=9266+Delemar+Ct,+Wellington,+FL+33414" target="_blank" rel="noreferrer">9266 Delemar Ct<br/>Wellington, FL 33414<br/>United States</a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Events by Somia</span><span>Rooted in tradition. Designed for your story.</span><div><a href="/privacy-policy">Privacy policy</a><a href="/terms">Terms & conditions</a></div></div>
  </footer>

}
