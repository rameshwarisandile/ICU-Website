import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import type { VitalPoint } from '../types/patient'

export const useVitals = () => {
  const [vitals, setVitals] = useState<VitalPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const data = await apiRequest<VitalPoint[]>('/patients')
        const flattened = data.flatMap((patient) => {
          const vital = {
            timestamp: new Date().toISOString(),
            patient_id: patient.patient_id,
            heart_rate: patient.heart_rate,
            spo2: patient.spo2,
            systolic_bp: patient.systolic_bp,
            diastolic_bp: patient.diastolic_bp,
            respiratory_rate: patient.respiratory_rate,
            temperature: patient.temperature,
          }

          return [vital]
        })

        setVitals(flattened)
      } catch (err) {
        console.error('Failed to load vitals:', err)
        setError('Unable to load live vitals.')
      } finally {
        setLoading(false)
      }
    }

    fetchVitals()
  }, [])

  return { vitals, loading, error }
}
