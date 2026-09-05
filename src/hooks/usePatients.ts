import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import type { PatientRecord } from '../types/patient'
import fallbackPatients from '../data/patients.json'

const dummyPatients = fallbackPatients as PatientRecord[]

export const usePatients = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiRequest<PatientRecord[]>('/patients')
        setPatients(data.length > 0 ? data : dummyPatients)
      } catch (err) {
        console.error('Failed to load patients:', err)
        setPatients(dummyPatients)
        setError('Using demo patient data because the backend is unavailable.')
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return { patients, loading, error }
}
