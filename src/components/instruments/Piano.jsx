import { useEffect, useState } from 'react'

export const PIANO_KEYS = [
  // Octave 3
  { note: 'C3', key: '1', isBlack: false, label: 'C3', shortcut: '1' },
  { note: 'C#3', key: '!', isBlack: true, label: 'C#3', shortcut: '!' },
  { note: 'D3', key: '2', isBlack: false, label: 'D3', shortcut: '2' },
  { note: 'D#3', key: '@', isBlack: true, label: 'D#3', shortcut: '@' },
  { note: 'E3', key: '3', isBlack: false, label: 'E3', shortcut: '3' },
  { note: 'F3', key: '4', isBlack: false, label: 'F3', shortcut: '4' },
  { note: 'F#3', key: '$', isBlack: true, label: 'F#3', shortcut: '$' },
  { note: 'G3', key: '5', isBlack: false, label: 'G3', shortcut: '5' },
  { note: 'G#3', key: '%', isBlack: true, label: 'G#3', shortcut: '%' },
  { note: 'A3', key: '6', isBlack: false, label: 'A3', shortcut: '6' },
  { note: 'A#3', key: '^', isBlack: true, label: 'A#3', shortcut: '^' },
  { note: 'B3', key: '7', isBlack: false, label: 'B3', shortcut: '7' },

  // Octave 4
  { note: 'C4', key: 'a', isBlack: false, label: 'C4', shortcut: 'A' },
  { note: 'C#4', key: 'w', isBlack: true, label: 'C#4', shortcut: 'W' },
  { note: 'D4', key: 's', isBlack: false, label: 'D4', shortcut: 'S' },
  { note: 'D#4', key: 'e', isBlack: true, label: 'D#4', shortcut: 'E' },
  { note: 'E4', key: 'd', isBlack: false, label: 'E4', shortcut: 'D' },
  { note: 'F4', key: 'f', isBlack: false, label: 'F4', shortcut: 'F' },
  { note: 'F#4', key: 't', isBlack: true, label: 'F#4', shortcut: 'T' },
  { note: 'G4', key: 'g', isBlack: false, label: 'G4', shortcut: 'G' },
  { note: 'G#4', key: 'y', isBlack: true, label: 'G#4', shortcut: 'Y' },
  { note: 'A4', key: 'h', isBlack: false, label: 'A4', shortcut: 'H' },
  { note: 'A#4', key: 'u', isBlack: true, label: 'A#4', shortcut: 'U' },
  { note: 'B4', key: 'j', isBlack: false, label: 'B4', shortcut: 'J' },

  // Octave 5
  { note: 'C5', key: 'k', isBlack: false, label: 'C5', shortcut: 'K' },
  { note: 'C#5', key: 'o', isBlack: true, label: 'C#5', shortcut: 'O' },
  { note: 'D5', key: 'l', isBlack: false, label: 'D5', shortcut: 'L' },
  { note: 'D#5', key: 'p', isBlack: true, label: 'D#5', shortcut: 'P' },
  { note: 'E5', key: ';', isBlack: false, label: 'E5', shortcut: ';' },
  { note: 'F5', key: "'", isBlack: false, label: 'F5', shortcut: "'" },
  { note: 'F#5', key: ']', isBlack: true, label: 'F#5', shortcut: ']' },
  { note: 'G5', key: 'z', isBlack: false, label: 'G5', shortcut: 'Z' },
  { note: 'G#5', key: '\\', isBlack: true, label: 'G#5', shortcut: '\\' },
  { note: 'A5', key: 'x', isBlack: false, label: 'A5', shortcut: 'X' },
  { note: 'A#5', key: 'v', isBlack: true, label: 'A#5', shortcut: 'V' },
  { note: 'B5', key: 'c', isBlack: false, label: 'B5', shortcut: 'C' },
]

export function Piano({ onPlayNote, targetNote = null, disabled = false }) {
  const [pressedKeys, setPressedKeys] = useState(new Set())

  const triggerNote = (pianoKey) => {
    console.log('[Piano] triggerNote dipanggil untuk note:', pianoKey.note)
    if (disabled) return
    onPlayNote?.(pianoKey.note)
    setPressedKeys((prev) => {
      const next = new Set(prev)
      next.add(pianoKey.note)
      return next
    })
    setTimeout(() => {
      setPressedKeys((prev) => {
        const next = new Set(prev)
        next.delete(pianoKey.note)
        return next
      })
    }, 150)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (disabled) return
      if (event.repeat || event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
        return
      }
      const char = event.key.toLowerCase()
      const foundKey = PIANO_KEYS.find((k) => k.key.toLowerCase() === char)
      if (foundKey) {
        triggerNote(foundKey)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPlayNote, disabled])

  const whiteKeys = PIANO_KEYS.filter((k) => !k.isBlack)

  return (
    <div className="rounded border border-[#2A2828] bg-[#151417] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[#C81E3A]">
            Grand Piano (3 Oktaf Penuh — C3 s.d. B5)
          </h2>
          <p className="text-xs text-[#7A7570]">
            Tekan tuts menggunakan mouse/sentuhan atau gunakan shortcut keyboard fisik (Oktaf 3: `1–7`, Oktaf 4: `A–J`, Oktaf 5: `K–C`).
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scroll-smooth">
        <div className="relative flex min-w-[980px] select-none justify-start px-2 py-2 md:justify-center">
          {whiteKeys.map((whiteKey) => {
            const isWhitePressed = pressedKeys.has(whiteKey.note)
            const isWhiteTarget = targetNote === whiteKey.note
            
            // Find corresponding sharp/black key for this white note if exists
            const baseNote = whiteKey.note.slice(0, 1)
            const octave = whiteKey.note.slice(1)
            const sharpNoteName = `${baseNote}#${octave}`
            const blackKey = PIANO_KEYS.find((k) => k.isBlack && k.note === sharpNoteName)

            const isBlackPressed = blackKey && pressedKeys.has(blackKey.note)
            const isBlackTarget = blackKey && targetNote === blackKey.note

            return (
              <div key={whiteKey.note} className="relative flex flex-col items-center">
                {/* White Key */}
                <button
                  type="button"
                  disabled={disabled}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    triggerNote(whiteKey)
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className={`relative flex h-52 w-11 select-none flex-col justify-end rounded-b border border-[#2A2828] pb-3 text-center transition-all duration-100 sm:w-12 ${
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    isWhitePressed || isWhiteTarget
                      ? 'translate-y-0.5 scale-[0.98] border-[#C81E3A] bg-white shadow-[0_0_16px_3px_#C81E3A,inset_0_0_0_2px_#C81E3A]'
                      : 'bg-[#EDE9E6] text-[#151417] shadow-[0_4px_6px_rgba(0,0,0,0.4)] hover:bg-white'
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-[#151417]">
                    {whiteKey.shortcut}
                  </span>
                  <span className="text-[10px] text-[#7A7570]">{whiteKey.label}</span>
                </button>

                {/* Black Key */}
                {blackKey && (
                  <button
                    type="button"
                    disabled={disabled}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      triggerNote(blackKey)
                    }}
                    style={{ touchAction: 'manipulation' }}
                    className={`absolute -right-3.5 top-0 z-10 flex h-32 w-7 select-none flex-col justify-end rounded-b border border-[#2A2828] pb-2 text-center transition-all duration-100 sm:-right-4 sm:w-8 ${
                      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      isBlackPressed || isBlackTarget
                        ? 'translate-y-0.5 scale-[0.97] border-[#C81E3A] bg-[#151417] shadow-[0_0_16px_3px_#C81E3A,inset_0_0_0_2px_#C81E3A]'
                        : 'bg-gradient-to-b from-[#2A2828] to-[#151417] text-[#EDE9E6] shadow-[0_6px_10px_rgba(0,0,0,0.8)] hover:from-[#3a3737]'
                    }`}
                  >
                    <span className="font-mono text-[9px] font-bold text-[#C81E3A]">
                      {blackKey.shortcut}
                    </span>
                    <span className="text-[8px] text-[#7A7570]">{blackKey.label}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
