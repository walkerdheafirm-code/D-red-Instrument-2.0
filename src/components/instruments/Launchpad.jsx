import { useEffect, useState } from 'react'
import { LAUNCHPAD_PADS } from '../../hooks/useAudioEngine'

export function Launchpad({ onPlayPad }) {
  const [activePads, setActivePads] = useState(new Set())

  const triggerPad = (pad) => {
    onPlayPad(pad)
    setActivePads((prev) => {
      const next = new Set(prev)
      next.add(pad.id)
      return next
    })
    setTimeout(() => {
      setActivePads((prev) => {
        const next = new Set(prev)
        next.delete(pad.id)
        return next
      })
    }, 150)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat || event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
        return
      }
      const char = event.key.toUpperCase()
      const foundPad = LAUNCHPAD_PADS.find((p) => p.key === char)
      if (foundPad) {
        triggerPad(foundPad)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPlayPad])

  return (
    <div className="rounded border border-[#2A2828] bg-[#151417] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[#C81E3A]">
            Launchpad (4x4 Performance Grid)
          </h2>
          <p className="text-xs text-[#7A7570]">
            Tekan pad atau gunakan tombol keyboard fisik (`1–4`, `Q–R`, `A–F`, `Z–V`).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {LAUNCHPAD_PADS.map((pad) => {
          const isActive = activePads.has(pad.id)

          return (
            <button
              key={pad.id}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault()
                triggerPad(pad)
              }}
              style={{ touchAction: 'manipulation' }}
              className={`flex h-24 flex-col items-center justify-between select-none rounded border p-3 transition-all sm:h-28 ${
                isActive
                  ? 'scale-95 border-[#C81E3A] bg-[#6B1420] shadow-[0_0_12px_2px_#C81E3A,inset_0_0_0_2px_#C81E3A]'
                  : `border-[#2A2828] bg-[#0A0A0B] hover:border-[#C81E3A]/60 ${pad.color}`
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#C81E3A]">{pad.key}</span>
                <span className="text-[10px] text-[#7A7570]">Pad {pad.id}</span>
              </div>

              <span className="text-center font-medium text-xs text-[#EDE9E6]">{pad.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
