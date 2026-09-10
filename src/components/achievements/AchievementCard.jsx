export function AchievementCard({ achievement }) {
  const { title, description, icon, isUnlocked, unlockedAt } = achievement

  return (
    <div
      className={[
        'relative flex flex-col justify-between rounded border p-5 transition-all',
        isUnlocked
          ? 'border-[#C81E3A] bg-[#151417] shadow-[0_0_16px_rgba(200,30,58,0.2)]'
          : 'border-[#2A2828] bg-[#0A0A0B]/80 opacity-60 grayscale',
      ].join(' ')}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2828] bg-[#0A0A0B] text-2xl shadow-inner">
            {icon}
          </div>

          {isUnlocked ? (
            <span className="rounded border border-green-700/60 bg-green-950/40 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-green-400">
              TERBUKA ✓
            </span>
          ) : (
            <span className="rounded border border-[#2A2828] bg-[#151417] px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#7A7570]">
              TERKUNCI 🔒
            </span>
          )}
        </div>

        <h3 className="mt-3 font-['Bebas_Neue'] text-2xl tracking-wide text-[#EDE9E6]">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[#7A7570]">{description}</p>
      </div>

      <div className="mt-4 border-t border-[#2A2828] pt-3 text-[11px] text-[#4A4844]">
        {isUnlocked ? (
          <span>
            Tercapai pada:{' '}
            <strong className="text-[#EDE9E6]">
              {unlockedAt ? new Date(unlockedAt).toLocaleDateString('id-ID') : 'Hari ini'}
            </strong>
          </span>
        ) : (
          <span>Selesaikan kriteria di atas untuk membuka</span>
        )}
      </div>
    </div>
  )
}
