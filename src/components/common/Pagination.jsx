export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) {
  if (totalPages <= 1) return null

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null

  return (
    <div className="flex flex-col gap-3 rounded border border-[#2A2828] bg-[#151417] p-4 text-sm text-[#7A7570] sm:flex-row sm:items-center sm:justify-between">
      <div>
        {totalItems ? (
          <span>
            Menampilkan <strong className="text-[#EDE9E6]">{startItem}–{endItem}</strong> dari{' '}
            <strong className="text-[#EDE9E6]">{totalItems}</strong> rekaman
          </span>
        ) : (
          <span>Halaman {currentPage} dari {totalPages}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1.5 text-[#EDE9E6] transition hover:border-[#C81E3A] hover:text-[#C81E3A] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#2A2828] disabled:hover:text-[#EDE9E6]"
        >
          ← Prev
        </button>

        <span className="min-w-[60px] text-center font-mono text-xs text-[#EDE9E6]">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1.5 text-[#EDE9E6] transition hover:border-[#C81E3A] hover:text-[#C81E3A] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#2A2828] disabled:hover:text-[#EDE9E6]"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
