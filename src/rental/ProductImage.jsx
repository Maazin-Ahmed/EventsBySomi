import { useState } from 'react'
import { useCatalogue } from './Catalogue.jsx'

function ImageAsset({ src, alt, className, loading, compact }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <div className={className} role="img" aria-label={`${alt} — photo unavailable`}><span>Photo unavailable</span></div>
  return <img src={src} alt={alt} width={compact ? 100 : 1200} height={compact ? 90 : 900} loading={loading} decoding="async" onError={() => setFailed(true)}/>
}

// Resolve by stable ID on every surface; legacy localStorage URLs never override
// the current database record. Missing photographs have an explicit text state.
export default function ProductImage({ productId, name, compact = false, loading = 'lazy' }) {
  const { productsById } = useCatalogue()
  const product = productsById[productId]
  const src = compact ? product?.thumbnail_url || product?.image_url : product?.image_url
  return <ImageAsset key={src || productId} src={src} alt={product?.image_alt || name} className={compact ? 'quote-item-image__placeholder' : 'rental-product-image__placeholder'} loading={loading} compact={compact}/>
}
