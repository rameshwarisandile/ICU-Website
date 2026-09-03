import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const mapStatus = (status: string) => {
  switch (status) {
    case 'CRITICAL':
      return 'Critical'
    case 'RECOVERING':
      return 'Warning'
    case 'DISCHARGED':
      return 'Stable'
    default:
      return 'Stable'
  }
}

const mapSeverity = (severity: string) => {
  switch (severity) {
    case 'HIGH':
      return 'High'
    case 'MEDIUM':
      return 'Medium'
    case 'LOW':
      return 'Low'
    default:
      return 'Low'
  }
}

export const getPatients = async (_req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vitals: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    })

    const payload = patients.map((patient) => ({
      id: patient.id,
      patient_id: patient.patientNumber,
      patient_name: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      gender: patient.sex,
      bed_number: patient.bedNumber,
      icu_unit: patient.unit,
      heart_rate: patient.vitals[0]?.heartRate ?? 0,
      spo2: patient.vitals[0]?.oxygenSaturation ?? 0,
      systolic_bp: patient.vitals[0]?.systolicBP ?? 0,
      diastolic_bp: patient.vitals[0]?.diastolicBP ?? 0,
      respiratory_rate: patient.vitals[0]?.respiratoryRate ?? 0,
      temperature: patient.vitals[0]?.temperature ?? 0,
      glucose: patient.vitals[0]?.glucose ?? 0,
      creatinine: 0.9,
      sodium: 139,
      potassium: 4.1,
      wbc: 7.6,
      platelets: 245,
      risk_score: patient.riskScore,
      risk_level: mapSeverity(patient.severity),
      status: mapStatus(patient.status),
      ventilation_status: 'Observation',
      admission_date: patient.admissionDate.toISOString().slice(0, 10),
      length_of_stay: 1,
      alerts: patient.alerts.map((alert) => ({
        id: alert.id,
        patient_id: patient.patientNumber,
        alert_type: alert.type,
        severity: mapSeverity(alert.severity),
        status: alert.status,
        message: alert.message,
        time: alert.createdAt.toISOString(),
      })),
    }))

    return res.json(payload)
  } catch (error) {
    console.error('Get patients error:', error)
    return res.status(500).json({ message: 'Unable to load patients.' })
  }
}

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        vitals: {
          orderBy: { timestamp: 'desc' },
          take: 15,
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        riskPredictions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    return res.json({
      id: patient.id,
      patient_id: patient.patientNumber,
      patient_name: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      gender: patient.sex,
      bed_number: patient.bedNumber,
      icu_unit: patient.unit,
      attending_doctor: patient.attendingDoctor,
      status: mapStatus(patient.status),
      severity: mapSeverity(patient.severity),
      risk_score: patient.riskScore,
      vitals: patient.vitals.map((vital) => ({
        timestamp: vital.timestamp.toISOString(),
        patient_id: patient.patientNumber,
        heart_rate: vital.heartRate,
        spo2: vital.oxygenSaturation,
        systolic_bp: vital.systolicBP,
        diastolic_bp: vital.diastolicBP,
        respiratory_rate: vital.respiratoryRate,
        temperature: vital.temperature,
      })),
      alerts: patient.alerts.map((alert) => ({
        id: alert.id,
        patient_id: patient.patientNumber,
        alert_type: alert.type,
        severity: mapSeverity(alert.severity),
        status: alert.status,
        message: alert.message,
        time: alert.createdAt.toISOString(),
      })),
      risk_predictions: patient.riskPredictions.map((prediction) => ({
        id: prediction.id,
        model_version: prediction.modelVersion,
        score: prediction.score,
        risk_level: mapSeverity(prediction.riskLevel),
        probability: prediction.probability,
        recommendation: prediction.recommendation,
        created_at: prediction.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Get patient error:', error)
    return res.status(500).json({ message: 'Unable to load patient.' })
  }
}

export const getDashboardOverview = async (_req: Request, res: Response) => {
  try {
    const [totalPatients, criticalPatients, activeAlerts, avgRiskScore] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { status: 'CRITICAL' } }),
      prisma.alert.count({ where: { status: 'ACTIVE' } }),
      prisma.patient.aggregate({
        _avg: { riskScore: true },
      }),
    ])

    return res.json({
      totalPatients,
      criticalPatients,
      activeAlerts,
      avgRiskScore: Number(avgRiskScore._avg.riskScore ?? 0),
      occupancy: 72,
      trend: 12.4,
    })
  } catch (error) {
    console.error('Dashboard overview error:', error)
    return res.status(500).json({ message: 'Unable to load dashboard overview.' })
  }
}
