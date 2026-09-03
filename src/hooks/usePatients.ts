import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import type { PatientRecord } from '../types/patient'

export const usePatients = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiRequest<PatientRecord[]>('/patients')
        setPatients(data)
      } catch (err) {
        console.error('Failed to load patients:', err)
        setError('Unable to load patient data.')
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return { patients, loading, error }
}
