import { Activity, AlertTriangle, BedDouble, ClipboardCheck, Clock3, HeartPulse } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/common/StatCard'
import ChartCard from '../components/dashboard/ChartCard'
import PatientTable from '../components/dashboard/PatientTable'
import AlertList from '../components/dashboard/AlertList'
import { useLiveVitals } from '../hooks/useLiveVitals'
import { usePatients } from '../hooks/usePatients'
import { useVitals } from '../hooks/useVitals'
import type { AlertItem } from '../types/alert'

const alertData: AlertItem[] = [
  { id: '1', patient_id: 'ICU-1040', alert_type: 'Critical deterioration', severity: 'Critical', status: 'New', message: 'Rapid deterioration in oxygenation and blood pressure.', time: '09:45' },
  { id: '2', patient_id: 'ICU-1027', alert_type: 'Abnormal SpO2', severity: 'Warning', status: 'Unread', message: 'SpO2 dropped below threshold for more than 5 minutes.', time: '09:30' },
  { id: '3', patient_id: 'ICU-1015', alert_type: 'High heart rate', severity: 'Warning', status: 'New', message: 'Tachycardia trending above 118 bpm.', time: '09:18' },
  { id: '4', patient_id: 'ICU-1009', alert_type: 'Low blood pressure', severity: 'Critical', status: 'Resolved', message: 'MAP reduced to concerning range after vasopressor wean.', time: '08:50' },
]

const riskDistribution = [
  { name: 'High Risk', value: 18, color: '#ef4444' },
  { name: 'Medium Risk', value: 31, color: '#f59e0b' },
  { name: 'Low Risk', value: 51, color: '#22c55e' },
]

const patientDistribution = [
  { name: 'Ventilated', value: 31, color: '#2563eb' },
  { name: 'Non-ventilated', value: 42, color: '#22c55e' },
  { name: 'Observation', value: 18, color: '#f59e0b' },
  { name: 'Post-operative care', value: 9, color: '#38bdf8' },
]

const diagnosisData = [
  { name: 'Sepsis', value: 62 },
  { name: 'Cardiac', value: 45 },
  { name: 'Respiratory', value: 58 },
  { name: 'Neurological', value: 36 },
  { name: 'Renal', value: 28 },
]

const occupancyData = [
  { day: 'Mon', occupancy: 72 },
  { day: 'Tue', occupancy: 78 },
  { day: 'Wed', occupancy: 76 },
  { day: 'Thu', occupancy: 80 },
  { day: 'Fri', occupancy: 84 },
  { day: 'Sat', occupancy: 79 },
  { day: 'Sun', occupancy: 83 },
]

const alertsTrend = [
  { day: 'Mon', count: 15 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 20 },
  { day: 'Thu', count: 17 },
  { day: 'Fri', count: 24 },
  { day: 'Sat', count: 19 },
  { day: 'Sun', count: 21 },
]

const stayData = [
  { label: '0–2 days', value: 36 },
  { label: '3–5 days', value: 29 },
  { label: '6–10 days', value: 24 },
  { label: '>10 days', value: 11 },
]

const DashboardPage = () => {
  const navigate = useNavigate()
  const { patients } = usePatients()
  const { vitals } = useVitals()
  const { liveVitals, connected } = useLiveVitals()

  const criticalCount = patients.filter((patient) => patient.status === 'Critical').length
  const highRiskCount = patients.filter((patient) => patient.risk_level === 'High').length
  const occupancy = Math.round((patients.length / 40) * 100)
  const avgStay = (patients.reduce((sum, patient) => sum + patient.length_of_stay, 0) / patients.length).toFixed(1)

  const selectedPatients = patients.slice(0, 6)
  const combinedVitals = [...vitals, ...liveVitals].sort(
    (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  )

  const heartSeries = combinedVitals
    .filter((point) => point.patient_id === 'ICU-1004')
    .map((point) => ({
      name: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heart_rate: point.heart_rate,
      spo2: point.spo2,
    }))

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard icon={<HeartPulse className="h-5 w-5" />} label="Total Patients" value={String(patients.length)} trend="Live" delta="+8.4%" accent="blue" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Critical Patients" value={String(criticalCount)} trend="Critical" delta="+2.1%" accent="red" />
        <StatCard icon={<Activity className="h-5 w-5" />} label="High Risk Patients" value={String(highRiskCount)} trend="AI" delta="+6.9%" accent="amber" />
        <StatCard icon={<BedDouble className="h-5 w-5" />} label="ICU Occupancy" value={`${occupancy}%`} trend="Capacity" delta="+4.2%" accent="cyan" />
        <StatCard icon={<ClipboardCheck className="h-5 w-5" />} label="Active Alerts" value="14" trend="Today" delta="-1.3%" accent="red" />
        <StatCard icon={<Clock3 className="h-5 w-5" />} label="Avg Length of Stay" value={`${avgStay} days`} trend="Stay" delta="-0.4d" accent="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Real-time vital monitoring</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Patient monitoring</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <PatientTable patients={selectedPatients} onSelect={(id) => navigate(`/patients/${id}`)} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI risk estimation / decision support</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Risk distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" innerRadius={55} outerRadius={82} paddingAngle={3}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-red-500">AI risk estimation</p>
                <p className="mt-2 text-3xl font-bold text-red-700">92%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-red-600">Risk level</p>
                <p className="text-lg font-bold text-red-700">HIGH</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-red-700">Confidence: 89% • Recommendation: Immediate clinical review</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Alerts & notifications" subtitle="Clinical monitoring checks">
          <AlertList alerts={alertData} />
        </ChartCard>

        <ChartCard title="Patient distribution" subtitle="Care pathway distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={patientDistribution} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {patientDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Patients']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 text-sm">
            {patientDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Top diagnosis / conditions" subtitle="Current ICU patient mix">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagnosisData} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={78} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#1d9bf0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Length of stay analysis" subtitle="Historical distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="ICU occupancy over last 7 days" subtitle="Bed utilization trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="occupancyFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#1d9bf0" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1d9bf0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Occupancy']} />
                <Area dataKey="occupancy" stroke="#1d9bf0" fill="url(#occupancyFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Alerts over last 7 days" subtitle="Clinical event volume">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard title="Average heart rate" subtitle="Selected patient trend">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="heart_rate" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Average SpO2" subtitle="Selected patient trend">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="spo2" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Historical outcome analytics" subtitle="No direct mortality prediction">
          <div className="space-y-4 pt-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stabilized</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">68%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Transferred</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">21%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Readmitted</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">11%</p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default DashboardPage
