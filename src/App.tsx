import { useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

function AppShell() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  if (isAuthRoute) {
    return <AppRoutes />
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <Header />
        <main className="min-h-[calc(100vh-88px)] bg-slate-100">
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppShell />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
