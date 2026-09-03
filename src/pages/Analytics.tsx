import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const occupancy = [
  { date: 'Apr 1', value: 70 },
  { date: 'Apr 5', value: 74 },
  { date: 'Apr 10', value: 78 },
  { date: 'Apr 15', value: 81 },
  { date: 'Apr 20', value: 83 },
  { date: 'Apr 25', value: 80 },
  { date: 'Apr 30', value: 85 },
]

const admissions = [
  { date: 'Apr 1', value: 12 },
  { date: 'Apr 5', value: 14 },
  { date: 'Apr 10', value: 15 },
  { date: 'Apr 15', value: 17 },
  { date: 'Apr 20', value: 18 },
  { date: 'Apr 25', value: 15 },
  { date: 'Apr 30', value: 20 },
]

const riskData = [
  { name: 'High', value: 15, color: '#ef4444' },
  { name: 'Medium', value: 34, color: '#f59e0b' },
  { name: 'Low', value: 51, color: '#22c55e' },
]

const alertData = [
  { date: 'Mon', value: 12 },
  { date: 'Tue', value: 14 },
  { date: 'Wed', value: 16 },
  { date: 'Thu', value: 18 },
  { date: 'Fri', value: 15 },
  { date: 'Sat', value: 19 },
  { date: 'Sun', value: 13 },
]

const AnalyticsPage = () => (
  <div className="space-y-6 p-6">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Analytics</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">ICU performance analytics</h2>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
        {['Today', '7 Days', '30 Days', 'Custom'].map((range) => (
          <button key={range} type="button" className={`rounded-lg px-3 py-1.5 text-sm ${range === '30 Days' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
            {range}
          </button>
        ))}
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">ICU occupancy</p><p className="mt-2 text-3xl font-bold text-slate-900">82%</p></div>
      <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Admissions</p><p className="mt-2 text-3xl font-bold text-slate-900">145</p></div>
      <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Discharges</p><p className="mt-2 text-3xl font-bold text-slate-900">128</p></div>
      <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Avg LOS</p><p className="mt-2 text-3xl font-bold text-slate-900">6.4d</p></div>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">ICU occupancy</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={occupancy}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1d9bf0" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Patient admission trend</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={admissions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Risk distribution</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskData} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3}>
                {riskData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Alert frequency</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="text-lg font-semibold text-slate-900">Historical outcome analytics</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Improved</p><p className="mt-2 text-3xl font-bold text-slate-900">64%</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Transferred</p><p className="mt-2 text-3xl font-bold text-slate-900">22%</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Readmission</p><p className="mt-2 text-3xl font-bold text-slate-900">14%</p></div>
      </div>
    </div>
  </div>
)

export default AnalyticsPage
