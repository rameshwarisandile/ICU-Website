export type AlertSeverity = 'Critical' | 'Warning' | 'Informational'
export type AlertStatus = 'New' | 'Resolved' | 'Unread'

export interface AlertItem {
  id: string
  patient_id: string
  alert_type: string
  severity: AlertSeverity
  status: AlertStatus
  message: string
  time: string
}
