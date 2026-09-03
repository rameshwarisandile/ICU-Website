interface FilterDropdownProps<T extends string> {
  value: T
  options: T[]
  onChange: (value: T) => void
  label?: string
}

const FilterDropdown = <T extends string>({ value, options, onChange, label }: FilterDropdownProps<T>) => (
  <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
    {label && <span>{label}</span>}
    <select
      aria-label={label ?? 'Filter'}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
)

export default FilterDropdown
