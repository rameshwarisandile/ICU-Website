import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import { readFileSync } from 'node:fs'
import { Server } from 'socket.io'
import { env } from './config/env.js'
import authRouter from './routes/auth.js'
import patientRouter from './routes/patients.js'
import { startVitalsSimulator } from './services/vitalsSimulator.js'

export const app = express()
const serverOptions = env.hasLocalSsl
  ? {
      key: readFileSync(env.sslKeyFile),
      cert: readFileSync(env.sslCertFile),
    }
  : undefined
const appServer = serverOptions ? createHttpsServer(serverOptions, app) : createServer(app)

export const io = new Server(appServer, {
  cors: {
    origin: env.clientUrls,
    methods: ['GET', 'POST'],
  },
})

app.use(cors({ origin: env.clientUrls, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/patients', patientRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ICU backend is running' })
})

io.on('connection', (socket) => {
  socket.emit('system', { message: 'Connected to ICU monitoring stream' })

  socket.on('join-room', (room: string) => {
    socket.join(room)
  })
})

appServer.listen(env.port, () => {
  const protocol = serverOptions ? 'https' : 'http'
  console.log(`ICU server running on ${protocol}://localhost:${env.port}`)
  void startVitalsSimulator(io).catch((error) => {
    console.error('Vitals simulator failed to start:', error)
  })
})
