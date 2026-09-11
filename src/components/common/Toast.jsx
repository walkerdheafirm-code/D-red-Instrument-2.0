export function Toast({ message, title, icon = '★', isOpen, onClose, onClick, isSpecial = false }) {
  if (!isOpen || !message) return null

  if (isSpecial) {
    return (
      <aside
        aria-label="Notifikasi Pencapaian Spesial"
        onClick={onClick}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-lg rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-[#2a1b07] via-[#3a250a] to-[#1e1305] p-5 text-[#EDE9E6] shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.6)] backdrop-blur-xl transition-all duration-300 ${
          onClick ? 'cursor-pointer group hover:scale-[1.02] active:scale-[0.99] hover:border-amber-300' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-400 to-amber-600 text-4xl text-black shadow-[0_0_25px_rgba(245,158,11,0.85)] group-hover:scale-105 transition-transform">
            {icon || '🏆'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-950/80 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-300 shadow-sm">
              <span>✦</span> SEMUA ACHIEVEMENT TERCAPAI
            </div>
            <h2 className="mt-1 font-['Bebas_Neue'] text-3xl tracking-wide text-amber-300 drop-shadow leading-none">
              {title || 'Prestasi Legendaris!'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-amber-100 leading-snug">
              {message}
            </p>
            {onClick && (
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-300/90 group-hover:text-amber-200 group-hover:translate-x-0.5 transition-all">
                <span>Buka Halaman Achievement</span>
                <span>➔</span>
              </div>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              aria-label="Tutup notifikasi"
              title="Tutup notifikasi"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-400/50 bg-amber-400/20 text-amber-200 hover:bg-amber-400 hover:text-black shadow-md transition-all cursor-pointer font-bold text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </aside>
    )
  }

  return (
    <aside
      aria-label="Notifikasi Pencapaian Terbuka"
      onClick={onClick}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md rounded-2xl border-2 border-red-500 bg-gradient-to-r from-[#21161d] via-[#29171f] to-[#1c141d] p-4 text-[#EDE9E6] shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(239,68,68,0.55)] backdrop-blur-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer group hover:scale-[1.02] active:scale-[0.99] hover:border-red-400' : ''
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/60 bg-gradient-to-br from-red-500 to-rose-700 text-2xl text-white shadow-[0_0_18px_rgba(239,68,68,0.7)] group-hover:scale-105 transition-transform">
          {icon || '★'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 rounded-full border border-red-500/50 bg-red-950/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red-300">
            <span>●</span> ACHIEVEMENT TERBUKA
          </div>
          <p className="mt-0.5 text-sm font-bold text-white leading-snug">
            {message}
          </p>
          {onClick && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-300 group-hover:text-red-200 group-hover:translate-x-0.5 transition-all">
              <span>Buka Halaman Achievement</span>
              <span>➔</span>
            </div>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Tutup notifikasi"
            title="Tutup notifikasi"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-zinc-200 hover:bg-red-600 hover:text-white hover:border-red-400 shadow-sm transition-all cursor-pointer font-bold text-base"
          >
            ✕
          </button>
        )}
      </div>
    </aside>
  )
}
