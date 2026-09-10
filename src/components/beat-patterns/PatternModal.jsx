import { useCallback, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { useMetronomeContext } from '../../context/MetronomeContext'
import { LAUNCHPAD_PADS } from '../../hooks/useAudioEngine'
import { OrientationPrompt } from '../layout/OrientationPrompt'
import { PatternGrid } from './PatternGrid'

const DEFAULT_DRUM_TRACKS = ['kick', 'snare', 'hihat', 'tom', 'cymbal', 'clap']
const DEFAULT_LAUNCHPAD_TRACKS = ['1', '2', '3', '4']

function createEmptySteps(instrument) {
  const trackList = instrument === 'drumkit' ? DEFAULT_DRUM_TRACKS : DEFAULT_LAUNCHPAD_TRACKS
  return trackList.map((track) => ({
    track,
    active: [false, false, false, false, false, false, false, false],
  }))
}

export function PatternModal({
  pattern = null,
  isOpen,
  onClose,
  onSave,
  playDrumPad,
  playLaunchpadPad,
}) {
  const { tempo } = useMetronomeContext()

  const [name, setName] = useState('')
  const [instrument, setInstrument] = useState('drumkit')
  const [steps, setSteps] = useState(() => createEmptySteps('drumkit'))

  // Live preview playback states
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const timerRef = useRef(null)
  const stepsRef = useRef(steps)
  const instrumentRef = useRef(instrument)

  // Keep refs up-to-date so interval reads latest data without recreating timers
  stepsRef.current = steps
  instrumentRef.current = instrument

  const stopPreview = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const startPreview = useCallback(async () => {
    stopPreview()
    await Tone.start()
    setIsPlaying(true)

    // 8th note interval (ms)
    const stepIntervalMs = Math.max(100, Math.round(((60 / tempo) * 1000) / 2))
    let step = 0

    const triggerStep = (stepIdx) => {
      setCurrentStep(stepIdx)
      const currentSteps = stepsRef.current
      const currentInst = instrumentRef.current
      const now = Tone.now()

      currentSteps.forEach((row) => {
        if (row.active[stepIdx]) {
          if (currentInst === 'drumkit') {
            playDrumPad?.(row.track, now)
          } else if (currentInst === 'launchpad') {
            const pad = LAUNCHPAD_PADS.find((p) => String(p.id) === String(row.track))
            if (pad) playLaunchpadPad?.(pad, now)
          }
        }
      })
    }

    triggerStep(0)

    timerRef.current = setInterval(() => {
      step = (step + 1) % 8
      triggerStep(step)
    }, stepIntervalMs)
  }, [stopPreview, tempo, playDrumPad, playLaunchpadPad])

  const togglePreview = () => {
    if (isPlaying) {
      stopPreview()
    } else {
      startPreview()
    }
  }

  // Stop playback when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    stopPreview()
    if (pattern) {
      setName(pattern.name)
      setInstrument(pattern.instrument)
      setSteps(JSON.parse(JSON.stringify(pattern.steps)))
    } else {
      setName('')
      setInstrument('drumkit')
      setSteps(createEmptySteps('drumkit'))
    }
  }, [pattern, isOpen, stopPreview])

  // Restart loop interval if tempo changes while previewing
  useEffect(() => {
    if (isPlaying) {
      startPreview()
    }
  }, [tempo]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const handleInstrumentChange = (newInst) => {
    stopPreview()
    setInstrument(newInst)
    setSteps(createEmptySteps(newInst))
  }

  const handleToggleStep = (trackName, stepIndex) => {
    const nextSteps = steps.map((row) => {
      if (row.track !== trackName) return row
      const nextActive = [...row.active]
      const wasActive = nextActive[stepIndex]
      nextActive[stepIndex] = !wasActive

      // Immediate acoustic feedback when enabling a step
      if (!wasActive) {
        if (instrument === 'drumkit') {
          playDrumPad?.(trackName)
        } else if (instrument === 'launchpad') {
          const pad = LAUNCHPAD_PADS.find((p) => String(p.id) === String(trackName))
          if (pad) playLaunchpadPad?.(pad)
        }
      }

      return { ...row, active: nextActive }
    })
    setSteps(nextSteps)
  }

  const handleClearAll = () => {
    setSteps(createEmptySteps(instrument))
  }

  const handleClose = () => {
    stopPreview()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    stopPreview()
    onSave({
      name: name.trim() || `Pola Beat ${instrument === 'drumkit' ? 'Drum' : 'Launchpad'}`,
      instrument,
      steps,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[96vh] sm:max-h-[90vh] w-full max-w-2xl flex-col rounded border border-[#2A2828] bg-[#151417] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2828] px-4 py-2.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wide text-[#C81E3A]">
              {pattern ? 'Edit Pola Beat' : 'Buat Pola Beat Baru'}
            </h2>
            <span className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2 py-0.5 font-mono text-xs text-[#7A7570]">
              {tempo} BPM
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-2 py-1 text-xs text-[#7A7570] transition hover:border-[#C81E3A] hover:text-[#EDE9E6]"
          >
            ✕
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5 sm:space-y-4">
          {/* Orientation Prompt inside Modal for mobile portrait */}
          <OrientationPrompt
            message="Tip: Putar layar ke landscape agar seluruh 8 step sequencer terlihat penuh."
            className="py-2 px-3 text-xs"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Pattern Name */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#7A7570]">
                Nama Pola
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Heavy Trap Groove"
                className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1.5 sm:py-2 text-sm text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
              />
            </div>

            {/* Instrument Choice */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#7A7570]">
                Instrumen
              </label>
              <select
                value={instrument}
                disabled={Boolean(pattern)}
                onChange={(e) => handleInstrumentChange(e.target.value)}
                className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1.5 sm:py-2 text-sm text-[#EDE9E6] outline-none transition focus:border-[#C81E3A] disabled:opacity-50"
              >
                <option value="drumkit">🥁 Drum Kit (6 Track)</option>
                <option value="launchpad">🔲 Launchpad (4 Track)</option>
              </select>
            </div>
          </div>

          {/* Grid Sequencer Area */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7570]">
                Grid 8-Step (Klik kotak untuk aktif/nonaktif)
              </span>

              <div className="flex items-center gap-3">
                {/* Live Preview Button */}
                <button
                  type="button"
                  onClick={togglePreview}
                  className={[
                    'flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-xs font-bold transition shadow-sm',
                    isPlaying
                      ? 'border border-[#C81E3A] bg-[#C81E3A] text-white shadow-[0_0_12px_#C81E3A]'
                      : 'border border-[#C81E3A] bg-[#6B1420]/40 text-[#EDE9E6] hover:bg-[#C81E3A] hover:text-white',
                  ].join(' ')}
                >
                  <span>{isPlaying ? '■' : '▶'}</span>
                  <span>{isPlaying ? 'Hentikan Preview' : 'Play & Dengarkan'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-[#7A7570] underline transition hover:text-[#C81E3A]"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded border border-[#2A2828] bg-[#0A0A0B] p-2.5 sm:p-4">
              <PatternGrid
                steps={steps}
                onToggleStep={handleToggleStep}
                currentStep={currentStep}
                readOnly={false}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7A7570] sm:hidden px-1">
              <span>💡 Geser ke samping untuk melihat step 1–8</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2A2828] pt-3">
            <p className="text-xs text-[#7A7570]">
              {isPlaying ? (
                <span className="text-[#C81E3A] animate-pulse font-medium">
                  ● Sedang memutar loop preview...
                </span>
              ) : (
                'Tekan "Play & Dengarkan" untuk mencoba ketukan secara langsung.'
              )}
            </p>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={handleClose}
                className="rounded border border-[#2A2828] bg-[#0A0A0B] px-4 py-2 text-xs font-medium text-[#EDE9E6] transition hover:border-[#7A7570]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded border border-[#C81E3A] bg-[#C81E3A] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#a6172e] shadow-[0_0_12px_rgba(200,30,58,0.4)]"
              >
                Simpan Pola Beat
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
