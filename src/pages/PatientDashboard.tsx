import { useEffect, useState } from 'react'
import { Activity, BedDouble, ClipboardList, HeartPulse, ReceiptText, UserRound } from 'lucide-react'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

type PatientMe = {
  id: string
  patient_id: string
  patient_name: string
  age: number
  gender: string
  bed_number: string
  icu_unit: string
  attending_doctor?: string | null
  status: string
  severity: string
  risk_score: number
  vitals: Array<{
    timestamp: string
    heart_rate: number
    spo2: number
    systolic_bp: number
    diastolic_bp: number
    respiratory_rate: number
    temperature: number
  }>
  alerts: Array<{ message: string; time: string; severity: string }>
}

type PatientTimeline = {
  statusHistory: Array<{ status: string; reason: string; createdAt: string }>
  billingEntries: Array<{ serviceName: string; amount: number; status: string; billedAt: string }>
  careEntries: Array<{ entryType: string; title: string; details: string; createdAt: string }>
}

const PatientDashboardPage = () => {
  const { user } = useAuth()
  const [patient, setPatient] = useState<PatientMe | null>(null)
  const [timeline, setTimeline] = useState<PatientTimeline | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await apiRequest<PatientMe>('/patients/me')
      setPatient(data)
      const timelineData = await apiRequest<PatientTimeline>(`/patients/${data.id}/timeline`)
      setTimeline(timelineData)
    }

    void load()
  }, [])

  const latestVital = patient?.vitals[0]

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{patient?.patient_name ?? user?.name ?? 'Patient'}</h2>
        <p className="mt-2 text-sm text-slate-600">Private view for your admission, treatment, vitals, billing, and discharge history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-xs uppercase text-slate-500">Status</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient?.status ?? 'Loading'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-xs uppercase text-slate-500">Unit</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient?.icu_unit ?? '—'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-xs uppercase text-slate-500">Bed</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient?.bed_number ?? '—'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-xs uppercase text-slate-500">Doctor</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient?.attending_doctor ?? 'Assigned team'}</p></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="flex items-center gap-2 text-xs uppercase text-slate-500"><HeartPulse className="h-4 w-4 text-red-500" /> Heart Rate</p><p className="mt-2 text-3xl font-bold text-slate-900">{latestVital?.heart_rate ?? '—'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="flex items-center gap-2 text-xs uppercase text-slate-500"><Activity className="h-4 w-4 text-emerald-500" /> SpO2</p><p className="mt-2 text-3xl font-bold text-slate-900">{latestVital?.spo2 ? `${latestVital.spo2}%` : '—'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="flex items-center gap-2 text-xs uppercase text-slate-500"><BedDouble className="h-4 w-4 text-amber-500" /> BP</p><p className="mt-2 text-3xl font-bold text-slate-900">{latestVital ? `${latestVital.systolic_bp}/${latestVital.diastolic_bp}` : '—'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="flex items-center gap-2 text-xs uppercase text-slate-500"><ClipboardList className="h-4 w-4 text-blue-500" /> Risk</p><p className="mt-2 text-3xl font-bold text-slate-900">{patient?.risk_score ?? '—'}%</p></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Your latest alerts</h3>
          <div className="mt-4 space-y-3">
            {patient?.alerts?.length ? patient.alerts.map((alert, index) => (
              <div key={`${alert.time}-${index}`} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{alert.severity}</span>
                  <span className="text-xs text-slate-500">{new Date(alert.time).toLocaleString()}</span>
                </div>
                <p className="mt-2">{alert.message}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No alerts to show.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-700"><UserRound className="h-5 w-5 text-cyan-600" /><h3 className="text-lg font-semibold">Privacy notice</h3></div>
          <p className="mt-3 text-sm text-slate-600">You can only view your own record, billing, and timeline. Other patient records are blocked by the backend even if the URL is changed.</p>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Billing and treatment actions are disabled for deceased or discharged records by the backend.
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Your care timeline</h3>
          <div className="mt-4 space-y-3">
            {(timeline?.statusHistory ?? []).map((item) => (
              <div key={`${item.createdAt}-${item.status}`} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{item.status}</span>
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2">{item.reason}</p>
              </div>
            ))}
            {(timeline?.careEntries ?? []).map((item) => (
              <div key={`${item.createdAt}-${item.title}`} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <span className="text-xs text-slate-500">{item.entryType}</span>
                </div>
                <p className="mt-2">{item.details}</p>
              </div>
            ))}
            {!timeline?.statusHistory?.length && !timeline?.careEntries?.length && <p className="text-sm text-slate-500">No care timeline available yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-700"><ReceiptText className="h-5 w-5 text-emerald-600" /><h3 className="text-lg font-semibold">Billing summary</h3></div>
          <div className="mt-4 space-y-3">
            {(timeline?.billingEntries ?? []).map((item) => (
              <div key={`${item.billedAt}-${item.serviceName}`} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{item.serviceName}</span>
                  <span className="text-xs text-slate-500">{item.status}</span>
                </div>
                <p className="mt-2">${item.amount.toFixed(2)} • {new Date(item.billedAt).toLocaleString()}</p>
              </div>
            ))}
            {!timeline?.billingEntries?.length && <p className="text-sm text-slate-500">No billing records available.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboardPage