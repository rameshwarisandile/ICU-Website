import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../services/api'
import type { VitalPoint } from '../types/patient'

export const useLiveVitals = (patientId?: string) => {
  const [liveVitals, setLiveVitals] = useState<VitalPoint[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io(SOCKET_URL)

    socket.on('connect', () => {
      setConnected(true)

      if (patientId) {
        socket.emit('join-room', `patient:${patientId}`)
      }
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('connect_error', () => {
      setConnected(false)
    })

    socket.on('vitals:update', (payload: VitalPoint) => {
      if (patientId && payload.patient_id !== patientId) {
        return
      }

      setLiveVitals((current) => {
        const next = [...current, payload]
        return next.length > 50 ? next.slice(next.length - 50) : next
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [patientId])

  return { liveVitals, connected }
}