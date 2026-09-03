import bcrypt from 'bcryptjs'
import { readFileSync } from 'node:fs'
import { prisma } from '../src/lib/prisma.js'

const patientsData = JSON.parse(
  readFileSync(new URL('../../src/data/patients.json', import.meta.url), 'utf-8'),
) as Array<{
  patient_id: string
  patient_name: string
  age: number
  gender: string
  bed_number: string
  icu_unit: string
  heart_rate: number
  spo2: number
  systolic_bp: number
  diastolic_bp: number
  respiratory_rate: number
  temperature: number
  glucose: number
  risk_score: number
  risk_level: string
  status: string
  ventilation_status: string
  admission_date: string
  length_of_stay: number
}>

const mapStatus = (status: string) => {
  switch (status) {
    case 'Critical':
      return 'CRITICAL'
    case 'Warning':
      return 'RECOVERING'
    case 'Stable':
      return 'STABLE'
    default:
      return 'STABLE'
  }
}

const mapSeverity = (riskLevel: string) => {
  switch (riskLevel) {
    case 'High':
      return 'HIGH'
    case 'Medium':
      return 'MEDIUM'
    case 'Low':
      return 'LOW'
    default:
      return 'LOW'
  }
}

async function main() {
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

  await prisma.alert.deleteMany()
  await prisma.vital.deleteMany()
  await prisma.riskPrediction.deleteMany()
  await prisma.patient.deleteMany()

  for (const patientData of patientsData) {
    const [firstName, ...rest] = patientData.patient_name.split(' ')
    const lastName = rest.join(' ')

    const patient = await prisma.patient.create({
      data: {
        patientNumber: patientData.patient_id,
        firstName,
        lastName,
        age: patientData.age,
        sex: patientData.gender,
        bedNumber: patientData.bed_number,
        unit: patientData.icu_unit,
        attendingDoctor: 'Dr. Maya Chen',
        status: mapStatus(patientData.status),
        severity: mapSeverity(patientData.risk_level),
        riskScore: patientData.risk_score,
        admissionDate: new Date(patientData.admission_date),
      },
    })

    await prisma.vital.create({
      data: {
        patientId: patient.id,
        heartRate: patientData.heart_rate,
        systolicBP: patientData.systolic_bp,
        diastolicBP: patientData.diastolic_bp,
        oxygenSaturation: patientData.spo2,
        respiratoryRate: patientData.respiratory_rate,
        temperature: patientData.temperature,
        glucose: patientData.glucose,
      },
    })

    await prisma.riskPrediction.create({
      data: {
        patientId: patient.id,
        modelVersion: 'icu-risk-v1',
        score: patientData.risk_score,
        riskLevel: mapSeverity(patientData.risk_level),
        probability: patientData.risk_score / 100,
        factors: {
          oxygen_saturation: patientData.spo2,
          heart_rate: patientData.heart_rate,
          respiratory_rate: patientData.respiratory_rate,
          status: patientData.status,
        },
        recommendation: patientData.status === 'Critical' ? 'Escalate to critical care review.' : 'Continue routine monitoring.',
      },
    })

    await prisma.alert.create({
      data: {
        patientId: patient.id,
        title: patientData.status === 'Critical' ? 'Critical change in condition' : 'Routine monitoring review',
        message: `${patientData.patient_name} is showing ${patientData.status.toLowerCase()} vital trends requiring attention.`,
        type: patientData.status === 'Critical' ? 'RISK' : 'VITALS',
        severity: mapSeverity(patientData.risk_level),
        status: 'ACTIVE',
      },
    })
  }

  console.log(`Seeded ${patientsData.length} patients and default admin user.`)
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
