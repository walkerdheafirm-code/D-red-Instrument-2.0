export function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    default: 'border-[#2A2828] bg-[#0A0A0B] text-[#EDE9E6]',
    favorite: 'border-[#C81E3A] bg-[#6B1420]/40 text-[#EDE9E6]',
    accent: 'border-[#C81E3A] bg-[#C81E3A] text-white',
    muted: 'border-[#2A2828] bg-[#151417] text-[#7A7570]',
  }

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium tracking-wide ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  )
}
