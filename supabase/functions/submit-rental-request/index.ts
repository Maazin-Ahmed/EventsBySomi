const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405)
  try {
    const body = await req.json()
    const c = body?.customer, r = body?.request
    if (!c || !r || typeof c !== 'object' || typeof r !== 'object') return response({ error: 'Malformed request payload' }, 400)
    const email = String(c.email || '').trim().toLowerCase()
    const phone = String(c.phone || '').trim()
    const name = String(c.full_name || '').trim()
    if (name.length < 2 || name.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !/^\d{10}$/.test(phone)) return response({ error: 'Valid name, email, and 10-digit US phone are required' }, 422)
    for (const field of ['event_type','event_date','delivery_address','event_venue']) if (typeof r[field] !== 'string' || !r[field].trim()) return response({ error: `Valid ${field} is required` }, 422)
    const validDate = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10) === value
    if (!validDate(r.event_date)) return response({ error: 'Event date must be a valid date' }, 422)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10)
    if (r.event_date < yesterday) return response({ error: 'Event date cannot be in the past' }, 422)
    if (r.preferred_delivery_date && (!validDate(r.preferred_delivery_date) || r.preferred_delivery_date > r.event_date)) return response({ error: 'Preferred delivery date must be on or before the event date' }, 422)
    if (r.preferred_pickup_date && (!validDate(r.preferred_pickup_date) || r.preferred_pickup_date < r.event_date)) return response({ error: 'Preferred pickup date must be on or after the event date' }, 422)
    const allowed = new Set(['seating','tables','linens','mandap-stage','decor','serveware'])
    if (!Array.isArray(r.requested_items) || !r.requested_items.length || r.requested_items.length > 100) return response({ error: 'At least one rental item is required' }, 422)
    const items = r.requested_items.map((x: any) => ({ id: String(x?.id || ''), category: String(x?.category || ''), category_name: String(x?.category_name || ''), name: String(x?.name || '').trim(), quantity: x?.quantity }))
    if (items.some((x: any) => !x.id || !allowed.has(x.category) || !x.category_name || !x.name || x.name.length > 160 || !Number.isInteger(x.quantity) || x.quantity < 1 || x.quantity > 10000)) return response({ error: 'One or more rental items are invalid' }, 422)
    const url = Deno.env.get('SUPABASE_URL')
    // Prefer the current Supabase secret API key; retain the legacy service-role
    // variable for projects that have not migrated their function secrets.
    const key = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key) return response({ error: 'Request service is not configured' }, 503)
    const payload = { p_customer: { full_name: name, email, phone }, p_request: { event_type: r.event_type.trim(), event_date: r.event_date, delivery_address: r.delivery_address.trim(), event_venue: r.event_venue.trim(), preferred_delivery_date: r.preferred_delivery_date || null, preferred_pickup_date: r.preferred_pickup_date || null, requested_items: items, additional_notes: String(r.additional_notes || '').slice(0,5000), status: 'received' } }
    const result = await fetch(`${url}/rest/v1/rpc/submit_rental_request`, { method:'POST', headers:{ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json' }, body:JSON.stringify(payload) })
    const raw = await result.text()
    if (!result.ok) { console.error('submit_rental_request RPC failed', result.status); return response({ error: 'Request could not be saved. Please try again.' }, 502) }
    let data: any = {}; try { data = JSON.parse(raw) } catch {}
    const requestNumber = typeof data === 'string' ? data : data.request_number || data?.[0]?.request_number || data?.rental_request?.request_number
    if (!requestNumber || typeof requestNumber !== 'string') { console.error('submit_rental_request returned success without a request reference'); return response({ error: 'The database response did not include a request reference.' }, 502) }
    return response({ status:'received', request_number:requestNumber })
  } catch { return response({ error: 'Invalid request payload' }, 400) }
})
