export function EmptyState({ title, description }) {
  return (
    <div className="rounded border border-dashed border-[#2A2828] bg-[#151417] p-8 text-center">
      <div className="text-lg font-medium text-[#EDE9E6]">{title}</div>
      <p className="mt-2 text-sm text-[#7A7570]">{description}</p>
    </div>
  )
}
