export type RiskLevel = 'Low' | 'Medium' | 'High'
export type PatientStatus = 'Stable' | 'Warning' | 'Critical'
export type VentilationStatus =
  | 'Ventilated'
  | 'Non-ventilated'
  | 'Observation'
  | 'Post-operative care'

export interface PatientRecord {
  patient_id: string
  patient_name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  bed_number: string
  icu_unit: string
  heart_rate: number
  spo2: number
  systolic_bp: number
  diastolic_bp: number
  respiratory_rate: number
  temperature: number
  glucose: number
  creatinine: number
  sodium: number
  potassium: number
  wbc: number
  platelets: number
  risk_score: number
  risk_level: RiskLevel
  status: PatientStatus
  ventilation_status: VentilationStatus
  admission_date: string
  length_of_stay: number
}

export interface VitalPoint {
  timestamp: string
  patient_id: string
  heart_rate: number
  spo2: number
  systolic_bp: number
  diastolic_bp: number
  respiratory_rate: number
  temperature: number
}

export interface AlertRecord {
  id: string
  patient_id: string
  alert_type: string
  severity: 'Critical' | 'Warning' | 'Informational'
  status: 'New' | 'Resolved' | 'Unread'
  message: string
  time: string
}
