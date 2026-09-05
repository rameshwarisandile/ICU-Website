import 'dotenv/config'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const sslKeyFile = process.env.SSL_KEY_FILE ?? resolve(process.cwd(), '../certs/localhost-key.pem')
const sslCertFile = process.env.SSL_CERT_FILE ?? resolve(process.cwd(), '../certs/localhost-cert.pem')
const hasLocalSsl = existsSync(sslKeyFile) && existsSync(sslCertFile)

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret-change-me',
  databaseUrl: process.env.DATABASE_URL ?? 'mysql://root:password@localhost:3306/icu_intelligence',
  clientUrls: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
    : ['http://localhost:5173', 'https://localhost:5173'],
  sslKeyFile,
  sslCertFile,
  hasLocalSsl,
}
