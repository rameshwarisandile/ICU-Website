import { AlertTriangle, Clock3 } from 'lucide-react'
import type { AlertItem } from '../../types/alert'

interface AlertListProps {
  alerts: AlertItem[]
}

const severityStyles = {
  Critical: 'bg-red-50 text-red-700 border border-red-200',
  Warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  Informational: 'bg-blue-50 text-blue-700 border border-blue-200',
}

const AlertList = ({ alerts }: AlertListProps) => (
  <div className="space-y-3">
    {alerts.map((alert) => (
      <div key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-700">
              {alert.severity === 'Critical' ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <Clock3 className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{alert.patient_id}</p>
              <p className="text-xs text-slate-500">{alert.alert_type}</p>
              <p className="mt-1 text-xs text-slate-600">{alert.message}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${severityStyles[alert.severity]}`}>
              {alert.severity}
            </span>
            <button className="rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white">
              Action
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default AlertList
