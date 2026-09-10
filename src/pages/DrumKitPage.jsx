import { DrumKit } from '../components/instruments/DrumKit'
import { InstrumentRecorder } from '../components/instruments/InstrumentRecorder'
import { Metronome } from '../components/instruments/Metronome'
import { OrientationPrompt } from '../components/layout/OrientationPrompt'
import { useAudioEngine } from '../hooks/useAudioEngine'

export function DrumKitPage() {
  const { playDrumPad } = useAudioEngine()

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Virtual Instrument</p>
          <h1 className="font-['Bebas_Neue'] text-5xl text-[#C81E3A]">Drum Kit</h1>
        </div>
      </header>

      {/* Orientation hint on mobile portrait */}
      <OrientationPrompt />

      {/* Metronome Bar */}
      <Metronome />

      {/* Drum Pad Grid */}
      <section className="rounded border border-[#2A2828] bg-[#151417] p-5">
        <DrumKit onPlayPad={playDrumPad} />
      </section>

      {/* Audio Recorder Bar & Save Modal */}
      <InstrumentRecorder instrument="drumkit" />
    </div>
  )
}
