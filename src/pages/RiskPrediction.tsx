import { Activity, BrainCircuit, Gauge, HeartPulse, ShieldAlert, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePatients } from '../hooks/usePatients'

const fallbackPatient = {
  patient_id: 'ICU-1001',
  patient_name: 'Demo Patient',
  risk_level: 'High',
  heart_rate: 92,
  spo2: 96,
  systolic_bp: 124,
  diastolic_bp: 78,
  respiratory_rate: 18,
}

const riskTrend = [
  { time: '08:00', value: 62 },
  { time: '09:00', value: 68 },
  { time: '10:00', value: 74 },
  { time: '11:00', value: 79 },
  { time: '12:00', value: 86 },
  { time: '13:00', value: 92 },
]

const RiskPredictionPage = () => {
  const { patients, loading } = usePatients()
  const patient = patients[0] ?? fallbackPatient

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI risk prediction</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Loading patient risk view...</h2>
          <p className="mt-3 text-sm text-slate-600">Fetching patient records before showing prediction cards.</p>
        </div>
      </div>
    )
  }

  if (!patients.length) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI risk prediction</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">No patient data available</h2>
          <p className="mt-3 text-sm text-slate-600">Seed the database or check the backend connection to view live risk analysis.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI risk prediction</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Clinical risk analysis</h2>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
          AI-generated decision support. Final clinical decisions must be made by qualified healthcare professionals.
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Patient selector</h3>
          <div className="mt-4 space-y-3">
            {patients.slice(0, 6).map((item) => (
              <button
                key={item.patient_id}
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                  item.patient_id === patient.patient_id ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.patient_name}</p>
                  <p className="text-xs text-slate-500">{item.patient_id}</p>
                </div>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">{item.risk_level}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient overview</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{patient.patient_name}</h3>
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-700">High</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><Gauge className="h-4 w-4 text-blue-600" /> Risk score</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">92%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><BrainCircuit className="h-4 w-4 text-violet-600" /> Risk category</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">High</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><TrendingUp className="h-4 w-4 text-emerald-600" /> Trend</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">+18%</p>
            </div>
          </div>

          <div className="mt-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="riskTrendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#riskTrendFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Vital indicators</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-red-50 p-4"><p className="flex items-center gap-2 text-sm text-slate-600"><HeartPulse className="h-4 w-4 text-red-500" /> Heart rate</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.heart_rate} bpm</p></div>
            <div className="rounded-2xl bg-emerald-50 p-4"><p className="flex items-center gap-2 text-sm text-slate-600"><Activity className="h-4 w-4 text-emerald-600" /> SpO2</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.spo2}%</p></div>
            <div className="rounded-2xl bg-amber-50 p-4"><p className="flex items-center gap-2 text-sm text-slate-600"><ShieldAlert className="h-4 w-4 text-amber-500" /> BP</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.systolic_bp}/{patient.diastolic_bp}</p></div>
            <div className="rounded-2xl bg-cyan-50 p-4"><p className="flex items-center gap-2 text-sm text-slate-600"><BrainCircuit className="h-4 w-4 text-cyan-600" /> RR</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.respiratory_rate}/min</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Contributing factors</h3>
          <div className="mt-4 space-y-3">
            {['Low oxygen saturation', 'Elevated heart rate', 'Abnormal respiratory rate', 'Low blood pressure', 'Elevated temperature'].map((factor) => (
              <div key={factor} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="text-sm text-slate-700">{factor}</span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">High</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Prediction timestamp</p><p className="mt-2 text-lg font-bold text-slate-900">2026-09-01 13:10</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Confidence</p><p className="mt-2 text-lg font-bold text-slate-900">89%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recommendation</p><p className="mt-2 text-lg font-bold text-slate-900">Immediate review</p></div>
        </div>
      </div>
    </div>
  )
}

export default RiskPredictionPage
