import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabaseConfigurationError = !url || !anonKey
  ? 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the environment before submitting a request.'
  : ''

let client = null
if (!supabaseConfigurationError) {
  try { client = createClient(url, anonKey) } catch { /* safe diagnostic below reports initialization only */ }
}
export const supabase = client
export const supabaseDiagnostic = Object.freeze({
  url: url ? 'CONFIGURED' : 'MISSING',
  anonKey: anonKey ? 'CONFIGURED' : 'MISSING',
  client: client ? 'INITIALIZED' : 'FAILED',
})

// Temporary, secret-safe connection configuration diagnostic. Never logs values.
console.info('[Supabase diagnostic]', `URL: ${supabaseDiagnostic.url}`, `Anon key: ${supabaseDiagnostic.anonKey}`, `Client: ${supabaseDiagnostic.client}`)
