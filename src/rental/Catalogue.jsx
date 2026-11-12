import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase.js'

const CatalogueContext = createContext(null)
let catalogueRequest

// A single shared request per page, including React StrictMode remounts.
function loadCatalogue() {
  if (!catalogueRequest) {
    catalogueRequest = (async () => {
      if (!supabase) throw new Error('The rental catalogue is temporarily unavailable. Please try again.')
      const [categories, products] = await Promise.all([
        supabase.from('categories').select('id,slug,name,is_active,sort_order').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('id,category_id,slug,name,description,image_url,thumbnail_url,image_alt,image_match_type,is_active,sort_order').eq('is_active', true).order('sort_order'),
      ])
      if (categories.error || products.error) throw new Error('The rental catalogue could not load. Please try again.')
      return { categories: categories.data, products: products.data }
    })().catch(error => { catalogueRequest = undefined; throw error })
  }
  return catalogueRequest
}

export function CatalogueProvider({ children }) {
  const [state, setState] = useState({ categories: [], products: [], loading: true, error: '' })
  const [attempt, setAttempt] = useState(0)
  const needed = /^\/(collections\/|cart\/?$|request-quote\/?$|request-confirmation\/?$)/.test(window.location.pathname)
  useEffect(() => {
    if (!needed) return
    let cancelled = false
    setState(current => ({ ...current, loading: true, error: '' }))
    loadCatalogue().then(data => {
      if (!cancelled) setState({ ...data, loading: false, error: '' })
    }).catch(error => {
      if (!cancelled) setState(current => ({ ...current, loading: false, error: error.message }))
    })
    return () => { cancelled = true }
  }, [needed, attempt])
  const value = useMemo(() => ({
    ...state,
    productsById: Object.fromEntries(state.products.map(product => [product.id, product])),
    retry: () => setAttempt(current => current + 1),
  }), [state])
  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
}

export const useCatalogue = () => useContext(CatalogueContext)
