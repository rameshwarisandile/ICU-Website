import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-300">
        <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 shadow-lg shadow-slate-950/30">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
          <span className="text-sm font-medium tracking-[0.2em] uppercase text-slate-300">Loading workspace</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
