// Run against local Vite with an isolated Chromium CDP profile. All enquiry
// endpoints are mocked before React initializes and additionally network-blocked.
import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import { celebrations, rentalGroups } from '../src/content.js'

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173'
const port = process.env.QA_CHROME_PORT || '9445'
const output = process.env.QA_OUTPUT || '/tmp/somia-frontend-ux-evidence'
const key = 'somia-rental-cart-v1'
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
await fs.mkdir(output, { recursive: true })
async function page() {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  let id = 0
  const pending = new Map()
  const errors = []
  let submissionNetworkRequests = 0
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const handler = pending.get(message.id)
      if (handler) { pending.delete(message.id); clearTimeout(handler.timer); message.error ? handler.reject(Error(message.error.message)) : handler.resolve(message.result) }
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
    else if (message.method === 'Network.requestWillBeSent' && /\/api\/enquiries|\/functions\/v1\/submit-rental-request/.test(message.params.request.url)) submissionNetworkRequests++
  })
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id
    const timer = setTimeout(() => { pending.delete(requestId); reject(Error('CDP timeout: ' + method)) }, 30000)
    pending.set(requestId, { resolve, reject, timer })
    socket.send(JSON.stringify({ id: requestId, method, params }))
  })
  const run = async expression => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true })
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
    return result.result.value
  }
  const until = async expression => {
    const started = Date.now()
    while (Date.now() - started < 25000) { if (await run(`Boolean(${expression})`)) return; await wait(25) }
    throw Error('Timeout: ' + expression)
  }
  const navigate = async route => {
    await command('Page.navigate', { url: base + route })
    await until(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(route)} && !!document.querySelector('.site-nav')`)
  }
  const close = async () => { socket.close(); await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`) }
  await command('Page.enable')
  await command('Runtime.enable')
  await command('Network.enable')
  await command('Network.setBlockedURLs', { urls: ['*://*/api/enquiries*', '*://*/functions/v1/submit-rental-request*'] })
  await command('Page.addScriptToEvaluateOnNewDocument', { source: `
    localStorage.setItem('somia-rental-process-seen','1');
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, options) => {
      const url = new URL(typeof input === 'string' ? input : input.url || String(input), location.href);
      if (url.pathname === '/api/enquiries' || url.pathname === '/functions/v1/submit-rental-request') {
        sessionStorage.setItem('__uxMockPayload', options?.body || 'null');
        return Promise.resolve(new Response(JSON.stringify({success:true, request_number:'UX-MOCK-001'}), {status:200, headers:{'content-type':'application/json'}}));
      }
      return originalFetch(input, options);
    };
    window.__uxShifts = [];
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__uxShifts.push({value:entry.value, time:entry.startTime}); }).observe({type:'layout-shift', buffered:true});
  ` })
  return { command, run, until, navigate, close, errors, submissions: () => submissionNetworkRequests }
}

const browser = await page()
const { command, run, until, navigate } = browser
let other
const results = { base, testedAt: new Date().toISOString(), physicalDevices: false, headers: [], carts: [], routes: [] }
const hidden = `document.querySelector('.site-nav').classList.contains('site-nav--hidden')`
const cart = `JSON.parse(localStorage.getItem('${key}') || '[]')`
const card = id => `document.querySelector('[data-product-id="${id}"]')`
const button = id => `${card(id)}.querySelector('button')`
const label = id => `${button(id)}.textContent`
async function viewport(width, reduced = false) {
  await command('Emulation.setDeviceMetricsOverride', { width, height: width <= 430 ? 844 : 1080, deviceScaleFactor: width < 900 ? 2 : 1, mobile: width < 900 })
  await command('Emulation.setTouchEmulationEnabled', { enabled: width < 900 })
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] })
}
async function scroll(y) { await run(`window.scrollTo({top:${y},behavior:'instant'})`); await wait(45) }
async function shot(filename) {
  const shot = await command('Page.captureScreenshot', { format: 'webp', quality: 80 })
  await fs.writeFile(path.join(output, filename), Buffer.from(shot.data, 'base64'))
}
async function pointerClick(selector) {
  const point = await run(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 })
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 })
}
try {
  for (const width of [320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440, 1920]) {
    await viewport(width)
    await navigate('/collections/seating')
    await until(`document.querySelectorAll('[data-product-id]').length === 8`)
    await run('document.fonts.ready')
    await scroll(0)
    assert.equal(await run(hidden), false, 'Header must stay visible at page top')
    const originalGeometry = await run(`document.querySelector('.inventory-section').getBoundingClientRect().top + scrollY`)
    await run('window.__uxShifts = []')
    await scroll(600)
    await until(hidden)
    await wait(260)
    assert.ok(await run(`document.querySelector('.site-nav').getBoundingClientRect().bottom <= 1`), 'Hidden header must leave the viewport')
    assert.equal(await run(`getComputedStyle(document.querySelector('.site-nav')).pointerEvents`), 'none')
    if ([390,820,1440].includes(width)) await shot(`header-hidden-${width}.webp`)
    await scroll(560)
    await until('!' + hidden)
    await scroll(800)
    await until(hidden)
    await wait(650)
    const idleStarted = Date.now()
    await scroll(1000)
    await wait(650)
    assert.equal(await run(hidden), true, 'Subsequent scroll must reset the idle timer')
    await until('!' + hidden)
    const idleMs = Date.now() - idleStarted
    assert.ok(idleMs >= 900 && idleMs < 1500, 'Idle reveal should occur after about one second')
    await wait(260)
    if ([390,820,1440].includes(width)) await shot(`header-idle-${width}.webp`)
    for (let i = 0; i < 3; i++) { await scroll(1001); await scroll(1000) }
    assert.equal(await run(hidden), false, 'One-pixel jitter must not hide the header')
    await scroll(1200)
    await until(hidden)
    await run(`document.querySelector('.site-nav .brand-mark').focus({preventScroll:true})`)
    await until('!' + hidden)
    assert.equal(await run(`document.querySelector('.site-nav').contains(document.activeElement)`), true, 'Header focus must be retained before scrolling')
    await scroll(1300)
    assert.equal(await run(hidden), false, 'Keyboard focus inside the header must keep it visible: ' + JSON.stringify(await run(`({active:document.activeElement.outerHTML.slice(0,160),y:scrollY})`)))
    await run('document.activeElement.blur()')
    await scroll(0)
    await until('!' + hidden)
    await wait(260)
    if (width < 900) {
      await pointerClick('.menu-toggle')
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`)
      assert.equal(await run(`document.activeElement === document.querySelector('.nav-links a')`), true)
      await scroll(700)
      assert.equal(await run(hidden), false, 'Open mobile navigation must keep the header visible')
      if (width === 390) await shot('mobile-navigation-open.webp')
      await pointerClick('.menu-toggle')
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
      await pointerClick('.menu-toggle')
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`)
      await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
      assert.equal(await run(`document.activeElement === document.querySelector('.menu-toggle')`), true)
    }
    assert.ok(await run('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal page overflow')
    assert.equal(await run(`document.querySelector('.inventory-section').getBoundingClientRect().top + scrollY`), originalGeometry, 'Header visibility changed content geometry')
    const cls = await run('window.__uxShifts.reduce((sum,entry)=>sum+entry.value,0)')
    assert.ok(cls < 0.01, 'Header interactions must not shift page layout')
    results.headers.push({ width, idleMs, cls, mobileMenu: width < 900, pass: true })
    console.log(`${width}px header: down/up/idle/reset/jitter/focus/top${width < 900 ? '/menu' : ''} PASS`)
  }
  await viewport(390, true)
  await navigate('/collections/seating')
  await scroll(600)
  await until(hidden)
  const durations = await run(`getComputedStyle(document.querySelector('.site-nav')).transitionDuration.split(',').map(parseFloat)`)
  assert.ok(durations.every(duration => duration <= 0.001), 'Reduced motion must disable the sliding transition')
  results.reducedMotion = 'PASS'

  for (const width of [390, 820, 1440]) {
    await viewport(width)
    await run(`localStorage.removeItem('${key}')`)
    for (const group of rentalGroups) {
      const route = '/collections/' + group.slug
      await navigate(route)
      await until(`document.querySelectorAll('[data-product-id]').length === ${group.items.length}`)
      const ids = await run(`[...document.querySelectorAll('[data-product-id]')].map(card=>card.dataset.productId)`)
      for (const [index, id] of ids.entries()) {
        assert.equal(await run(label(id)), 'Add to Cart')
        await run(`${button(id)}.click()`)
        await until(`${label(id)} === 'View Cart'`)
        if (index === 0 && ids.length > 1) assert.equal(await run(label(ids[1])), 'Add to Cart', 'Products must have independent button states')
      }
      assert.ok(await run(`${cart}.every(item=>item.quantity===1)`))
      await command('Page.reload')
      await until(`document.querySelectorAll('[data-product-id]').length === ${ids.length}`)
      assert.ok(await run(`[...document.querySelectorAll('[data-product-id] button')].every(button=>button.textContent==='View Cart')`), 'Labels must survive refresh')
      const before = await run(`localStorage.getItem('${key}')`)
      await run(`${button(ids[0])}.click()`)
      await until(`location.pathname === '/cart' && !!document.querySelector('.quote-items')`)
      assert.equal(await run(`localStorage.getItem('${key}')`), before, 'View Cart must never add or increment')
      assert.ok(await run(`document.querySelector('h1').getBoundingClientRect().top >= document.querySelector('.site-nav').getBoundingClientRect().bottom`), 'Fixed header must not cover cart content')
      await run(`${card(ids[0])}.querySelector('.remove-item').click()`)
      await navigate(route)
      await until(`${card(ids[0])} && ${label(ids[0])} === 'Add to Cart'`)
      assert.equal(await run(label(ids[1])), 'View Cart')
      await run(`${button(ids[0])}.click()`)
      await until(`${label(ids[0])} === 'View Cart'`)
      await navigate('/cart')
      await until(`!!${card(ids[0])}`)
      await run(`${card(ids[0])}.querySelector('.qty-controls button').click()`)
      await navigate(route)
      await until(`${card(ids[0])} && ${label(ids[0])} === 'Add to Cart'`)
      await run(`${button(ids[0])}.click()`)
      await until(`${label(ids[0])} === 'View Cart'`)
      if (group.slug === 'seating') await shot(`catalogue-buttons-${width}.webp`)
      assert.ok(await run('document.documentElement.scrollWidth <= innerWidth'))
      results.carts.push({ width, category: group.slug, products: ids.length, addRefreshViewRemoveZero: 'PASS' })
      console.log(`${width}px ${group.slug}: ${ids.length} independent Add/View buttons; refresh, View quantity, remove/zero PASS`)
    }
    assert.equal(await run(`${cart}.length`), 42)
  }
  // Real cross-tab storage events, without button-specific persistence flags.
  await navigate('/collections/seating')
  await until(`document.querySelectorAll('[data-product-id]').length === 8`)
  other = await page()
  await other.navigate('/cart')
  await other.run('localStorage.clear()')
  await until(`[...document.querySelectorAll('[data-product-id] button')].every(button=>button.textContent==='Add to Cart')`)
  const restored = { id:'seating:chiavari-chairs', category:'seating', categoryName:'Seating', name:'Chiavari chairs', quantity:3, image:null }
  await other.run(`localStorage.setItem('${key}',${JSON.stringify(JSON.stringify([restored]))})`)
  await until(`${label(restored.id)} === 'View Cart'`)
  assert.equal(await run(`${cart}[0].quantity`), 3)
  results.crossTabStorage = 'PASS'

  const routes = ['/', '/celebrations', '/collections', '/gallery', '/about', '/faq', '/privacy-policy', '/terms', '/contact', '/cart', '/request-quote', '/request-confirmation', ...celebrations.map(item=>'/celebrations/'+item.slug), ...rentalGroups.map(group=>'/collections/'+group.slug)]
  for (const route of routes) {
    await navigate(route)
    await scroll(0)
    assert.equal(await run(`document.querySelectorAll('.site-nav').length`), 1)
    assert.equal(await run(`document.querySelector('.site-nav').parentElement === document.body`), true)
    assert.equal(await run(`getComputedStyle(document.querySelector('.site-nav')).position`), 'fixed')
    assert.equal(await run(hidden), false)
    results.routes.push(route)
  }
  await navigate('/contact')
  await run(`document.querySelector('.enquiry-form button').click()`)
  await until(`!!document.querySelector('.form-status--invalid')`)
  await run(`(()=>{const values={fullName:'UX Browser QA',email:'ux-qa@example.test',phone:'9545550100',eventType:'Wedding (Shaadi)',eventDate:'2027-12-01',guests:'50',city:'Wellington',state:'Florida',zip:'33414'};for(const[name,value]of Object.entries(values)){const input=document.querySelector('[name="'+name+'"]');const proto=input.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(input,value);input.dispatchEvent(new Event(input.tagName==='SELECT'?'change':'input',{bubbles:true}))}})()`)
  await run(`document.querySelector('.services-field input').click()`)
  await run(`document.querySelector('.enquiry-form button').click()`)
  await until(`!!document.querySelector('.form-status--success')`)
  const payload = await run(`JSON.parse(sessionStorage.getItem('__uxMockPayload')||'null')`)
  assert.equal(payload.fullName, 'UX Browser QA')
  assert.equal(payload.services.length, 1)
  assert.equal(browser.submissions(), 0)
  assert.equal(other.submissions(), 0)
  assert.deepEqual(browser.errors, [])
  assert.deepEqual(other.errors, [])
  results.enquiryValidationAndMockedSuccess = 'PASS'
  results.submissionNetworkRequests = browser.submissions()
  results.runtimeErrors = browser.errors
  results.status = 'PASS'
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n')
  console.log(`Frontend UX PASS: ${results.headers.length} header widths, ${results.carts.length} category/viewport cases, ${results.routes.length} routes; zero submission network requests. Evidence: ${output}`)
} finally {
  await browser.close()
  if (other) await other.close()
}
