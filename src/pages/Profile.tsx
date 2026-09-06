import { Camera, Edit3, Lock, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
  name: '',
  email: '',
  phone: '',
  department: '',
  role: '',
})

useEffect(() => {
  if (user) {
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      role: user.role || '',
    })
  }
}, [user])
  const handleSave = () => {
    if (!user) return
    updateUser({ ...user, ...form, name: form.name, email: form.email, phone: form.phone, department: form.department, role: form.role })
  }

  const initials = (user?.name ?? '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-cyan-200">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-sm">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Clinician profile</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{user?.name ?? ''}</h2>
              <p className="mt-1 text-sm text-slate-600">{user?.role ?? ''} • {user?.department ?? ''}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Lock className="h-4 w-4" />
              Change Password
            </button>
            <button onClick={handleSave} className="primary-button">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Profile</p>
              <h3 className="text-xl font-bold text-slate-900">Account details</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="field-input" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
              <input value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="field-input" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <div className="field-input flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full border-none bg-transparent text-sm text-slate-800 outline-none" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Phone</span>
              <div className="field-input flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full border-none bg-transparent text-sm text-slate-800 outline-none" />
              </div>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Department</span>
              <input value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} className="field-input" />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Security</p>
                <h3 className="text-xl font-bold text-slate-900">Access status</h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span>Account status</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span>Authentication</span>
                <span className="font-medium text-slate-800">Protected</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span>Service account</span>
                <span className="font-medium text-slate-800">ICU staff</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Account created</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
            <p className="mt-2 text-sm text-slate-600">This profile can be connected to your hospital identity provider or backend user record as soon as it becomes available.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
