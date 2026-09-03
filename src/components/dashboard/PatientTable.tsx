import { motion } from 'framer-motion'
import { ArrowUpRight, Circle } from 'lucide-react'
import type { PatientRecord } from '../../types/patient'
import { getRiskClasses, getStatusClasses } from '../../utils/riskUtils'

interface PatientTableProps {
  patients: PatientRecord[]
  onSelect?: (id: string) => void
}

const PatientTable = ({ patients, onSelect }: PatientTableProps) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>
          <th className="px-4 py-3 font-semibold">Patient ID</th>
          <th className="px-4 py-3 font-semibold">Patient</th>
          <th className="px-4 py-3 font-semibold">Age</th>
          <th className="px-4 py-3 font-semibold">Bed</th>
          <th className="px-4 py-3 font-semibold">Heart Rate</th>
          <th className="px-4 py-3 font-semibold">SpO2</th>
          <th className="px-4 py-3 font-semibold">BP</th>
          <th className="px-4 py-3 font-semibold">RR</th>
          <th className="px-4 py-3 font-semibold">Temp</th>
          <th className="px-4 py-3 font-semibold">Risk</th>
          <th className="px-4 py-3 font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <motion.tr
            key={patient.patient_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-slate-200 hover:bg-slate-50"
          >
            <td className="px-4 py-3 font-medium text-slate-700">{patient.patient_id}</td>
            <td className="px-4 py-3">
              <button
                type="button"
                onClick={() => onSelect?.(patient.patient_id)}
                className="flex items-center gap-2 font-semibold text-slate-800 hover:text-blue-600"
              >
                <span>{patient.patient_name}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </td>
            <td className="px-4 py-3 text-slate-600">{patient.age}</td>
            <td className="px-4 py-3 text-slate-600">{patient.bed_number}</td>
            <td className="px-4 py-3 text-slate-600">{patient.heart_rate} bpm</td>
            <td className="px-4 py-3 text-slate-600">{patient.spo2}%</td>
            <td className="px-4 py-3 text-slate-600">{patient.systolic_bp}/{patient.diastolic_bp}</td>
            <td className="px-4 py-3 text-slate-600">{patient.respiratory_rate}/min</td>
            <td className="px-4 py-3 text-slate-600">{patient.temperature}°C</td>
            <td className="px-4 py-3">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskClasses(patient.risk_level)}`}>
                {patient.risk_score}%
              </span>
            </td>
            <td className="px-4 py-3">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(patient.status)}`}>
                <Circle className="h-2 w-2 fill-current" />
                {patient.status}
              </span>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default PatientTable
