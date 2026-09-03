const SettingsPage = () => (
  <div className="space-y-6 p-6">
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Settings</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">System configuration</h2>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Hospital information</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 p-3"><span className="font-semibold">Hospital:</span> North Ridge Medical Center</div>
          <div className="rounded-2xl bg-slate-50 p-3"><span className="font-semibold">ICU units:</span> ICU-1, ICU-2, ICU-3</div>
          <div className="rounded-2xl bg-slate-50 p-3"><span className="font-semibold">Coverage:</span> 24/7 critical care</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Alert thresholds</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 p-3">SpO2 threshold: 88%</div>
          <div className="rounded-2xl bg-slate-50 p-3">Heart rate threshold: 120 bpm</div>
          <div className="rounded-2xl bg-slate-50 p-3">Temperature threshold: 38.5°C</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Notification settings</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 p-3">Email alerts: Enabled</div>
          <div className="rounded-2xl bg-slate-50 p-3">SMS escalation: Enabled</div>
          <div className="rounded-2xl bg-slate-50 p-3">Dashboard notifications: Enabled</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">Security & data settings</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 p-3">Audit logs: Enabled</div>
          <div className="rounded-2xl bg-slate-50 p-3">Role-based access: Standard</div>
          <div className="rounded-2xl bg-slate-50 p-3">Data mode: Demo dataset only</div>
        </div>
      </div>
    </div>
  </div>
)

export default SettingsPage
