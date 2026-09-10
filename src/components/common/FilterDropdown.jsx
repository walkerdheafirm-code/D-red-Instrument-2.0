export function FilterDropdown({ label, value, onChange, options, emptyLabel = 'Semua' }) {
  return (
    <label className="block text-sm text-[#EDE9E6]">
      <span className="mb-2 block text-[#7A7570]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
