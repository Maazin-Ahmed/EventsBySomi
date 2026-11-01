import { defineConfig, loadEnv } from 'vite'
import { handleEnquiry } from './server/handler.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) if (!(key in process.env)) process.env[key] = value
  return {
    plugins: [{
      name: 'enquiry-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/enquiries', (req, res) => handleEnquiry(req, res))
      },
    }],
    server: { host: '0.0.0.0' },
    esbuild: { jsx: 'automatic' },
  }
})
