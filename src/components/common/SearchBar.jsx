export function SearchBar({ value, onChange, placeholder = 'Cari judul...' }) {
  return (
    <label className="block w-full text-sm text-[#EDE9E6]">
      <span className="mb-2 block text-[#7A7570]">Cari</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
      />
    </label>
  )
}
