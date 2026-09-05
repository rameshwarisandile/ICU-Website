import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const defaultKeyFile = resolve(rootDir, 'certs/localhost-key.pem')
const defaultCertFile = resolve(rootDir, 'certs/localhost-cert.pem')
const keyFile = process.env.SSL_KEY_FILE ?? defaultKeyFile
const certFile = process.env.SSL_CERT_FILE ?? defaultCertFile
const hasLocalCert = existsSync(keyFile) && existsSync(certFile)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: hasLocalCert
      ? {
          key: readFileSync(keyFile),
          cert: readFileSync(certFile),
        }
      : undefined,
  },
  preview: {
    https: hasLocalCert
      ? {
          key: readFileSync(keyFile),
          cert: readFileSync(certFile),
        }
      : undefined,
  },
})
