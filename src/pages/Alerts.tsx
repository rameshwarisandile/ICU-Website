import { useMemo, useState } from 'react'
import { AlertTriangle, Search } from 'lucide-react'
import alertsData from '../data/alerts.json'
import type { AlertItem } from '../types/alert'

const alerts = alertsData as AlertItem[]

const AlertsPage = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All alerts')

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const textMatches = `${alert.patient_id} ${alert.alert_type}`.toLowerCase().includes(query.toLowerCase())
      const filterMatches =
        filter === 'All alerts' ||
        (filter === 'Critical' && alert.severity === 'Critical') ||
        (filter === 'Warning' && alert.severity === 'Warning') ||
        (filter === 'Informational' && alert.severity === 'Informational') ||
        (filter === 'Resolved' && alert.status === 'Resolved')

      return textMatches && filterMatches
    })
  }, [query, filter])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Alerts</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Alert center</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option>All alerts</option>
            <option>Critical</option>
            <option>Warning</option>
            <option>Informational</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patient or alert type"
            className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-red-50 p-4 text-red-700"><p className="text-xs uppercase tracking-[0.2em]">Critical</p><p className="mt-2 text-3xl font-bold">2</p></div>
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-700"><p className="text-xs uppercase tracking-[0.2em]">Warning</p><p className="mt-2 text-3xl font-bold">3</p></div>
        <div className="rounded-2xl bg-blue-50 p-4 text-blue-700"><p className="text-xs uppercase tracking-[0.2em]">Informational</p><p className="mt-2 text-3xl font-bold">1</p></div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700"><p className="text-xs uppercase tracking-[0.2em]">Resolved</p><p className="mt-2 text-3xl font-bold">2</p></div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className={`rounded-xl p-2 ${alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : alert.severity === 'Warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{alert.patient_id}</p>
                  <p className="text-xs text-slate-500">{alert.alert_type}</p>
                  <p className="mt-2 text-sm text-slate-600">{alert.message}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : alert.severity === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-slate-500">{alert.time}</span>
                <button className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700">
                  Mark as read
                </button>
                <button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white">
                  Resolve alert
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPage
