export function PatternCard({
  pattern,
  isPlaying = false,
  currentStep = -1,
  onTogglePlay,
  onEdit,
  onDelete,
}) {
  const isDrum = pattern.instrument === 'drumkit'

  return (
    <div
      className={[
        'flex flex-col justify-between gap-4 rounded border p-5 transition-all',
        isPlaying
          ? 'border-[#C81E3A] bg-[#151417] shadow-[0_0_16px_rgba(200,30,58,0.25)]'
          : 'border-[#2A2828] bg-[#151417] hover:border-[#7A7570]',
      ].join(' ')}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{isDrum ? '🥁' : '🔲'}</span>
            <div>
              <h3 className="font-semibold text-[#EDE9E6] text-base leading-snug">
                {pattern.name}
              </h3>
              <p className="text-xs uppercase tracking-wider text-[#7A7570]">
                {isDrum ? 'Drum Kit' : 'Launchpad'} · 8 Steps
              </p>
            </div>
          </div>

          {pattern.isDefault ? (
            <span className="rounded border border-[#7A7570]/30 bg-[#2A2828]/50 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#7A7570]">
              PRESET
            </span>
          ) : (
            <span className="rounded border border-[#C81E3A]/40 bg-[#6B1420]/30 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#C81E3A]">
              KUSTOM
            </span>
          )}
        </div>

        {/* Mini 8-Step Matrix Visualization */}
        <div className="mt-4 space-y-1 rounded border border-[#2A2828] bg-[#0A0A0B] p-3">
          {pattern.steps.slice(0, 4).map((row) => (
            <div key={row.track} className="flex items-center gap-1">
              <span className="w-12 truncate font-mono text-[9px] uppercase text-[#7A7570]">
                {row.track}
              </span>
              <div className="flex flex-1 gap-1">
                {row.active.map((isActive, idx) => {
                  const isCurrent = currentStep === idx
                  return (
                    <div
                      key={idx}
                      className={[
                        'h-2 flex-1 rounded-sm transition-all',
                        isActive
                          ? isCurrent
                            ? 'bg-white shadow-[0_0_6px_#C81E3A]'
                            : 'bg-[#C81E3A]'
                          : isCurrent
                          ? 'bg-[#4A4844]'
                          : 'bg-[#2A2828]',
                      ].join(' ')}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-[#2A2828] pt-3">
        <button
          type="button"
          onClick={() => onTogglePlay(pattern)}
          className={[
            'flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-xs font-semibold transition',
            isPlaying
              ? 'border border-[#C81E3A] bg-[#C81E3A] text-white shadow-[0_0_10px_#C81E3A]'
              : 'border border-[#2A2828] bg-[#0A0A0B] text-[#EDE9E6] hover:border-[#C81E3A] hover:text-[#C81E3A]',
          ].join(' ')}
        >
          <span>{isPlaying ? '■' : '▶'}</span>
          <span>{isPlaying ? 'Stop' : 'Play Loop'}</span>
        </button>

        <div className="flex items-center gap-2">
          {!pattern.isDefault ? (
            <>
              <button
                type="button"
                onClick={() => onEdit(pattern)}
                className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2.5 py-1 text-xs text-[#7A7570] transition hover:border-[#EDE9E6] hover:text-[#EDE9E6]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(pattern)}
                className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2.5 py-1 text-xs text-red-400 transition hover:border-red-500 hover:bg-red-950/30"
              >
                Hapus
              </button>
            </>
          ) : (
            <span className="text-[11px] text-[#4A4844]">🔒 Default</span>
          )}
        </div>
      </div>
    </div>
  )
}
