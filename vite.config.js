import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

// Dev-only endpoint that lets "Content Mode" persist your edits permanently by
// writing them to src/data/content.overrides.json. It only exists on the dev
// server — the production build has no such route.
function saveContentPlugin() {
  const target = fileURLToPath(new URL('./src/data/content.overrides.json', import.meta.url))
  return {
    name: 'tt-save-content',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-content', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        let body = ''
        req.on('data', (c) => {
          body += c
          if (body.length > 1_000_000) req.destroy() // guard against runaways
        })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}') // validate it's real JSON
            await writeFile(target, JSON.stringify(parsed, null, 2) + '\n', 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: path.relative(process.cwd(), target) }))
          } catch (err) {
            res.statusCode = 400
            res.end(JSON.stringify({ ok: false, error: String(err) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), saveContentPlugin()],
  server: { port: 5173 },
})
