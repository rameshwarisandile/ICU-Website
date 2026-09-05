import { motion } from 'framer-motion'
import { Activity, ArrowRight, HeartPulse, LockKeyhole, LogIn, ShieldCheck, Stethoscope, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

const doctorHeroImage =
  'https://www.mcgill.ca/desautels/files/desautels/styles/hd/public/mohamed-badawy-gchm-960x537.jpg?itok=U9T_BOfW&timestamp=1663944897'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section
        className="relative flex min-h-[92vh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url("${doctorHeroImage}")` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.94)_0%,rgba(15,23,42,0.76)_42%,rgba(15,23,42,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/15 ring-1 ring-cyan-300/35">
                <Stethoscope className="h-6 w-6 text-cyan-200" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-100/80">
                  ICU
                </span>
                <span className="block text-lg font-bold tracking-normal">Intelligence</span>
              </span>
            </Link>

            <nav className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </nav>
          </header>

          <div className="flex flex-1 items-center pb-14 pt-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Secure ICU Command Center
              </p>
              <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                ICU Intelligence
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-100 sm:text-xl">
                Real-time patient monitoring, risk prediction, alerts, and clinical support in one focused workspace
                for doctors and critical care teams.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-950/30 transition hover:bg-cyan-200"
                >
                  <UserPlus className="h-5 w-5" />
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
          {[
            { icon: HeartPulse, value: '40+', label: 'Demo ICU patients' },
            { icon: Activity, value: 'Live', label: 'Vitals and risk trends' },
            { icon: LockKeyhole, value: 'Secure', label: 'Protected staff access' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/75 p-5">
              <item.icon className="h-6 w-6 text-cyan-300" />
              <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
