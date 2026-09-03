const inventoryData = [
  { name: 'Vasopressors', category: 'Medicines', quantity: 14, minimum: 8, status: 'Healthy', updated: '2h ago' },
  { name: 'IV Fluids', category: 'Consumables', quantity: 9, minimum: 12, status: 'Low stock', updated: '45m ago' },
  { name: 'Ventilator Tubing', category: 'Equipment', quantity: 18, minimum: 10, status: 'Healthy', updated: '1h ago' },
  { name: 'Emergency Airway Kit', category: 'Emergency supplies', quantity: 6, minimum: 10, status: 'Low stock', updated: '30m ago' },
]

const InventoryPage = () => (
  <div className="space-y-6 p-6">
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Inventory</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">ICU inventory management</h2>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {['Medicines', 'Consumables', 'Equipment', 'Emergency supplies'].map((category) => (
        <div key={category} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{category}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{category === 'Medicines' ? 24 : category === 'Consumables' ? 18 : category === 'Equipment' ? 16 : 9}</p>
        </div>
      ))}
    </div>

    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Item name</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Quantity</th>
            <th className="px-4 py-3 font-semibold">Minimum stock</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item.name} className="border-t border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
              <td className="px-4 py-3 text-slate-600">{item.category}</td>
              <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
              <td className="px-4 py-3 text-slate-600">{item.minimum}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Low stock' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{item.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default InventoryPage
