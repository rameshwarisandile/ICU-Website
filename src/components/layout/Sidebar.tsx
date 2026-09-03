import { NavLink } from 'react-router-dom'
import {
  Activity,
  BarChart,
  Bell,
  Brain,
  ChevronLeft,
  ChevronRight,
  Hospital,
  MonitorCog,
  Pill,
  Settings,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  User,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart },
  { label: 'Real-Time Monitoring', to: '/monitoring', icon: Activity },
  { label: 'AI Risk Prediction', to: '/risk-prediction', icon: Brain },
  { label: 'Alerts & Notifications', to: '/alerts', icon: Bell },
  { label: 'Patients', to: '/patients', icon: User },
  { label: 'Clinical Support', to: '/clinical-support', icon: Stethoscope },
  { label: 'Analytics & Reports', to: '/analytics', icon: TrendingUp },
  { label: 'Inventory', to: '/inventory', icon: Pill },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const statuses = [
  { label: 'AI Engine Active', color: 'bg-cyan-400' },
  { label: 'Monitoring Active', color: 'bg-emerald-400' },
  { label: 'Database Connected', color: 'bg-violet-400' },
]

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => (
  <aside
    className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-800 bg-slate-950 text-slate-100 transition-all duration-300 ${
      collapsed ? 'w-24' : 'w-72'
    }`}
  >
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 ring-1 ring-cyan-400/30">
            <Hospital className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.32em] text-slate-400">ICU</p>
              <h1 className="truncate text-lg font-semibold text-white">Intelligence</h1>
            </div>
          )}
        </div>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
          className="rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-slate-300 transition hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-3 py-3">
        <div className={`flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <span className="relative flex h-2.5 w-2.5 rounded-full bg-emerald-400">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          </span>
          {!collapsed && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Live</p>
              <p className="text-sm font-medium text-white">Monitoring</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            end={to === '/dashboard'}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-3 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed && (
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
              <MonitorCog className="h-3.5 w-3.5 text-cyan-300" />
              System Status
            </div>
          )}

          <div className="space-y-2">
            {statuses.map(({ label, color }) => (
              <div key={label} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`} title={collapsed ? label : undefined}>
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                {!collapsed && <span className="text-xs text-slate-300">{label}</span>}
              </div>
            ))}
          </div>

          {!collapsed && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-2 text-xs text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              All Systems Operational
            </div>
          )}
        </div>
      </div>
    </div>
  </aside>
)

export default Sidebar
