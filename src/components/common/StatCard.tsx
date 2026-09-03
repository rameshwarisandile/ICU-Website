import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  trend: string
  delta: string
  accent?: 'blue' | 'red' | 'amber' | 'green' | 'cyan'
}

const accentStyles = {
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
  cyan: 'bg-cyan-50 text-cyan-700',
}

const StatCard = ({ icon, label, value, trend, delta, accent = 'blue' }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
  >
    <div className="mb-4 flex items-center justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentStyles[accent]}`}>
        {icon}
      </div>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        {trend}
      </span>
    </div>

    <p className="text-3xl font-bold text-slate-900">{value}</p>
    <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
      <span>vs previous</span>
      <span className="font-semibold text-slate-700">{delta}</span>
    </div>
  </motion.div>
)

export default StatCard
