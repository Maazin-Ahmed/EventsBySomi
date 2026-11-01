import { createHash } from 'node:crypto'

const celebrations = ['Wedding (Shaadi)', 'Mehendi', 'Haldi', 'Sangeet', 'Baby shower (Godh Bharai)', 'Birthday (Janamdin)', 'Griha Pravesh', 'Pooja', 'Get-together', 'Anniversary']
const services = ['Decor and design', 'Wedding mandap', 'Event rentals', 'Stage setup', 'Floral and fabric backdrop', 'Other listed rentals']
const rentalCategories = ['Seating', 'Tables', 'Linens', 'Mandap & stage', 'Decor', 'Serveware']
const states = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '))
const requests = new Map()
const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

function clean(value, max = 2000) { return typeof value === 'string' ? value.trim().replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, max) : '' }
function fail(res, status, error) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify({ error })) }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }
function validPhone(value) { return /^\+?1?\s*\(?[2-9]\d{2}\)?[ .-]*[2-9]\d{2}[ .-]*\d{4}$/.test(value) }

function rateLimit(key, now = Date.now()) {
  const previous = requests.get(key) || []
  const recent = previous.filter(time => now - time < WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) { requests.set(key, recent); return false }
  recent.push(now)
  requests.set(key, recent)
  if (requests.size > 2000) for (const [id, times] of requests) if (!times.some(time => now - time < WINDOW_MS)) requests.delete(id)
  return true
}

async function readBody(req) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > 32_000) throw new Error('too_large')
  }
  try { return JSON.parse(body) } catch { throw new Error('invalid_json') }
}

export async function handleEnquiry(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed.')
  if (!req.headers['content-type']?.includes('application/json')) return fail(res, 415, 'Submit the enquiry as JSON.')
  const forwarded = process.env.TRUST_PROXY === 'true' ? req.headers['x-forwarded-for']?.split(',')[0]?.trim() : ''
  const client = forwarded || req.socket?.remoteAddress || 'unknown'
  const key = createHash('sha256').update(client).digest('hex')
  if (!rateLimit(key)) return fail(res, 429, 'Too many enquiries from this connection. Please try again later.')
  let data
  try { data = await readBody(req) } catch (error) { return fail(res, error.message === 'too_large' ? 413 : 400, error.message === 'too_large' ? 'Enquiry is too large.' : 'Invalid request body.') }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail(res, 400, 'Invalid request body.')

  if (clean(data.website, 300)) return fail(res, 400, 'Unable to submit this enquiry.')
  const enquiry = {
    fullName: clean(data.fullName, 120), email: clean(data.email, 254), phone: clean(data.phone, 30),
    eventType: clean(data.eventType, 80), eventDate: clean(data.eventDate, 10), guests: clean(String(data.guests ?? ''), 5),
    venue: clean(data.venue, 200), city: clean(data.city, 100), state: clean(data.state, 2), zip: clean(data.zip, 10),
    services: Array.isArray(data.services) ? [...new Set(data.services.filter(x => services.includes(x)))].slice(0, services.length) : [],
    rentalCategories: Array.isArray(data.rentalCategories) ? [...new Set(data.rentalCategories.filter(x => rentalCategories.includes(x)))].slice(0, rentalCategories.length) : [],
    colourTheme: clean(data.colourTheme, 120), budget: clean(data.budget, 60), requirements: clean(data.requirements, 3000),
  }
  const eventDay = /^\d{4}-\d{2}-\d{2}$/.test(enquiry.eventDate) ? new Date(`${enquiry.eventDate}T00:00:00Z`) : null
  const today = new Date(); today.setUTCHours(0, 0, 0, 0)
  const validDate = eventDay && !Number.isNaN(eventDay.getTime()) && eventDay.toISOString().slice(0, 10) === enquiry.eventDate
  const budgets = ['', 'Under $5,000', '$5,000–$10,000', '$10,000–$25,000', '$25,000+', 'Prefer to discuss']
  const invalid = !enquiry.fullName || enquiry.fullName.length < 2 || !validEmail(enquiry.email) || !validPhone(enquiry.phone) ||
    !celebrations.includes(enquiry.eventType) || !validDate || eventDay < today || !budgets.includes(enquiry.budget) ||
    !/^\d{1,5}$/.test(enquiry.guests) || Number(enquiry.guests) < 1 || !enquiry.city || !states.has(enquiry.state) ||
    !/^\d{5}(?:-\d{4})?$/.test(enquiry.zip) || !enquiry.services.length ||
    (Array.isArray(data.services) && data.services.some(x => !services.includes(x))) ||
    (Array.isArray(data.rentalCategories) && data.rentalCategories.some(x => !rentalCategories.includes(x)))
  if (invalid) return fail(res, 422, 'Please check the enquiry details and submit again.')

  const relayUrl = process.env.EMAIL_RELAY_URL
  const recipient = process.env.ENQUIRY_TO_EMAIL
  if (!relayUrl || !recipient) return fail(res, 503, 'Enquiry delivery is not configured yet. Please contact the business directly.')
  let url
  try { url = new URL(relayUrl) } catch { return fail(res, 503, 'Enquiry delivery is not configured correctly.') }
  if (!['https:', 'http:'].includes(url.protocol)) return fail(res, 503, 'Enquiry delivery is not configured correctly.')
  const text = [
    `New event enquiry from ${enquiry.fullName}`, '', `Email: ${enquiry.email}`, `Phone: ${enquiry.phone}`,
    `Event: ${enquiry.eventType}`, `Date: ${new Date(`${enquiry.eventDate}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC' })}`, `Guests: ${enquiry.guests}`,
    `Venue: ${enquiry.venue || 'Not provided'}`, `Location: ${enquiry.city}, ${enquiry.state} ${enquiry.zip}`,
    `Services: ${enquiry.services.join(', ')}`, `Rental categories: ${enquiry.rentalCategories.join(', ') || 'Not specified'}`,
    `Preferred color theme: ${enquiry.colourTheme || 'Not specified'}`, `Budget range: ${enquiry.budget || 'Not specified'}`,
    '', 'Additional requirements:', enquiry.requirements || 'None provided',
  ].join('\n')
  try {
    const response = await fetch(url, {
      method: 'POST', headers: { 'content-type': 'application/json', ...(process.env.EMAIL_RELAY_TOKEN ? { authorization: `Bearer ${process.env.EMAIL_RELAY_TOKEN}` } : {}) },
      body: JSON.stringify({ to: recipient, subject: `Event enquiry — ${enquiry.fullName}`, replyTo: enquiry.email, text, enquiry }), signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return fail(res, 502, 'The enquiry could not be delivered. Please try again or contact the business directly.')
  } catch {
    return fail(res, 502, 'The enquiry could not be delivered. Please try again or contact the business directly.')
  }
  res.writeHead(202, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify({ received: true }))
}
