import { Link, useParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, Clock3, HeartPulse, ShieldAlert, Stethoscope, Thermometer } from 'lucide-react'
import { usePatients } from '../hooks/usePatients'
import { useVitals } from '../hooks/useVitals'
import RiskBadge from '../components/common/RiskBadge'

const PatientDetailsPage = () => {
  const { id } = useParams()
  const { patients, loading } = usePatients()
  const { vitals } = useVitals()
  const patient = patients.find((entry) => entry.patient_id === id) || patients[0]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-sm font-semibold text-slate-500">
        Loading patient details...
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient overview</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">No patient data available</h2>
          <p className="mt-2 text-sm text-slate-600">Demo data could not be loaded for this view.</p>
          <Link to="/patients" className="mt-4 inline-flex font-semibold text-blue-600 hover:text-blue-700">
            Back to patients
          </Link>
        </div>
      </div>
    )
  }

  const patientVitals = vitals.filter((entry) => entry.patient_id === patient.patient_id)
  const chartVitals =
    patientVitals.length > 0
      ? patientVitals
      : Array.from({ length: 6 }, (_, index) => ({
          timestamp: new Date(Date.now() - (5 - index) * 60 * 60 * 1000).toISOString(),
          patient_id: patient.patient_id,
          heart_rate: patient.heart_rate + index - 2,
          spo2: Math.max(80, Math.min(100, patient.spo2 + (index % 3) - 1)),
          systolic_bp: patient.systolic_bp + index - 2,
          diastolic_bp: patient.diastolic_bp,
          respiratory_rate: patient.respiratory_rate + (index % 2),
          temperature: Number((patient.temperature + (index - 2) * 0.1).toFixed(1)),
        }))

  const heartRateData = chartVitals.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: point.heart_rate,
  }))

  const spo2Data = chartVitals.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: point.spo2,
  }))

  const bloodPressureData = chartVitals.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: point.systolic_bp,
  }))

  const tempData = chartVitals.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: point.temperature,
  }))

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient overview</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{patient.patient_name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge level={patient.risk_level} />
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${patient.status === 'Stable' ? 'bg-emerald-100 text-emerald-700' : patient.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              {patient.status}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient ID</p>
            <p className="mt-2 text-xl font-bold text-slate-800">{patient.patient_id}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Age</p>
            <p className="mt-2 text-xl font-bold text-slate-800">{patient.age}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gender</p>
            <p className="mt-2 text-xl font-bold text-slate-800">{patient.gender}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bed</p>
            <p className="mt-2 text-xl font-bold text-slate-800">{patient.bed_number}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><HeartPulse className="h-4 w-4 text-red-500" /> HR</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{patient.heart_rate}</p>
          <p className="mt-1 text-xs text-slate-500">bpm</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><Activity className="h-4 w-4 text-emerald-600" /> SpO2</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{patient.spo2}%</p>
          <p className="mt-1 text-xs text-slate-500">oxygen</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><ShieldAlert className="h-4 w-4 text-amber-500" /> BP</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{patient.systolic_bp}/{patient.diastolic_bp}</p>
          <p className="mt-1 text-xs text-slate-500">mmHg</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><Clock3 className="h-4 w-4 text-violet-500" /> RR</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{patient.respiratory_rate}</p>
          <p className="mt-1 text-xs text-slate-500">/min</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><Thermometer className="h-4 w-4 text-orange-500" /> Temp</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{patient.temperature}&deg;C</p>
          <p className="mt-1 text-xs text-slate-500">core</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Heart rate trend</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">SpO2 trend</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spo2Data}>
                <defs>
                  <linearGradient id="spo2Area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#22c55e" fill="url(#spo2Area)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Blood pressure trend</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bloodPressureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Temperature trend</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={[35, 40]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-slate-700">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">AI section: risk and contributing variables</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Risk score</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{patient.risk_score}%</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Risk category</p>
                <p className="mt-2 text-xl font-bold text-slate-800">{patient.risk_level}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recent risk trend</p>
                <p className="mt-2 text-xl font-bold text-slate-800">+12% in 6h</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Important contributing variables</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Low oxygen saturation</li>
                <li>• Elevated heart rate</li>
                <li>• Abnormal respiratory rate</li>
                <li>• Low blood pressure</li>
                <li>• Elevated temperature</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Patient metadata</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span>Admission date</span><span className="font-semibold text-slate-800">{patient.admission_date}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span>ICU unit</span><span className="font-semibold text-slate-800">{patient.icu_unit}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span>Current status</span><span className="font-semibold text-slate-800">{patient.status}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span>Length of stay</span><span className="font-semibold text-slate-800">{patient.length_of_stay} days</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span>Ventilation</span><span className="font-semibold text-slate-800">{patient.ventilation_status}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDetailsPage
