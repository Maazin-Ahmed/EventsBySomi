import { cloneElement, useRef, useState } from 'react'
import { celebrationEventType, rentalGroups, services, states } from '../content.js'

const blank = { fullName: '', email: '', countryCode: '+1', phone: '', eventType: '', eventDate: '', guests: '', venue: '', city: '', state: '', zip: '', services: [], colourTheme: '', budget: '', requirements: '', rentalCategories: [], website: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?1?\s*\(?[2-9]\d{2}\)?[ .-]*[2-9]\d{2}[ .-]*\d{4}$/
const countryCodes = [
  ['+1', 'United States / Canada (+1)'], ['+44', 'United Kingdom (+44)'],
  ['+61', 'Australia (+61)'], ['+64', 'New Zealand (+64)'], ['+91', 'India (+91)'],
  ['+92', 'Pakistan (+92)'], ['+880', 'Bangladesh (+880)'], ['+977', 'Nepal (+977)'],
  ['+94', 'Sri Lanka (+94)'], ['+971', 'United Arab Emirates (+971)'],
]

export default function Enquiry() {
  const [form, setForm] = useState(() => {
    const query = new URLSearchParams(window.location.search)
    const eventType = celebrationEventType(query.get('event') || '')
    const category = rentalGroups.find(group => group.slug === query.get('category'))?.title || ''
    const preselectedServices = eventType ? ['Decor and design'] : category ? ['Event rentals'] : []
    return { ...blank, eventType, rentalCategories: category ? [category] : [], services: preselectedServices }
  })
  const whatsappNumber = '19544960556'
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like to ask about an event.')}`
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const submitting = useRef(false)
  const update = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: '', ...(key === 'countryCode' ? { phone: '' } : {}) }))
    setStatus('idle')
  }
  const toggle = (value) => update('services', form.services.includes(value) ? form.services.filter(item => item !== value) : [...form.services, value])
  const toggleCategory = (value) => update('rentalCategories', form.rentalCategories.includes(value) ? form.rentalCategories.filter(item => item !== value) : [...form.rentalCategories, value])
  const validate = () => {
    const e = {}
    if (form.fullName.trim().length < 2) e.fullName = 'Enter your full name.'
    if (!emailPattern.test(form.email.trim())) e.email = 'Enter a valid email address.'
    const localDigits = form.phone.replace(/\D/g, '')
    const validPhone = form.countryCode === '+1'
      ? phonePattern.test(`${form.countryCode}${localDigits}`)
      : localDigits.length >= 6 && localDigits.length <= 14
    const phoneWithinE164Limit = form.countryCode.replace(/\D/g, '').length + localDigits.length <= 15
    if (!validPhone || !phoneWithinE164Limit) e.phone = 'Enter a valid phone number for the selected country code.'
    if (!form.eventType) e.eventType = 'Choose an event type.'
    if (!form.eventDate || new Date(`${form.eventDate}T00:00:00`) < new Date(new Date().toDateString())) e.eventDate = 'Choose a future event date.'
    if (!/^\d{1,5}$/.test(form.guests) || Number(form.guests) < 1) e.guests = 'Enter a guest count.'
    if (form.city.trim().length < 2) e.city = 'Enter the event city.'
    if (!form.state) e.state = 'Choose a state.'
    if (!/^\d{5}(?:-\d{4})?$/.test(form.zip)) e.zip = 'Enter a valid ZIP code.'
    if (!form.services.length) e.services = 'Select at least one service.'
    return e
  }
  const submit = async (event) => {
    event.preventDefault()
    if (submitting.current) return
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      setStatus('invalid')
      const firstError = document.getElementById(Object.keys(next)[0])
      if (firstError) {
        if (firstError.type === 'checkbox') firstError.focus()
        else firstError.focus()
      }
      return
    }
    submitting.current = true
    setStatus('loading')
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'We could not send your enquiry. Please try again.')
      setStatus('success'); setForm(blank); setErrors({})
    } catch (error) { setStatus('error'); setErrors({ form: error.message || 'We could not send your enquiry. Please try again.' }) }
    finally { submitting.current = false }
  }
  const field = (key, label, input, required = false, help = '') => <div className={`field ${errors[key] ? 'field--error' : ''}`}>
    <label htmlFor={key}>{label}{required && <span className="required"> *</span>}</label>{cloneElement(input, { 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `${key}-error` : undefined })}
    {errors[key] && <small id={`${key}-error`}>{errors[key]}</small>}{help && <small className="field-help">{help}</small>}
  </div>
  return <section className="enquiry-section" id="enquiry">
    <div className="enquiry-aside"><p className="eyebrow">LET’S BEGIN</p><h2>Tell us what<br/>you’re <em>dreaming.</em></h2><p>Share a few details and our team can learn what matters most to you and your celebration.</p><div className="enquiry-rule"/><p className="aside-small">Have a quick question?</p><a className="whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Contact us on WhatsApp <span>↗</span></a><a className="whatsapp-link" href="tel:+19544960556">Call +1 954-496-0556 <span>↗</span></a><a className="whatsapp-link" href="mailto:contact@eventsbysomia.com">Email our team <span>↗</span></a><a className="whatsapp-link" href="https://maps.google.com/?q=9266+Delemar+Ct,+Wellington,+FL+33414" target="_blank" rel="noreferrer">9266 Delemar Ct, Wellington <span>↗</span></a></div>
    <form className="enquiry-form" onSubmit={submit} noValidate>
      <div className="form-heading"><div><h3>Your celebration</h3><p>Fields marked * are required.</p></div></div>
      <div className="form-grid">
        <p className="form-section-label field--full">Personal information</p>
        {field('fullName', 'Full name', <input id="fullName" name="fullName" autoComplete="name" value={form.fullName} onChange={e => update('fullName', e.target.value)} required aria-invalid={!!errors.fullName}/>, true)}
        {field('email', 'Email address', <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)} required aria-invalid={!!errors.email}/>, true)}
        <div className={`field field--full ${errors.phone ? 'field--error' : ''}`}>
          <div className="phone-fields">
            <div><label htmlFor="countryCode">Country code <span className="required">*</span></label><select id="countryCode" name="countryCode" value={form.countryCode} onChange={e => update('countryCode', e.target.value)}>{countryCodes.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></div>
            <div><label htmlFor="phone">Phone number <span className="required">*</span></label><input id="phone" name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="954-496-0556" value={form.phone} onChange={e => update('phone', e.target.value)} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}/></div>
          </div>
          {errors.phone ? <small id="phone-error">{errors.phone}</small> : <small id="phone-help" className="field-help">Choose your country code, then enter your number.</small>}
        </div>
        <p className="form-section-label field--full">Event information</p>
        {field('eventType', 'Event type', <select id="eventType" name="eventType" value={form.eventType} onChange={e => update('eventType', e.target.value)} required><option value="">Select celebration</option>{['Wedding (Shaadi)', 'Mehendi', 'Haldi', 'Sangeet', 'Baby shower (Godh Bharai)', 'Birthday (Janamdin)', 'Anniversary', 'Pooja', 'Griha Pravesh', 'Get-together'].map(x => <option key={x}>{x}</option>)}</select>, true)}
        {field('eventDate', 'Event date', <input id="eventDate" name="eventDate" type="date" value={form.eventDate} onChange={e => update('eventDate', e.target.value)} required min={new Date().toISOString().slice(0, 10)}/>, true, 'Select the event date.')}
        {field('guests', 'Number of guests', <input id="guests" name="guests" type="number" min="1" max="99999" inputMode="numeric" placeholder="e.g. 150" value={form.guests} onChange={e => update('guests', e.target.value)} required/>, true)}
        {field('venue', 'Venue', <input id="venue" name="venue" value={form.venue} onChange={e => update('venue', e.target.value)} placeholder="Venue name, if selected" autoComplete="organization"/>)}
        {field('city', 'City', <input id="city" name="city" autoComplete="address-level2" value={form.city} onChange={e => update('city', e.target.value)} required/>, true)}
        {field('state', 'State', <select id="state" name="state" autoComplete="address-level1" value={form.state} onChange={e => update('state', e.target.value)} required><option value="">Select state</option>{states.map(x => <option key={x}>{x}</option>)}</select>, true)}
        {field('zip', 'ZIP code', <input id="zip" name="zip" autoComplete="postal-code" inputMode="numeric" maxLength="10" placeholder="12345" value={form.zip} onChange={e => update('zip', e.target.value)} required/>, true)}
        <p className="form-section-label field--full">Requirements</p>
        <div className="field field--full services-field" id="services" tabIndex="-1" role="group" aria-labelledby="services-label" aria-describedby={errors.services ? 'services-error' : undefined}><span id="services-label" className="field-label">Services required <span className="required">*</span></span><p className="field-help">Select all that apply.</p><div className="check-grid">{services.map(x => <label className="check-option" key={x}><input type="checkbox" checked={form.services.includes(x)} onChange={() => toggle(x)}/><span>{x}</span></label>)}</div>{errors.services && <small id="services-error">{errors.services}</small>}</div>
        <div className="field field--full rental-picker"><span className="field-label">Rental collections requested</span><div className="rental-chip-list">{rentalGroups.map(group => <label key={group.title}><input type="checkbox" checked={form.rentalCategories.includes(group.title)} onChange={() => toggleCategory(group.title)}/>{group.title}</label>)}</div></div>
        {field('colourTheme', 'Preferred color theme', <input id="colourTheme" name="colourTheme" placeholder="e.g. ivory and champagne" value={form.colourTheme} onChange={e => update('colourTheme', e.target.value)}/>)}
        {field('budget', 'Budget range (USD)', <select id="budget" name="budget" value={form.budget} onChange={e => update('budget', e.target.value)}><option value="">Select a range</option><option>Under $5,000</option><option>$5,000–$10,000</option><option>$10,000–$25,000</option><option>$25,000+</option><option>Prefer to discuss</option></select>)}
        {field('requirements', 'Additional requirements', <textarea id="requirements" name="requirements" rows="4" placeholder="Tell us what you have in mind…" value={form.requirements} onChange={e => update('requirements', e.target.value)}/>, false)}
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={e => update('website', e.target.value)}/></div>
      </div>
      <div className="submit-row"><button className="button button-wine" disabled={status === 'loading'}>{status === 'loading' ? 'Sending your enquiry…' : 'Send your enquiry'} <span>{status === 'loading' ? '◌' : '↗'}</span></button><p>By submitting, you agree to our <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms">Terms.</a></p></div>
      <div aria-live="polite" role="status" className={`form-status form-status--${status}`}>{status === 'success' && 'Thank you. Your enquiry has been received, and we’ll be in touch.'}{status === 'error' && (errors.form || 'We could not send your enquiry. Please try again.')}{status === 'invalid' && 'Please review the highlighted fields and try again.'}</div>
    </form>
  </section>
}
