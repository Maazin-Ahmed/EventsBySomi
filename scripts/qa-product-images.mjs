import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import { rentalGroups } from '../src/content.js'

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173'
const port = process.env.QA_CHROME_PORT || '9333'
const output = path.resolve('docs/phase5.1.1-evidence', base.startsWith('http://127.') ? 'local' : 'production')
await fs.mkdir(output, { recursive: true })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let nextId = 0
const pending = new Map()
const events = new Map()
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    const { resolve, reject, timer } = pending.get(message.id)
    pending.delete(message.id); clearTimeout(timer)
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result)
  } else if (message.method) for (const listener of events.get(message.method) || []) listener(message.params)
})
function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)) }, 60000)
    pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }))
  })
}
const on = (method, listener) => events.set(method, [...(events.get(method) || []), listener])
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description)
  return result.result.value
}
async function until(expression, timeout = 25000) {
  const start = Date.now()
  while (Date.now() - start < timeout) { if (await evaluate(expression)) return; await wait(150) }
  throw new Error('Timed out waiting for ' + expression)
}
async function navigate(route) {
  await command('Page.navigate', { url: base + route })
  await until(`document.readyState === "complete" && location.pathname === ${JSON.stringify(route)}`)
}
async function screenshot(filename) {
  const { cssContentSize } = await command('Page.getLayoutMetrics')
  const { data } = await command('Page.captureScreenshot', { format: 'webp', quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 } })
  await fs.writeFile(path.join(output, filename), Buffer.from(data, 'base64'))
}
const requests = []
const errors = []
on('Network.requestWillBeSent', event => requests.push({ url: event.request.url, method: event.request.method }))
on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.exception?.description || event.exceptionDetails.text))
await command('Page.enable')
await command('Network.enable')
await command('Runtime.enable')
await command('Page.addScriptToEvaluateOnNewDocument', { source: `
  localStorage.setItem('somia-rental-process-seen', '1');
  window.__imageQA = { cls: 0 };
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__imageQA.cls += entry.value }).observe({ type: 'layout-shift', buffered: true });
` })
const results = []
const editorialResults = []
const widths = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : [320,360,375,390,430,768,820,1024,1280,1366,1440,1920]
try {
  for (const width of widths) {
    const mobile = width <= 1024
    const height = width <= 430 ? 844 : width <= 1024 ? 1180 : 1080
    await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile })
    await command('Emulation.setTouchEmulationEnabled', { enabled: mobile })
    await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    for (const group of process.env.QA_EDITORIAL_ONLY ? [] : rentalGroups) {
      requests.length = 0
      await navigate('/collections/' + group.slug)
      await until(`document.querySelectorAll('[data-product-id]').length === ${group.items.length}`)
      const beforeScroll = await evaluate(`[...document.querySelectorAll('.rental-product-image img')].map(i=>({complete:i.complete,loading:i.loading}))`)
      // Scroll and inspect the actual rendered cards at every viewport. Force
      // decode after entering the lazy-load range; reserve the existing boxes.
      const products = []
      for (let index = 0; index < group.items.length; index++) {
        await evaluate(`document.querySelectorAll('[data-product-id]')[${index}].scrollIntoView({block:'center',behavior:'instant'})`)
        await wait(60)
        products.push(await evaluate(`(async()=>{const card=document.querySelectorAll('[data-product-id]')[${index}];const img=card.querySelector('img');const box=card.getBoundingClientRect();if(img)try{await img.decode()}catch{};const r=img?.getBoundingClientRect();return {id:card.dataset.productId,name:card.querySelector('h3').textContent,src:img?.currentSrc||null,decoded:!!img&&img.complete&&img.naturalWidth>0,naturalWidth:img?.naturalWidth,naturalHeight:img?.naturalHeight,renderedWidth:r?.width,renderedHeight:r?.height,objectFit:img&&getComputedStyle(img).objectFit,placeholder:!!card.querySelector('[role=img]'),cardWidth:box.width,left:box.left,right:box.right,titleLeft:card.querySelector('h3').getBoundingClientRect().left}})()`))
      }
      const layout = await evaluate(`({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,cls:window.__imageQA.cls,gridTop:document.querySelector('.inventory-grid').getBoundingClientRect().top+scrollY,gridHeight:document.querySelector('.inventory-grid').getBoundingClientRect().height,columns:getComputedStyle(document.querySelector('.inventory-grid')).gridTemplateColumns,heights:[...document.querySelectorAll('.rental-product-image')].map(e=>e.getBoundingClientRect().height),brokenOtherImages:[...document.images].filter(i=>!i.closest('[data-product-id]')&&i.complete&&!i.naturalWidth).map(i=>i.src)})`)
      const productRequests = requests.filter(request => request.method === 'GET' && request.url.includes('/rest/v1/products?')).length
      const categoryRequests = requests.filter(request => request.method === 'GET' && request.url.includes('/rest/v1/categories?')).length
      const result = { category: group.slug, width, height, emulation: mobile ? 'Chromium mobile/touch, DPR 2' : 'Chromium desktop, DPR 1', products, beforeScroll, layout, productRequests, categoryRequests }
      results.push(result)
      assert.equal(products.length, group.items.length)
      assert.ok(products.every(product => product.decoded || product.placeholder), 'Unexpected blank image box')
      assert.ok(products.filter(product => product.src).every(product => product.decoded && product.objectFit === 'contain'), 'Image decode/fit failure')
      assert.ok(products.every(product => product.left >= -1 && product.right <= width + 1), 'Product card overflow')
      assert.ok(layout.documentWidth <= width + 1, 'Horizontal page overflow')
      assert.ok(productRequests <= 1 && categoryRequests <= 1, 'Duplicate catalogue requests')
      assert.ok(!layout.brokenOtherImages.length, 'Broken editorial image')
      if ([390,820,1440].includes(width)) {
        await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
        await screenshot(`${group.slug}-${width}.webp`)
      }
      console.log(`${width}px ${group.slug}: ${products.filter(p=>p.decoded).length}/${products.length} photos, overflow ${layout.documentWidth-width}px, CLS ${layout.cls.toFixed(4)}, reads ${productRequests}+${categoryRequests}`)
    }
    if (process.env.QA_EDITORIAL_ONLY) {
      for (const route of ['/', '/gallery']) {
        await navigate(route)
        const images = await evaluate(`(async()=>{const results=[];for(const img of document.images){img.scrollIntoView({block:'center',behavior:'instant'});try{await img.decode()}catch{}results.push({src:img.currentSrc||img.src,decoded:img.complete&&img.naturalWidth>0,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight})}return results})()`)
        assert.ok(images.length > 0 && images.every(image => image.decoded), 'Broken homepage/gallery photograph')
        editorialResults.push({ route, width, images })
        console.log(`${width}px ${route}: ${images.length} editorial images decoded`)
      }
    }
  }
  if (results.length) await fs.writeFile(path.join(output, 'responsive-results.json'), JSON.stringify({ base, testedAt: new Date().toISOString(), physicalDevices: false, results, errors }, null, 2) + '\n')
  if (editorialResults.length) await fs.writeFile(path.join(output, 'editorial-results.json'), JSON.stringify({ base, testedAt: new Date().toISOString(), results: editorialResults, errors }, null, 2) + '\n')
  assert.deepEqual(errors, [], 'Browser runtime errors')
} finally {
  if (results.length) await fs.writeFile(path.join(output, 'responsive-results.json'), JSON.stringify({ base, testedAt: new Date().toISOString(), physicalDevices: false, results, errors }, null, 2) + '\n')
  socket.close()
  await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`)
}
