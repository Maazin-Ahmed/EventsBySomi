// Persisted cart and request IDs must remain stable across catalogue updates.
export function rentalProductId(category, name) {
  return category + ':' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
