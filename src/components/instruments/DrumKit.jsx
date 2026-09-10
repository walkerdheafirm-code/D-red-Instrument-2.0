import { useCallback, useEffect, useState } from 'react'
import { DRUM_PADS } from '../../data/drumPads'

const PAD_LABELS = {
  kick:   { emoji: '🟥', label: 'KICK' },
  snare:  { emoji: '🔶', label: 'SNARE' },
  hihat:  { emoji: '⭕', label: 'HI-HAT' },
  tom:    { emoji: '🔵', label: 'TOM' },
  cymbal: { emoji: '⭕', label: 'CYMBAL' },
  clap:   { emoji: '👏', label: 'CLAP' },
}

export function DrumKit({ onPlayPad, externalHighlight = null, disabled = false }) {
  const [activePads, setActivePads] = useState(new Set())

  const triggerPad = useCallback(
    (padId) => {
      if (disabled) return
      onPlayPad?.(padId)

      setActivePads((prev) => {
        const next = new Set(prev)
        next.add(padId)
        return next
      })

      setTimeout(() => {
        setActivePads((prev) => {
          const next = new Set(prev)
          next.delete(padId)
          return next
        })
      }, 150)
    },
    [onPlayPad, disabled]
  )

  // Keyboard mapping
  useEffect(() => {
    const keyMap = {}
    DRUM_PADS.forEach((pad) => {
      keyMap[pad.key.toLowerCase()] = pad.id
    })

    const handleKeyDown = (e) => {
      if (disabled) return
      if (e.repeat) return
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return
      const padId = keyMap[e.key.toLowerCase()]
      if (padId) triggerPad(padId)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerPad, disabled])

  return (
    <div className="space-y-4">
      {/* Pad Grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {DRUM_PADS.map((pad) => {
          const isActive = activePads.has(pad.id)
          const isHighlighted = externalHighlight === pad.id
          const isLit = isActive || isHighlighted
          const info = PAD_LABELS[pad.id] || { emoji: '🔴', label: pad.name.toUpperCase() }

          return (
            <button
              key={pad.id}
              id={`drum-pad-${pad.id}`}
              type="button"
              disabled={disabled}
              onPointerDown={(e) => {
                e.preventDefault()
                triggerPad(pad.id)
              }}
              style={{ touchAction: 'manipulation' }}
              className={[
                'relative flex flex-col items-center justify-center gap-1.5 rounded border',
                'select-none transition-all duration-100',
                'min-h-[96px] sm:h-28',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                isLit
                  ? 'scale-[0.97] border-[#C81E3A] bg-[#6B1420]/50 shadow-[0_0_12px_2px_#C81E3A,inset_0_0_0_2px_#C81E3A]'
                  : 'border-[#2A2828] bg-[#151417] hover:border-[#C81E3A]/50 hover:bg-[#1C1B1E]',
              ].join(' ')}
            >
              <span className="text-xl leading-none">{info.emoji}</span>
              <span
                className={[
                  'font-mono text-xs font-bold tracking-widest',
                  isLit ? 'text-[#EDE9E6]' : 'text-[#7A7570]',
                ].join(' ')}
              >
                {info.label}
              </span>
              <span
                className={[
                  'absolute bottom-1.5 right-2 font-mono text-[10px]',
                  isLit ? 'text-[#C81E3A]' : 'text-[#4A4844]',
                ].join(' ')}
              >
                [{pad.key}]
              </span>
            </button>
          )
        })}
      </div>

      {/* Keyboard Hint */}
      <div className="flex flex-wrap gap-2 text-xs text-[#4A4844]">
        {DRUM_PADS.map((pad) => (
          <span key={pad.id} className="font-mono">
            <kbd className="rounded border border-[#2A2828] bg-[#0A0A0B] px-1.5 py-0.5 text-[#7A7570]">
              {pad.key}
            </kbd>
            {' '}= {pad.name}
          </span>
        ))}
      </div>
    </div>
  )
}
