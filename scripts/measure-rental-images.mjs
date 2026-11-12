const url = process.argv[2] || 'http://127.0.0.1:4173/collections/decor'
const width = Number(process.argv[3] || 1280)
const height = Number(process.argv[4] || 2400)
const targetResponse = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(url), { method: 'PUT' })
if (!targetResponse.ok) throw new Error('Could not create a Chromium page target: ' + targetResponse.status)
const target = await targetResponse.json()
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let nextId = 0
const pending = new Map()
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve, reject } = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) reject(new Error(message.error.message))
  else resolve(message.result)
})
const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId
  pending.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})

await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: width < 600 ? 2 : 1, mobile: width < 600 })
await command('Page.enable')
await command('Network.enable')
await command('Performance.enable')
await command('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.__phase44Metrics = { cls: 0, lcp: 0 };
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__phase44Metrics.cls += entry.value }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__phase44Metrics.lcp = entry.startTime }).observe({ type: 'largest-contentful-paint', buffered: true });
` })
await command('Page.navigate', { url })
await new Promise(resolve => setTimeout(resolve, 5000))
await command('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' })
await new Promise(resolve => setTimeout(resolve, 2500))
const result = await command('Runtime.evaluate', {
  expression: `JSON.stringify({
    title: document.title,
    viewport: [innerWidth, innerHeight],
    images: [...document.images].map(img => ({ src: img.currentSrc || img.src, complete: img.complete, width: img.naturalWidth, height: img.naturalHeight, loading: img.loading })),
    productImages: performance.getEntriesByType('resource').filter(item => new URL(item.name).pathname.startsWith('/images/rentals/')).map(item => ({ url: new URL(item.name).pathname, transferSize: item.transferSize, encodedBodySize: item.encodedBodySize })),
    externalImageHosts: [...new Set([...document.images].map(img => new URL(img.currentSrc || img.src).hostname).filter(host => host !== location.hostname))],
    apiRequests: performance.getEntriesByType('resource').filter(item => /unsplash|pexels|pixabay/i.test(item.name) && /\\/api\\//i.test(item.name)).map(item => item.name),
    cls: window.__phase44Metrics && window.__phase44Metrics.cls,
    lcpMilliseconds: window.__phase44Metrics && window.__phase44Metrics.lcp
  })`,
  returnByValue: true,
})
console.log(JSON.stringify(result, null, 2))
socket.close()
