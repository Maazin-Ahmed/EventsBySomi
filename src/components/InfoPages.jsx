import { PageHero } from './CatalogPages.jsx'
import { SiteFooter } from './StorySections.jsx'
import { faqGroups, privacySections, termsSections } from '../pageContent.js'
import { imageAssignments } from '../imageManifest.js'

function ContentSection({ eyebrow, title, children, className = '' }) {
  return <section className={`info-section ${className}`} aria-labelledby={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-heading`}>
    {eyebrow && <p className="eyebrow eyebrow-dark">{eyebrow}</p>}
    <h2 id={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-heading`}>{title}</h2>
    {children}
  </section>
}

function ExploreLinks() {
  return <ContentSection eyebrow="FIND YOUR STARTING POINT" title="Explore what we offer" className="about-explore">
    <div className="about-explore__links">
      <a href="/celebrations"><span>Discover</span><strong>Celebrations</strong><i aria-hidden="true">↗</i></a>
      <a href="/collections"><span>Browse</span><strong>Rental Collections</strong><i aria-hidden="true">↗</i></a>
      <a href="/gallery"><span>Gather inspiration</span><strong>Gallery</strong><i aria-hidden="true">↗</i></a>
    </div>
  </ContentSection>
}

function EnquiryCallout({ title = 'A celebration, shaped around you.' }) {
  return <section className="info-callout">
    <p className="eyebrow">LET’S BEGIN WITH YOUR IDEAS</p>
    <h2>{title}</h2>
    <p>Share what you are planning and the details that matter to you.</p>
    <a className="button button-light" href="/contact#enquiry">Request a Quote <span aria-hidden="true">↗</span></a>
  </section>
}

function legalContactLinks(text) {
  return text.split(/(contact@eventsbysomia\.com|\+1 954-496-0556)/g).map((part, index) => {
    if (part === 'contact@eventsbysomia.com') return <a href="mailto:contact@eventsbysomia.com" key={index}>{part}</a>
    if (part === '+1 954-496-0556') return <a href="tel:+19544960556" key={index}>{part}</a>
    return part
  })
}

export function AboutPage() {
  return <>
    <PageHero image={imageAssignments.aboutPage} eyebrow="OUR PHILOSOPHY" title="About us" intro="Royal Indian heritage meets modern American luxury. Events by Somia brings thoughtful decor and rental selections to South Asian celebrations and cultural gatherings." crumb="About us" quoteHref="/contact#enquiry" action="Our approach"/>
    <main className="info-page about-page" id="catalogue">
      <ContentSection eyebrow="ROOTED IN TRADITION. PERSONAL BY NATURE." title="A setting should feel like it belongs to you." className="about-philosophy">
        <div className="info-copy-columns">
          <p>Celebrations carry the stories, rituals, and people that matter to us. Our approach begins by listening to what your gathering means, then considering how its setting can reflect that meaning.</p>
          <p>We bring traditional references and contemporary event design into conversation through thoughtful details, beautifully composed spaces, and room for personal expression. The goal is a celebration that feels considered, welcoming, and true to your vision.</p>
        </div>
      </ContentSection>
      <ContentSection eyebrow="A CONSIDERED APPROACH" title="From first conversation to a clear direction" className="about-approach">
        <div className="about-approach__steps">
          <article><h3>Understand the celebration</h3><p>Share the occasion, the traditions you want to honor, and what you hope the space will feel like.</p></article>
          <article><h3>Explore the details</h3><p>Discuss decor, furniture, linens, and rental requirements that could support your plans.</p></article>
          <article><h3>Shape the aesthetic</h3><p>Talk through colors, materials, floral direction, and the balance of traditional and contemporary elements.</p></article>
          <article><h3>Coordinate the enquiry</h3><p>Share the event date, location, and practical requirements so the team can respond to your enquiry.</p></article>
        </div>
      </ContentSection>
      <ExploreLinks/>
      <EnquiryCallout title="Let’s begin with your story."/>
    </main>
    <SiteFooter/>
  </>
}

export function FaqPage() {
  return <>
    <PageHero image={null} eyebrow="A FEW HELPFUL DETAILS" title="Frequently asked questions" intro="Learn what to expect when exploring celebrations, rental collections, and an enquiry with Events by Somia." crumb="Frequently asked questions" quoteHref="/contact#enquiry" action="Browse collections"/>
    <main className="info-page faq-page" id="catalogue">
      <div className="faq-intro"><p>Every celebration has its own requirements. These answers explain how to begin; the team can discuss availability and event-specific arrangements with you directly.</p><a href="/contact#enquiry">Ask us about your event <span aria-hidden="true">↗</span></a></div>
      {faqGroups.map((group, groupIndex) => <section className="faq-group" key={group.title} aria-labelledby={`faq-${group.title.toLowerCase().replace(/\s+/g, '-')}`}>
        <h2 id={`faq-${group.title.toLowerCase().replace(/\s+/g, '-')}`}>{group.title}</h2>
        <div className="faq-list">{group.questions.map(([question, answer], questionIndex) => {
          const answerId = `faq-answer-${groupIndex}-${questionIndex}`
          const questionId = `faq-question-${groupIndex}-${questionIndex}`
          return <details className="faq-item" key={question} onToggle={event => event.currentTarget.querySelector('summary')?.setAttribute('aria-expanded', String(event.currentTarget.open))}>
          <summary id={questionId} aria-controls={answerId} aria-expanded="false" onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              const disclosure = event.currentTarget.parentElement
              disclosure.open = !disclosure.open
            }
          }}><h3>{question}</h3><span className="faq-toggle" aria-hidden="true"/></summary>
            <div className="faq-answer" id={answerId} role="region" aria-labelledby={questionId}><p>{answer}</p></div>
          </details>
        })}</div>
      </section>)}
      <EnquiryCallout title="Have a question about your celebration?"/>
    </main>
    <SiteFooter/>
  </>
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'
  const sections = isPrivacy ? privacySections : termsSections
  const intro = isPrivacy
    ? 'A clear explanation of the information collected through this website and how an enquiry is handled.'
    : 'The terms for using this website and exploring its celebration inspiration and rental catalogue.'
  return <>
    <PageHero image={null} eyebrow="WEBSITE INFORMATION" title={title} intro={intro} crumb={title} quoteHref="/contact#enquiry" action="Contact us"/>
    <main className="info-page legal-page" id="catalogue">
      <p className="legal-updated">Website information for Events by Somia</p>
      {sections.map((section, index) => <section className="legal-section" key={section.title} aria-labelledby={`legal-section-${index}`}>
        <h2 id={`legal-section-${index}`}>{section.title}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph}>{legalContactLinks(paragraph)}</p>)}
      </section>)}
      <p className="legal-review">These website notices should be reviewed by a qualified legal professional for the business’s circumstances and applicable requirements. They are not legal advice or a claim of legal certification.</p>
    </main>
    <SiteFooter/>
  </>
}

export function PrivacyPage() { return <LegalPage type="privacy"/> }
export function TermsPage() { return <LegalPage type="terms"/> }

export default function InfoPage({ type }) {
  if (type === 'about') return <AboutPage/>
  if (type === 'faq') return <FaqPage/>
  if (type === 'privacy') return <PrivacyPage/>
  if (type === 'terms') return <TermsPage/>
  return null
}

