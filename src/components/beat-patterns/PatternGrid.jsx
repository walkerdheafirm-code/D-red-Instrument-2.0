import { memo } from 'react'

const TRACK_META = {
  // Drum Kit tracks
  kick:   { name: 'KICK',   emoji: '🟥' },
  snare:  { name: 'SNARE',  emoji: '🔶' },
  hihat:  { name: 'HI-HAT', emoji: '⭕' },
  tom:    { name: 'TOM',    emoji: '🔵' },
  cymbal: { name: 'CYMBAL', emoji: '⭕' },
  clap:   { name: 'CLAP',   emoji: '👏' },

  // Launchpad tracks
  '1': { name: 'PAD 1 · KICK',   emoji: '🔲' },
  '2': { name: 'PAD 2 · SNARE',  emoji: '🔲' },
  '3': { name: 'PAD 3 · HI-HAT', emoji: '🔲' },
  '4': { name: 'PAD 4 · CRASH',  emoji: '🔲' },
}

export const PatternGrid = memo(function PatternGrid({
  steps = [],
  onToggleStep,
  currentStep = -1,
  readOnly = false,
}) {
  return (
    <div className="overflow-x-auto select-none pb-1">
      <div className="min-w-[460px] sm:min-w-[540px] space-y-2">
        {/* Step Numbers Header */}
        <div className="grid grid-cols-[100px_repeat(8,1fr)] sm:grid-cols-[140px_repeat(8,1fr)] gap-1.5 text-center font-mono text-xs">
          <span className="text-left text-[11px] uppercase tracking-wider text-[#7A7570] self-center truncate">
            Track / Step
          </span>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((stepIdx) => {
            const isCurrent = currentStep === stepIdx
            return (
              <div
                key={stepIdx}
                className={[
                  'rounded py-1 transition-colors text-[11px] sm:text-xs',
                  isCurrent
                    ? 'bg-[#C81E3A] font-bold text-white shadow-[0_0_8px_#C81E3A]'
                    : 'bg-[#151417] text-[#7A7570]',
                ].join(' ')}
              >
                {stepIdx + 1}
              </div>
            )
          })}
        </div>

        {/* Track Rows */}
        {steps.map((row) => {
          const meta = TRACK_META[row.track] || { name: row.track.toUpperCase(), emoji: '●' }

          return (
            <div
              key={row.track}
              className="grid grid-cols-[100px_repeat(8,1fr)] sm:grid-cols-[140px_repeat(8,1fr)] items-center gap-1.5"
            >
              {/* Track Name */}
              <div className="flex items-center gap-1.5 sm:gap-2 rounded border border-[#2A2828] bg-[#151417] px-2 py-1.5 sm:px-2.5 sm:py-2">
                <span className="text-xs leading-none">{meta.emoji}</span>
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#EDE9E6] truncate">
                  {meta.name}
                </span>
              </div>

              {/* 8 Step Buttons */}
              {row.active.map((isActive, stepIdx) => {
                const isCurrent = currentStep === stepIdx

                return (
                  <button
                    key={stepIdx}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onToggleStep?.(row.track, stepIdx)}
                    className={[
                      'h-9 sm:h-10 rounded border transition-all duration-75',
                      readOnly ? 'cursor-default' : 'cursor-pointer',
                      isActive
                        ? isCurrent
                          ? 'scale-105 border-white bg-[#C81E3A] shadow-[0_0_12px_#C81E3A]'
                          : 'border-[#C81E3A] bg-[#6B1420] shadow-[inset_0_0_0_1px_#C81E3A]'
                        : isCurrent
                        ? 'border-[#7A7570] bg-[#2A2828]'
                        : 'border-[#2A2828] bg-[#0A0A0B] hover:border-[#7A7570]',
                    ].join(' ')}
                    title={`${meta.name} - Step ${stepIdx + 1} (${isActive ? 'Aktif' : 'Non-aktif'})`}
                  >
                    <span className="sr-only">Step {stepIdx + 1}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
})
