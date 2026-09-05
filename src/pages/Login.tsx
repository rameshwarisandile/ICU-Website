import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Home, Lock, Mail, ShieldCheck, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const doctorBackgroundImage =
  'https://www.mcgill.ca/desautels/files/desautels/styles/hd/public/mohamed-badawy-gchm-960x537.jpg?itok=U9T_BOfW&timestamp=1663944897'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: 'admin@icu.local', password: 'admin123' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await login(form.email, form.password)
      setSuccess('Access granted. Redirecting to the ICU command center...')
      window.setTimeout(() => navigate('/dashboard'), 600)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url("${doctorBackgroundImage}")` }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="medical-grid" />

      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/25 backdrop-blur transition hover:bg-white/15 md:left-8 md:top-8"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center p-4 md:p-8">
        <div className="auth-panel grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-700/60 bg-slate-950/80 shadow-[0_30px_80px_rgba(15,23,42,0.5)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),transparent_35%),linear-gradient(180deg,#0b1729,#0f172a_35%,#0b1220)] p-8 md:border-b-0 md:border-r"
          >
            <div className="absolute inset-0 opacity-40" aria-hidden="true">
              <div className="absolute left-8 top-12 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-sky-500/15 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
                    <Stethoscope className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200/80">ICU Intelligence</p>
                    <h1 className="text-xl font-semibold text-white">Command Center</h1>
                  </div>
                </div>

                <div className="mt-12 max-w-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/75">Clinical decision support</p>
                  <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                    Intelligent Monitoring.
                    <span className="block text-cyan-300">Faster Decisions.</span>
                    <span className="block text-slate-200">Better patient outcomes.</span>
                  </h2>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-5 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-300">
                  <span>System status</span>
                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    <span className="status-dot success" />
                    Secure
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['24/7', 'Monitoring'],
                    ['99.98%', 'Uptime'],
                    ['AI', 'Ready'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
                      <p className="text-lg font-semibold text-white">{value}</p>
                      <p className="mt-1 text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center bg-white p-6 sm:p-8 md:p-10"
          >
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Welcome back</p>
                  <h3 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h3>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">Secure access for authorized healthcare personnel.</p>
              <p className="mt-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-800">
                Demo login: admin@icu.local / admin123
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-100">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      placeholder="name@hospital.org"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-100">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                      className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      placeholder="Enter your password"
                    />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="text-slate-500 transition hover:text-slate-700">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                    Remember me
                  </label>
                  <button type="button" className="font-medium text-cyan-700 transition hover:text-cyan-800">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Signing in...' : 'Login'}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-600">
                Don’t have an account?{' '}
                <Link to="/register" className="font-semibold text-cyan-700 transition hover:text-cyan-800">
                  Create Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
