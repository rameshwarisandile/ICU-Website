import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import type { PatientRecord, VitalPoint } from '../types/patient'
import fallbackPatients from '../data/patients.json'
import fallbackVitals from '../data/vitals.json'

const dummyPatients = fallbackPatients as PatientRecord[]
const dummyVitals = fallbackVitals as VitalPoint[]

const latestVitalsFromPatients = (patients: PatientRecord[]) =>
  patients.map((patient) => ({
    timestamp: new Date().toISOString(),
    patient_id: patient.patient_id,
    heart_rate: patient.heart_rate,
    spo2: patient.spo2,
    systolic_bp: patient.systolic_bp,
    diastolic_bp: patient.diastolic_bp,
    respiratory_rate: patient.respiratory_rate,
    temperature: patient.temperature,
  }))

export const useVitals = () => {
  const [vitals, setVitals] = useState<VitalPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const data = await apiRequest<PatientRecord[]>('/patients')
        setVitals([...dummyVitals, ...latestVitalsFromPatients(data.length > 0 ? data : dummyPatients)])
      } catch (err) {
        console.error('Failed to load vitals:', err)
        setVitals([...dummyVitals, ...latestVitalsFromPatients(dummyPatients)])
        setError('Using demo vitals because the backend is unavailable.')
      } finally {
        setLoading(false)
      }
    }

    fetchVitals()
  }, [])

  return { vitals, loading, error }
}
