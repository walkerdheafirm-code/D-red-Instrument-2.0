import { useState } from 'react'
import { playStudioEnterSound } from '../../utils/uiSound'

export function SplashScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false)

  const handleEnterStudio = () => {
    if (isExiting) return
    playStudioEnterSound()
    setIsExiting(true)
    setTimeout(() => {
      onComplete()
    }, 380)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleEnterStudio}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          handleEnterStudio()
        }
      }}
      className={[
        'fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#0A0A0B] p-8 sm:p-12 select-none cursor-pointer transition-all duration-300',
        isExiting ? 'splash-exit pointer-events-none' : 'opacity-100',
      ].join(' ')}
      title="Klik di mana saja untuk masuk ke Dashboard"
    >
      {/* Top Studio Brand Mark */}
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[#7A7570] opacity-80">
        <span className="h-2 w-2 rounded-full bg-[#C81E3A] animate-pulse" />
        <span>Studio Audio Digital 2.0</span>
      </div>

      {/* Main Center Stage */}
      <div className="flex flex-col items-center px-4 text-center splash-enter max-w-2xl">
        <h1 className="font-['Bebas_Neue'] text-7xl sm:text-8xl md:text-9xl tracking-wider text-[#C81E3A] glow-red leading-none">
          D'red Instrument
        </h1>
        <p className="mt-3 font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-[#EDE9E6] font-medium">
          Virtual Instruments & Performance Sequencer
        </p>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
          <span className="rounded border border-[#2A2828] bg-[#151417]/80 px-3 py-1 text-[#EDE9E6]">
            🎹 3 Oktav Piano
          </span>
          <span className="rounded border border-[#2A2828] bg-[#151417]/80 px-3 py-1 text-[#EDE9E6]">
            🔲 4×4 Launchpad
          </span>
          <span className="rounded border border-[#2A2828] bg-[#151417]/80 px-3 py-1 text-[#EDE9E6]">
            🥁 Digital Drum Kit
          </span>
          <span className="rounded border border-[#2A2828] bg-[#151417]/80 px-3 py-1 text-[#EDE9E6]">
            🎛️ 8-Step Sequencer
          </span>
        </div>

        {/* Big Enter Button / Prompt */}
        <div className="mt-10">
          <div className="inline-flex items-center gap-3 rounded border border-[#C81E3A] bg-[#6B1420]/40 px-6 py-3 font-mono text-sm font-bold text-white shadow-[0_0_20px_rgba(200,30,58,0.5)] transition hover:bg-[#C81E3A] hover:scale-105">
            <span>Masuk ke Studio</span>
            <span className="text-[#EDE9E6]">→</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Hint */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#7A7570]">
        <span className="text-[#C81E3A]">●</span>
        <span>Klik di mana saja pada layar atau tekan [Enter] untuk melanjutkan</span>
      </div>
    </div>
  )
}
