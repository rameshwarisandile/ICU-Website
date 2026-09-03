import type { PatientRecord, RiskLevel, PatientStatus } from '../types/patient'

export const getRiskLevelFromScore = (score: number): RiskLevel => {
  if (score >= 70) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

export const getStatusFromScore = (score: number): PatientStatus => {
  if (score >= 75) return 'Critical'
  if (score >= 50) return 'Warning'
  return 'Stable'
}

export const getRiskClasses = (risk: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    Low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
    High: 'bg-red-100 text-red-700 border border-red-200',
  }

  return map[risk]
}

export const getStatusClasses = (status: PatientStatus) => {
  const map: Record<PatientStatus, string> = {
    Stable: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    Critical: 'bg-red-100 text-red-700 border border-red-200',
  }

  return map[status]
}

export const getRiskTone = (risk: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    Low: '#22c55e',
    Medium: '#f59e0b',
    High: '#ef4444',
  }

  return map[risk]
}

export const summarizePatientRisk = (patients: PatientRecord[]) => {
  const total = patients.length
  const high = patients.filter((patient) => patient.risk_level === 'High').length
  const medium = patients.filter((patient) => patient.risk_level === 'Medium').length
  const low = patients.filter((patient) => patient.risk_level === 'Low').length

  return {
    total,
    high,
    medium,
    low,
    highPercent: total ? (high / total) * 100 : 0,
    mediumPercent: total ? (medium / total) * 100 : 0,
    lowPercent: total ? (low / total) * 100 : 0,
  }
}
