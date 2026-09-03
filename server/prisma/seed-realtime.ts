import bcrypt from 'bcryptjs'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '../src/lib/prisma.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')

type PatientRow = {
  patient_id: string
  patient_name: string
  age: string
  gender: string
  bed_number: string
  icu_unit: string
  attending_doctor: string
  acuity: string
  admission_date: string
  ventilation_status: string
}

type VitalRow = {
  patient_id: string
  timestamp: string
  heart_rate: string
  spo2: string
  systolic_bp: string
  diastolic_bp: string
  respiratory_rate: string
  temperature: string
  glucose: string
}

type AlertRow = {
  patient_id: string
  alert_type: string
  severity: string
  message: string
  created_at: string
}

const readCsv = <T>(filename: string): T[] => {
  const raw = readFileSync(path.join(DATA_DIR, filename), 'utf-8')
  return parse(raw, { columns: true, skip_empty_lines: true }) as T[]
}

const mapAcuityToSeverity = (acuity: string) => {
  switch (acuity) {
    case 'high':
      return 'HIGH'
    case 'medium':
      return 'MEDIUM'
    default:
      return 'LOW'
  }
}

const mapAcuityToStatus = (acuity: string) => {
  switch (acuity) {
    case 'high':
      return 'CRITICAL'
    case 'medium':
      return 'RECOVERING'
    default:
      return 'STABLE'
  }
}

async function main() {
  console.log('Reading CSV files...')
  const patientsCsv = readCsv<PatientRow>('icu_patients.csv')
  const vitalsCsv = readCsv<VitalRow>('icu_vitals_timeseries.csv')
  const alertsCsv = readCsv<AlertRow>('icu_alerts.csv')

  const existingUser = await prisma.user.findUnique({ where: { email: 'admin@icu.local' } })
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: 'admin@icu.local',
        name: 'Dr. Maya Chen',
        role: 'DOCTOR',
        passwordHash: await bcrypt.hash('admin123', 10),
      },
    })
  }

  console.log('Clearing old data...')
  await prisma.alert.deleteMany()
  await prisma.vital.deleteMany()
  await prisma.riskPrediction.deleteMany()
  await prisma.patient.deleteMany()

  const patientIdMap = new Map<string, string>()

  console.log(`Creating ${patientsCsv.length} patients...`)
  for (const row of patientsCsv) {
    const [firstName, ...rest] = row.patient_name.split(' ')
    const lastName = rest.join(' ') || 'Unknown'

    const patient = await prisma.patient.create({
      data: {
        patientNumber: row.patient_id,
        firstName,
        lastName,
        age: Number(row.age),
        sex: row.gender,
        bedNumber: row.bed_number,
        unit: row.icu_unit,
        attendingDoctor: row.attending_doctor,
        status: mapAcuityToStatus(row.acuity) as never,
        severity: mapAcuityToSeverity(row.acuity) as never,
        riskScore: row.acuity === 'high' ? 78 : row.acuity === 'medium' ? 48 : 18,
        admissionDate: new Date(row.admission_date),
      },
    })

    patientIdMap.set(row.patient_id, patient.id)
  }

  console.log(`Inserting ${vitalsCsv.length} vitals rows (batched)...`)
  const batchSize = 500

  for (let index = 0; index < vitalsCsv.length; index += batchSize) {
    const batch = vitalsCsv.slice(index, index + batchSize)

    await prisma.vital.createMany({
      data: batch
        .filter((row) => patientIdMap.has(row.patient_id))
        .map((row) => ({
          patientId: patientIdMap.get(row.patient_id)!,
          timestamp: new Date(row.timestamp),
          heartRate: Number(row.heart_rate),
          systolicBP: Number(row.systolic_bp),
          diastolicBP: Number(row.diastolic_bp),
          oxygenSaturation: Number(row.spo2),
          respiratoryRate: Number(row.respiratory_rate),
          temperature: Number(row.temperature),
          glucose: Number(row.glucose),
        })),
    })

    process.stdout.write(`  ${Math.min(index + batchSize, vitalsCsv.length)}/${vitalsCsv.length}\r`)
  }

  console.log(`\nInserting ${alertsCsv.length} alerts...`)
  await prisma.alert.createMany({
    data: alertsCsv
      .filter((row) => patientIdMap.has(row.patient_id))
      .map((row) => ({
        patientId: patientIdMap.get(row.patient_id)!,
        title: row.severity === 'CRITICAL' ? 'Critical vitals alert' : 'Vitals alert',
        message: row.message,
        type: row.alert_type as never,
        severity: row.severity as never,
        status: 'ACTIVE',
        createdAt: new Date(row.created_at),
      })),
  })

  console.log('Done! Seeded patients, full vitals history, and alerts.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Seed failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  })