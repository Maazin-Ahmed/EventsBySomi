import { createContext, useContext, useMemo, useState } from 'react'
import { rentalGroups } from '../content.js'
import { rentalProductId } from './productIdentity.js'
import { useCatalogue } from './Catalogue.jsx'

const Context = createContext(null)
const key = 'somia-rental-cart-v1'
function read() {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter(item => Number.isInteger(item.quantity) && item.quantity > 0 && rentalGroups.some(group => group.slug === item.category && group.items.includes(item.name)))
  } catch { return [] }
}
export function CartProvider({ children }) {
  const { productsById } = useCatalogue()
  const [items, setItems] = useState(read)
  const save = next => { setItems(next); try { localStorage.setItem(key, JSON.stringify(next)) } catch {} }
  const add = (group, name) => {
    const id = rentalProductId(group.slug, name)
    const found = items.find(item => item.id === id)
    save(found ? items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id, category: group.slug, categoryName: group.title, name, image: productsById[id]?.thumbnail_url || productsById[id]?.image_url || null, quantity: 1 }])
    window.dispatchEvent(new CustomEvent('rental-cart-added', { detail: name }))
  }
  const setQty = (id, quantity) => save(quantity <= 0 ? items.filter(item => item.id !== id) : items.map(item => item.id === id ? { ...item, quantity } : item))
  const api = useMemo(() => ({ items, add, setQty, clear: () => save([]), count: items.reduce((n, item) => n + item.quantity, 0) }), [items, productsById])
  return <Context.Provider value={api}>{children}</Context.Provider>
}
export const useCart = () => useContext(Context)
