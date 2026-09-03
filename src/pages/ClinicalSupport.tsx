import { AlertTriangle, BrainCircuit, ClipboardList } from 'lucide-react'
import { usePatients } from '../hooks/usePatients'

const fallbackPatient = {
  patient_id: 'ICU-1001',
  patient_name: 'Demo Patient',
  risk_level: 'High',
  heart_rate: 92,
  spo2: 96,
  systolic_bp: 124,
  diastolic_bp: 78,
  risk_score: 92,
}

const ClinicalSupportPage = () => {
  const { patients, loading } = usePatients()
  const patient = patients[0] ?? fallbackPatient

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Clinical support</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Loading clinical support view...</h2>
          <p className="mt-3 text-sm text-slate-600">Fetching patient records before showing support guidance.</p>
        </div>
      </div>
    )
  }

  if (!patients.length) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Clinical support</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">No patient data available</h2>
          <p className="mt-3 text-sm text-slate-600">Seed the database or check the backend connection to view decision support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Clinical support</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Decision support interface</h2>
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
          AI-generated decision support. Final clinical decisions must be made by qualified healthcare professionals.
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Patient selector</h3>
          <div className="mt-4 space-y-3">
            {patients.slice(0, 5).map((item) => (
              <button key={item.patient_id} type="button" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left">
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
          <h3 className="text-lg font-semibold text-slate-900">Current vitals</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">HR</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.heart_rate}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">SpO2</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.spo2}%</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">BP</p><p className="mt-2 text-2xl font-bold text-slate-900">{patient.systolic_bp}/{patient.diastolic_bp}</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /><h3 className="text-lg font-semibold text-slate-900">Risk summary</h3></div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-red-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-red-600">High-risk features</p><p className="mt-2 text-2xl font-bold text-red-700">{patient.risk_score}%</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Important abnormal values</p><ul className="mt-2 space-y-2 text-sm text-slate-700"><li>• Oxygen saturation below threshold</li><li>• Respiratory rate high and trending upward</li><li>• Temp elevated above expected range</li></ul></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-slate-900">Clinical notes</h3></div>
          <div className="space-y-3 text-sm text-slate-700">
            <p>Patient remains hemodynamically unstable with rising oxygen requirements and persistent tachycardia. Continue hemodynamic monitoring.</p>
            <p>Review medication interactions and adjust sedation as clinically appropriate. Ensure ventilator settings are assessed with respiratory therapy.</p>
            <p>AI-generated decision support does not replace clinician judgment or institutional protocols.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-violet-600" /><h3 className="text-lg font-semibold text-slate-900">General best-practice information</h3></div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold text-slate-800">Monitoring</p><p className="mt-2 text-sm text-slate-600">Frequent reassessment of vitals and patient response to therapy.</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold text-slate-800">Respiratory care</p><p className="mt-2 text-sm text-slate-600">Review oxygenation targets and ventilator settings as indicated.</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold text-slate-800">Medication review</p><p className="mt-2 text-sm text-slate-600">Check for drug interactions and contraindications before medication changes.</p></div>
        </div>
      </div>
    </div>
  )
}

export default ClinicalSupportPage
