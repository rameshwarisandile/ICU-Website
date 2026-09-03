import type { Server } from 'socket.io'
import { prisma } from '../lib/prisma.js'

const TICK_MS = 3000
const cursors = new Map<string, number>()

const toPayload = (
  patientNumber: string,
  vital: {
    heartRate: number
    systolicBP: number
    diastolicBP: number
    oxygenSaturation: number
    respiratoryRate: number
    temperature: number
    glucose: number | null
  },
) => ({
  patient_id: patientNumber,
  timestamp: new Date().toISOString(),
  heart_rate: vital.heartRate,
  spo2: vital.oxygenSaturation,
  systolic_bp: vital.systolicBP,
  diastolic_bp: vital.diastolicBP,
  respiratory_rate: vital.respiratoryRate,
  temperature: vital.temperature,
  glucose: vital.glucose ?? 0,
})

export async function startVitalsSimulator(io: Server) {
  const patients = await prisma.patient.findMany({ select: { id: true, patientNumber: true } })

  setInterval(() => {
    void (async () => {
      for (const patient of patients) {
        const totalReadings = await prisma.vital.count({ where: { patientId: patient.id } })

        if (totalReadings === 0) {
          continue
        }

        const cursor = cursors.get(patient.id) ?? 0
        let [nextVital] = await prisma.vital.findMany({
          where: { patientId: patient.id },
          orderBy: { timestamp: 'asc' },
          skip: cursor,
          take: 1,
        })

        if (!nextVital) {
          cursors.set(patient.id, 0)
          ;[nextVital] = await prisma.vital.findMany({
            where: { patientId: patient.id },
            orderBy: { timestamp: 'asc' },
            skip: 0,
            take: 1,
          })
        }

        if (!nextVital) {
          continue
        }

        const nextCursor = cursor + 1 >= totalReadings ? 0 : cursor + 1
        cursors.set(patient.id, nextCursor)

        const payload = toPayload(patient.patientNumber, nextVital)

        io.emit('vitals:update', payload)
        io.to(`patient:${patient.patientNumber}`).emit('vitals:update', payload)

        if (payload.spo2 < 90 || payload.heart_rate > 130 || payload.systolic_bp < 90) {
          io.emit('alert:new', {
            patient_id: patient.patientNumber,
            severity: 'CRITICAL',
            message: `Live threshold breach for ${patient.patientNumber}`,
            time: payload.timestamp,
          })
        }
      }
    })().catch((error) => {
      console.error('Vitals simulator tick failed:', error)
    })
  }, TICK_MS)

  console.log(`Vitals simulator started for ${patients.length} patients (tick: ${TICK_MS}ms)`)
}