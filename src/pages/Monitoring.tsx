import { motion } from 'framer-motion'
import { Activity, BedDouble, HeartPulse, Thermometer, Waves, Droplets } from 'lucide-react'
import { useMemo } from 'react'
import { useLiveVitals } from '../hooks/useLiveVitals'
import { usePatients } from '../hooks/usePatients'
import { getStatusClasses } from '../utils/riskUtils'

const MonitoringPage = () => {
  const { patients } = usePatients()
  const { liveVitals, connected } = useLiveVitals()

  const latestVitalsByPatient = useMemo(() => {
    return new Map(liveVitals.map((vital) => [vital.patient_id, vital]))
  }, [liveVitals])

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Monitoring</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Real-time ICU monitoring</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {patients.slice(0, 6).map((patient) => (
          <motion.div
            key={patient.patient_id}
            layout
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"
          >
            {(() => {
              const liveReading = latestVitalsByPatient.get(patient.patient_id)
              const displayReading = liveReading ?? {
                heart_rate: patient.heart_rate,
                spo2: patient.spo2,
                systolic_bp: patient.systolic_bp,
                diastolic_bp: patient.diastolic_bp,
                respiratory_rate: patient.respiratory_rate,
                temperature: patient.temperature,
              }

              return (
                <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{patient.patient_id}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{patient.patient_name}</h3>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(patient.status)}`}>
                {patient.status}
              </span>
            </div>

            <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
              <span className="flex items-center gap-2"><BedDouble className="h-4 w-4" /> {patient.bed_number}</span>
              <span className="font-medium text-slate-700">Risk score {patient.risk_score}%</span>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <span>ECG wave</span>
                <span>Live</span>
              </div>
              <div className="flex h-16 items-end gap-1 overflow-hidden">
                {[22, 18, 20, 18, 24, 30, 15, 33, 20, 24, 18, 14, 28, 19, 17, 21, 26, 12].map((height, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ height: [height, height + 8, height] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.08 }}
                    className="w-full rounded-t bg-gradient-to-t from-blue-500 to-cyan-300"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="flex items-center gap-2 text-slate-500"><HeartPulse className="h-4 w-4 text-red-500" /> HR</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{displayReading.heart_rate}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3">
                <p className="flex items-center gap-2 text-slate-500"><Activity className="h-4 w-4 text-emerald-500" /> SpO2</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{displayReading.spo2}%</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="flex items-center gap-2 text-slate-500"><Droplets className="h-4 w-4 text-amber-500" /> BP</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{displayReading.systolic_bp}/{displayReading.diastolic_bp}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3">
                <p className="flex items-center gap-2 text-slate-500"><Waves className="h-4 w-4 text-violet-500" /> RR</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{displayReading.respiratory_rate}/min</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-slate-100 p-3">
                <p className="flex items-center gap-2 text-slate-500"><Thermometer className="h-4 w-4 text-orange-500" /> Temperature</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{displayReading.temperature}°C</p>
              </div>
            </div>
                </>
              )
            })()}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MonitoringPage
