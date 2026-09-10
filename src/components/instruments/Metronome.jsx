import { useMetronomeContext } from '../../context/MetronomeContext'
import { useMetronome } from '../../hooks/useMetronome'

export function Metronome() {
  const { tempo, setTempo, isPlaying, togglePlay, currentBeat } = useMetronomeContext()
  useMetronome()

  return (
    <div className="rounded border border-[#2A2828] bg-[#151417] p-4">
      {/* Row 1: Play button + beat dots */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex items-center gap-2 rounded border px-4 py-2 font-medium text-sm transition ${
            isPlaying
              ? 'border-[#C81E3A] bg-[#C81E3A] text-white shadow-[0_0_12px_rgba(200,30,58,0.5)]'
              : 'border-[#2A2828] bg-[#0A0A0B] text-[#EDE9E6] hover:border-[#C81E3A] hover:text-[#C81E3A]'
          }`}
        >
          <span>{isPlaying ? '⏹ Stop' : '▶ Play Metronome'}</span>
        </button>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((beatNum) => {
            const isActive = isPlaying && currentBeat === beatNum
            const isAccent = beatNum === 1

            return (
              <div
                key={beatNum}
                className={`flex h-7 w-7 items-center justify-center rounded font-mono text-xs transition-all ${
                  isActive
                    ? isAccent
                      ? 'border border-[#C81E3A] bg-[#C81E3A] text-white font-bold shadow-[0_0_12px_#C81E3A]'
                      : 'border border-[#C81E3A] bg-[#6B1420] text-[#EDE9E6] shadow-[0_0_8px_#C81E3A]'
                    : 'border border-[#2A2828] bg-[#0A0A0B] text-[#7A7570]'
                }`}
              >
                {beatNum}
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 2: BPM display + controls */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="font-mono text-lg font-bold text-[#EDE9E6]">
          {tempo} <span className="text-xs text-[#7A7570]">BPM</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setTempo(tempo - 5)}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2 py-1 font-mono text-xs text-[#EDE9E6] hover:border-[#C81E3A]"
          >
            -5
          </button>
          <button
            type="button"
            onClick={() => setTempo(tempo - 1)}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2 py-1 font-mono text-xs text-[#EDE9E6] hover:border-[#C81E3A]"
          >
            -1
          </button>

          <input
            type="range"
            min="40"
            max="240"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            className="w-24 accent-[#C81E3A] cursor-pointer sm:w-32"
          />

          <button
            type="button"
            onClick={() => setTempo(tempo + 1)}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2 py-1 font-mono text-xs text-[#EDE9E6] hover:border-[#C81E3A]"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => setTempo(tempo + 5)}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2 py-1 font-mono text-xs text-[#EDE9E6] hover:border-[#C81E3A]"
          >
            +5
          </button>
        </div>
      </div>
    </div>
  )
}
