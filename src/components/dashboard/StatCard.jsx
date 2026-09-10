export function StatCard({ title, value, subtext, icon, className = '' }) {
  return (
    <div
      className={`group rounded border border-[#2A2828] bg-[#151417] p-5 transition hover:border-[#C81E3A] hover:shadow-[0_0_15px_rgba(200,30,58,0.25)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[#7A7570] font-medium">{title}</span>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded border border-[#2A2828] bg-[#0A0A0B] text-[#C81E3A] transition group-hover:border-[#C81E3A]">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-[#EDE9E6]">
        {value}
      </div>

      {subtext && <p className="mt-1 text-xs text-[#7A7570]">{subtext}</p>}
    </div>
  )
}
