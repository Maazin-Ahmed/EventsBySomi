import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleEnquiry } from './handler.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' }
const server = http.createServer(async (req, res) => {
  if (req.url?.split('?')[0] === '/api/enquiries') return handleEnquiry(req, res)
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1)
  const file = path.resolve(root, relative)
  if (!file.startsWith(`${root}${path.sep}`) && file !== path.join(root, 'index.html')) { res.writeHead(403); return res.end('Forbidden') }
  try {
    const info = await stat(file).catch(() => null)
    const target = info?.isFile() ? file : path.join(root, 'index.html')
    const content = await readFile(target)
    res.writeHead(200, { 'content-type': types[path.extname(target)] || 'application/octet-stream', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'cache-control': path.extname(target) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' })
    res.end(content)
  } catch { res.writeHead(503, { 'content-type': 'text/plain' }); res.end('Build the website before starting the server.') }
})
const port = Number(process.env.PORT) || 4173
server.listen(port, () => console.log(`Events by Somia listening on port ${port}`))
