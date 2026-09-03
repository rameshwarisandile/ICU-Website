import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../services/api'

export type NotificationCategory = 'Critical' | 'Warning' | 'Information'

export interface NotificationItem {
  id: string
  category: NotificationCategory
  title: string
  message: string
  patientId?: string
  time: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    category: 'Critical',
    title: 'Critical Alert',
    patientId: 'ICU-102',
    message: 'SpO2 has fallen below configured demo threshold.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    category: 'Warning',
    title: 'Warning',
    patientId: 'ICU-104',
    message: 'Heart rate has increased beyond monitoring threshold.',
    time: '14 min ago',
    read: false,
  },
  {
    id: 'n3',
    category: 'Information',
    title: 'Patient update',
    patientId: 'ICU-118',
    message: 'New patient admitted to ICU-A and assigned to monitoring queue.',
    time: '41 min ago',
    read: true,
  },
]

interface NotificationContextValue {
  notifications: NotificationItem[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllRead: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState(initialNotifications)

  useEffect(() => {
    const socket = io(SOCKET_URL)

    socket.on('alert:new', (payload: { patient_id: string; severity: string; message: string; time: string }) => {
      setNotifications((current) => [
        {
          id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          category: 'Critical',
          title: 'Critical Alert',
          patientId: payload.patient_id,
          message: payload.message,
          time: new Date(payload.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
        ...current,
      ])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markAsRead,
      markAllRead,
    }),
    [notifications],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider.')
  }

  return context
}
