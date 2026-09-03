import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

const ChartCard = ({ title, subtitle, children }: ChartCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
)

export default ChartCard
