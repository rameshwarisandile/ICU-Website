import { Bell, CalendarDays, ChevronDown, Search, SunMedium } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

interface HeaderProps {
  title?: string
}

const Header = ({ title = 'ICU Command Center' }: HeaderProps) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAllRead, markAsRead } = useNotifications()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Information'>('All')

  const initials = (user?.name ?? 'Dr. Sarah Williams')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Healthcare intelligence</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-sm lg:flex">
            <Search className="h-4 w-4" />
            <input
              aria-label="Search patients"
              placeholder="Search patient..."
              className="w-44 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5 rounded-full bg-emerald-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
            </span>
            <span className="font-semibold uppercase tracking-[0.18em] text-slate-600">LIVE</span>
            <span className="hidden sm:inline text-slate-500">● ICU-A</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((value) => !value)}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Notification center</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">Alerts</h3>
                  </div>
                  <button onClick={markAllRead} className="text-xs font-medium text-cyan-700 hover:text-cyan-800">
                    Mark all read
                  </button>
                </div>

                <div className="mb-3 flex gap-2">
                  {(['All', 'Critical', 'Warning', 'Information'] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
                        filter === item ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="max-h-[320px] space-y-2 overflow-y-auto">
                  {notifications
                    .filter((item) => filter === 'All' || item.category === filter)
                    .map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                          notification.read ? 'border-slate-200 bg-slate-50' : 'border-cyan-200 bg-cyan-50/60'
                        }`}
                      >
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          notification.category === 'Critical' ? 'bg-red-500' : notification.category === 'Warning' ? 'bg-amber-500' : 'bg-cyan-500'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-cyan-500" />}
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{notification.patientId ?? 'System'} • {notification.message}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
                            <span>{notification.category}</span>
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <button className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-100">
            <SunMedium className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'Dr. Sarah Williams'}</p>
                <p className="text-xs text-slate-500">{user?.role ?? 'ICU Consultant'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                  Profile
                </Link>
                <Link to="/settings" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                  Settings
                </Link>
                <button onClick={handleLogout} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50">
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 shadow-sm lg:flex">
            <CalendarDays className="h-4 w-4" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
