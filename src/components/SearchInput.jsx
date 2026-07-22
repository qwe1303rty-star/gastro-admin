import { Search } from 'lucide-react'

export function SearchInput({ value, onChange, placeholder = 'Поиск заказа, клиента…' }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface-2 px-3.5 py-3">
      <Search size={18} className="text-content-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[15px] font-medium text-content outline-none placeholder:text-content-muted"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-content-muted text-xs font-semibold">
          Очистить
        </button>
      )}
    </div>
  )
}
