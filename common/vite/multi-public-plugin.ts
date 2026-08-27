import * as path from 'path'
import * as fs from 'fs'
import type { Plugin } from 'vite'

// Plugin to serve static files from multiple public directories
export function multiPublicPlugin(dirs: string[]): Plugin {
  let outDir: string

  return {
    name: 'multi-public',
    configResolved(config) {
      outDir = config.build.outDir
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!url) return next()

        for (const dir of dirs) {
          const filePath = path.resolve(dir, url.slice(1))
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath)
            const mimeTypes: Record<string, string> = {
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.ico': 'image/x-icon',
              '.json': 'application/json',
              '.js': 'application/javascript',
              '.css': 'text/css',
            }
            if (mimeTypes[ext]) {
              res.setHeader('Content-Type', mimeTypes[ext])
            }
            return res.end(fs.readFileSync(filePath))
          }
        }
        next()
      })
    },
    writeBundle() {
      // Copy files from additional public dirs to outDir during build
      for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue

        const files = fs.readdirSync(dir)
        for (const file of files) {
          const src = path.join(dir, file)
          const dest = path.join(outDir, file)

          // Don't overwrite existing files (local public takes priority)
          if (!fs.existsSync(dest)) {
            fs.cpSync(src, dest, { recursive: true })
          }
        }
      }
    },
  }
}
