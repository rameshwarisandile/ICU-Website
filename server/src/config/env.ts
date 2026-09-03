import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret-change-me',
  databaseUrl: process.env.DATABASE_URL ?? 'mysql://root:password@localhost:3306/icu_intelligence',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
}
