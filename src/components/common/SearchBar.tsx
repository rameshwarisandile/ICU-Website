import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar = ({ value, onChange, placeholder = 'Search...' }: SearchBarProps) => (
  <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm">
    <Search className="h-4 w-4" />
    <input
      aria-label="Search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
    />
  </label>
)

export default SearchBar
