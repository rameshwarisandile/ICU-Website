import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { usePatients } from '../hooks/usePatients'
import type { PatientRecord, RiskLevel } from '../types/patient'
import RiskBadge from '../components/common/RiskBadge'
import FilterDropdown from '../components/common/FilterDropdown'

const PatientsPage = () => {
  const { patients } = usePatients()
  const [query, setQuery] = useState('')
  const [unit, setUnit] = useState('All Units')
  const [risk, setRisk] = useState<'All' | RiskLevel>('All')
  const [status, setStatus] = useState<'All' | PatientRecord['status']>('All')

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesQuery =
        patient.patient_name.toLowerCase().includes(query.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(query.toLowerCase())
      const matchesUnit = unit === 'All Units' || patient.icu_unit === unit
      const matchesRisk = risk === 'All' || patient.risk_level === risk
      const matchesStatus = status === 'All' || patient.status === status

      return matchesQuery && matchesUnit && matchesRisk && matchesStatus
    })
  }, [patients, query, unit, risk, status])

  const units = ['All Units', ...new Set(patients.map((patient) => patient.icu_unit))]
  const riskLevels: Array<'All' | RiskLevel> = ['All', 'Low', 'Medium', 'High']
  const statuses: Array<'All' | PatientRecord['status']> = ['All', 'Stable', 'Warning', 'Critical']

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patients</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Patient management</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              aria-label="Search patients"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient or ID"
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
          <FilterDropdown value={unit} options={units} onChange={setUnit} label="ICU unit" />
          <FilterDropdown value={risk} options={riskLevels} onChange={setRisk} label="Risk level" />
          <FilterDropdown value={status} options={statuses} onChange={setStatus} label="Status" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Unit</th>
              <th className="px-4 py-3 font-semibold">Bed</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Risk</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.patient_id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-800">{patient.patient_name}</td>
                <td className="px-4 py-3 text-slate-600">{patient.patient_id}</td>
                <td className="px-4 py-3 text-slate-600">{patient.icu_unit}</td>
                <td className="px-4 py-3 text-slate-600">{patient.bed_number}</td>
                <td className="px-4 py-3 text-slate-600">{patient.age}</td>
                <td className="px-4 py-3"><RiskBadge level={patient.risk_level} /></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${patient.status === 'Stable' ? 'bg-emerald-100 text-emerald-700' : patient.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/patients/${patient.patient_id}`} className="font-semibold text-blue-600 hover:text-blue-700">
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PatientsPage
