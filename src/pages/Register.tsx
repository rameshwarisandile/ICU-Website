import { motion } from 'framer-motion'
import { AlertCircle, Check, Eye, EyeOff, Home, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = ['ICU Consultant', 'Doctor', 'Nurse', 'Administrator']
const departments = ['ICU', 'Emergency', 'Cardiology', 'Neurology', 'General Medicine', 'Administration']
const doctorBackgroundImage =
  'https://www.mcgill.ca/desautels/files/desautels/styles/hd/public/mohamed-badawy-gchm-960x537.jpg?itok=U9T_BOfW&timestamp=1663944897'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ICU Consultant',
    department: 'ICU',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const passwordStrength = useMemo(() => {
    const value = form.password
    if (!value) return { label: 'No password', color: 'bg-slate-200', width: '0%' }
    if (value.length < 8) return { label: 'Weak', color: 'bg-red-500', width: '35%' }
    if (value.length < 12) return { label: 'Moderate', color: 'bg-amber-500', width: '65%' }
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' }
  }, [form.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword || !form.phone) {
      setError('Please complete all required fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!/^\+?[0-9\s()-]{8,20}$/.test(form.phone)) {
      setError('Please enter a valid phone number.')
      return
    }

    setSubmitting(true)

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
        phone: form.phone,
      })
      setSuccess('Account created successfully')
      window.setTimeout(() => navigate('/login'), 900)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to create account.')
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
      <div className="mx-auto flex min-h-screen w-full items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-700/60 bg-slate-950/90 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl"
        >
          <div className="grid md:grid-cols-[0.82fr_1.18fr]">
            <div className="relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_28%),linear-gradient(180deg,#0a1629,#0e172b_40%,#0b1220)] p-8 md:border-b-0 md:border-r">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
                    <ShieldCheck className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-200/80">ICU Intelligence</p>
                    <h2 className="text-lg font-semibold text-white">Trust-first care</h2>
                  </div>
                </div>

                <div className="mt-10 max-w-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/80">New account</p>
                  <h3 className="mt-4 text-4xl font-semibold leading-tight text-white">Create your ICU Intelligence account</h3>
                </div>

                <div className="mt-8 space-y-4 rounded-3xl border border-slate-700/60 bg-slate-900/50 p-5">
                  {[
                    'HIPAA-aware access controls',
                    'Secure staff onboarding',
                    'Real-time monitoring access',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                        <Check className="h-4 w-4" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 md:p-10">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Enrollment</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-900">Create account</h3>
                </div>
                <div className="rounded-2xl bg-cyan-50 p-2.5 text-cyan-700">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
                    <input
                      required
                      value={form.fullName}
                      onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                      className="field-input"
                      placeholder="Dr. Sarah Williams"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                    <div className="field-input flex items-center gap-3">
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
                    <div className="field-input flex items-center gap-3">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                        className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        placeholder="Create password"
                      />
                      <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="text-slate-500 hover:text-slate-700">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</span>
                    <div className="field-input flex items-center gap-3">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={form.confirmPassword}
                        onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                        className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        placeholder="Confirm password"
                      />
                      <button type="button" aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'} onClick={() => setShowConfirmPassword((value) => !value)} className="text-slate-500 hover:text-slate-700">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                    <select
                      value={form.role}
                      onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                      className="field-input"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Department</span>
                    <select
                      value={form.department}
                      onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
                      className="field-input"
                    >
                      {departments.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Phone Number</span>
                    <div className="field-input flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                        className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        placeholder="+1 (415) 204-1188"
                      />
                    </div>
                  </label>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>Password strength</span>
                    <span className="text-slate-700">{passwordStrength.label}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-70">
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-cyan-700 transition hover:text-cyan-800">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
