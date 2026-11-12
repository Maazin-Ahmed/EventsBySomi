import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { rentalGroups } from '../src/content.js'

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173'
const port = process.env.QA_CHROME_PORT || 9333
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method:'PUT' })).json()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => ws.addEventListener('open', resolve, {once:true}))
let id = 0
const pending = new Map()
let intercept
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.id) { const handler=pending.get(message.id); if(handler){pending.delete(message.id);message.error?handler.reject(Error(message.error.message)):handler.resolve(message.result)} }
  else if(message.method==='Fetch.requestPaused') intercept?.(message.params)
})
const cmd=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))})
async function run(expression){const result=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function until(expression){for(let i=0;i<160;i++){if(await run(expression))return;await sleep(150)}throw Error('Timeout: '+expression)}
async function nav(route,selector){await cmd('Page.navigate',{url:base+route});await until(`document.readyState==='complete'&&location.pathname===${JSON.stringify(route)}&&!!document.querySelector(${JSON.stringify(selector)})`)}
const allItems=rentalGroups.flatMap(group=>group.items.map(name=>({id:group.slug+':'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),category:group.slug,categoryName:group.title,name,quantity:1,image:'/images/rentals/stale-legacy-image.webp'})))
const results={base,testedAt:new Date().toISOString(),submission:'Mocked in browser; no live customer/request records written',surfaces:[]}
await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Network.enable')
await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true})
await cmd('Emulation.setTouchEmulationEnabled',{enabled:true})
try {
 await nav('/cart','h1')
 await run(`localStorage.setItem('somia-rental-process-seen','1');localStorage.setItem('somia-rental-cart-v1',${JSON.stringify(JSON.stringify(allItems))})`)
 for(const route of ['/cart','/request-quote','/request-confirmation']){
  if(route==='/request-confirmation')await run(`sessionStorage.setItem('somia-request-confirmation',JSON.stringify({request_number:'QA-PREVIEW',customer:{full_name:'Local QA',phone:'+1 954 555 0100',event_date:'2027-01-01'},items:JSON.parse(localStorage.getItem('somia-rental-cart-v1'))}))`)
  await nav(route,'[data-product-id]')
  await until(`document.querySelectorAll('[data-product-id]').length===42 && !document.querySelector('[aria-busy=true]')`)
  const rows=[]
  for(let index=0;index<42;index++){
   rows.push(await run(`(async()=>{const row=document.querySelectorAll('[data-product-id]')[${index}];row.scrollIntoView({block:'center',behavior:'instant'});const img=row.querySelector('img');if(img)try{await img.decode()}catch{}return{id:row.dataset.productId,src:img?.currentSrc||null,decoded:!!img?.naturalWidth,placeholder:!!row.querySelector('[role=img]')}})()`))
  }
  assert.ok(rows.every(row=>row.decoded||row.placeholder))
  assert.ok(rows.filter(row=>row.src).every(row=>row.decoded&&row.src.includes('/storage/v1/object/public/rental-product-images/')))
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true)
  results.surfaces.push({route,rows})
 }
 const selected=allItems.filter(item=>['seating:chiavari-chairs','decor:urlis','serveware:katori'].includes(item.id))
 await run(`localStorage.setItem('somia-rental-cart-v1',${JSON.stringify(JSON.stringify(selected))})`)
 await nav('/cart','.qty-controls')
 await run(`document.querySelector('[aria-label="Increase Chiavari chairs"]').click()`)
 assert.equal(await run(`JSON.parse(localStorage.getItem('somia-rental-cart-v1')).find(x=>x.id==='seating:chiavari-chairs').quantity`),2)
 await run(`document.querySelector('[aria-label="Decrease Chiavari chairs"]').click()`)
 assert.equal(await run(`JSON.parse(localStorage.getItem('somia-rental-cart-v1')).find(x=>x.id==='seating:chiavari-chairs').quantity`),1)
 results.cartQuantityAndLegacyCompatibility='PASS'
 await nav('/request-quote','form')
 await run(`document.querySelector('form button[type=submit], form > button').click()`)
 await until(`document.querySelector('form small')`)
 results.requiredFieldValidation='PASS'
 let payload
 intercept=async event=>{
  if(event.request.url.includes('/functions/v1/submit-rental-request')){
   payload=JSON.parse(event.request.postData)
   await cmd('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:200,responseHeaders:[{name:'content-type',value:'application/json'},{name:'access-control-allow-origin',value:'*'}],body:Buffer.from(JSON.stringify({request_number:'QA-MOCK-IMAGE-001'})).toString('base64')})
  }else await cmd('Fetch.continueRequest',{requestId:event.requestId})
 }
 await cmd('Fetch.enable',{patterns:[{urlPattern:'*functions/v1/submit-rental-request*',requestStage:'Request'}]})
 await run(`(()=>{const values={full_name:'Image QA',email:'image-qa@example.test',phone:'9545550100',event_type:'Weddings',event_date:'2027-12-01',delivery_address:'QA address',event_venue:'QA venue'};for(const[name,value]of Object.entries(values)){const input=document.querySelector('[name="'+name+'"]');const proto=input.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(input,value);input.dispatchEvent(new Event(input.tagName==='SELECT'?'change':'input',{bubbles:true}))}})()`)
 await run(`document.querySelector('form > button').click()`)
 await until(`location.pathname==='/request-confirmation'&&!!document.querySelector('[data-product-id]')`)
 assert.ok(payload,'Submission must be intercepted')
 assert.deepEqual(Object.keys(payload).sort(),['customer','request'])
 assert.deepEqual(payload.request.requested_items.map(item=>Object.keys(item).sort()),selected.map(()=>['category','category_name','id','name','quantity']))
 assert.deepEqual(payload.request.requested_items.map(item=>item.id),selected.map(item=>item.id))
 assert.equal(payload.customer.phone,'9545550100')
 assert.equal(await run(`JSON.parse(sessionStorage.getItem('somia-request-confirmation')).request_number`),'QA-MOCK-IMAGE-001')
 assert.equal(await run(`JSON.parse(localStorage.getItem('somia-rental-cart-v1')).length`),0)
 results.requestPayloadAndMockedConfirmation='PASS'
 await cmd('Fetch.disable')
 // A genuine CDN failure must produce explicit unavailable text, never a
 // silently substituted photograph or an empty white image element.
 intercept=async event=>cmd('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:404,responseHeaders:[{name:'content-type',value:'text/plain'}],body:Buffer.from('Not found').toString('base64')})
 await cmd('Fetch.enable',{patterns:[{urlPattern:'*storage/v1/object/public/rental-product-images/*',requestStage:'Request'}]})
 await nav('/collections/seating','[data-product-id]')
 await run(`document.querySelector('[data-product-id]').scrollIntoView({block:'center',behavior:'instant'})`)
 await until(`document.querySelector('[data-product-id] [role=img]')?.textContent==='Photo unavailable'`)
 results.cdnFailureFallback='PASS'
 await cmd('Fetch.disable')
 let failProducts=true
 intercept=async event=>{
  if(failProducts){await cmd('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:503,responseHeaders:[{name:'content-type',value:'application/json'},{name:'access-control-allow-origin',value:'*'}],body:Buffer.from(JSON.stringify({message:'Simulated catalogue outage'})).toString('base64')})}
  else await cmd('Fetch.continueRequest',{requestId:event.requestId})
 }
 await cmd('Fetch.enable',{patterns:[{urlPattern:'*rest/v1/products?*',requestStage:'Request'}]})
 await nav('/collections/seating','h1')
 await until(`!!document.querySelector('[role=alert]')`)
 failProducts=false
 await run(`document.querySelector('[role=alert] button').click()`)
 await until(`document.querySelectorAll('[data-product-id]').length===8`)
 results.catalogueErrorAndRetry='PASS'
 await cmd('Fetch.disable')
 console.log(JSON.stringify({...results,surfaces:results.surfaces.map(surface=>({route:surface.route,products:surface.rows.length,decoded:surface.rows.filter(row=>row.decoded).length,explicitlyUnavailable:surface.rows.filter(row=>row.placeholder).length}))},null,2))
 await fs.writeFile('docs/phase5.1.1-evidence/functional-regression.json',JSON.stringify(results,null,2)+'\n')
} finally {ws.close();await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`)}
