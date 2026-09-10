import { useEffect, useRef, useState } from 'react'
import { PatternCard } from '../components/beat-patterns/PatternCard'
import { PatternModal } from '../components/beat-patterns/PatternModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Metronome } from '../components/instruments/Metronome'
import { OrientationPrompt } from '../components/layout/OrientationPrompt'
import { useBeatPatternContext } from '../context/BeatPatternContext'
import { useMetronomeContext } from '../context/MetronomeContext'
import { LAUNCHPAD_PADS, useAudioEngine } from '../hooks/useAudioEngine'

export function BeatPatternPage() {
  const { patterns, addPattern, updatePattern, deletePattern } = useBeatPatternContext()
  const { tempo } = useMetronomeContext()
  const { playDrumPad, playLaunchpadPad } = useAudioEngine()

  // Filter & Search state
  const [search, setSearch] = useState('')
  const [instrumentFilter, setInstrumentFilter] = useState('all')

  // Sequencer Playback state
  const [playingPatternId, setPlayingPatternId] = useState(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const timerRef = useRef(null)

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPattern, setEditingPattern] = useState(null)
  const [deletingPattern, setDeletingPattern] = useState(null)

  // Stop playback when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Sequencer playback loop
  const startPlayback = (pattern) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPlayingPatternId(pattern.id)

    // Calculate step interval based on tempo (8th note per step: (60 / tempo) * 1000 / 2)
    const stepIntervalMs = Math.max(100, Math.round(((60 / tempo) * 1000) / 2))
    let step = 0

    const triggerStep = (stepIdx) => {
      setCurrentStep(stepIdx)
      pattern.steps.forEach((row) => {
        if (row.active[stepIdx]) {
          if (pattern.instrument === 'drumkit') {
            playDrumPad(row.track)
          } else if (pattern.instrument === 'launchpad') {
            const pad = LAUNCHPAD_PADS.find((p) => String(p.id) === String(row.track))
            if (pad) playLaunchpadPad(pad)
          }
        }
      })
    }

    // Trigger initial step immediately
    triggerStep(0)

    timerRef.current = setInterval(() => {
      step = (step + 1) % 8
      triggerStep(step)
    }, stepIntervalMs)
  }

  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPlayingPatternId(null)
    setCurrentStep(-1)
  }

  const handleTogglePlay = (pattern) => {
    if (playingPatternId === pattern.id) {
      stopPlayback()
    } else {
      startPlayback(pattern)
    }
  }

  // Handle tempo change while playing
  useEffect(() => {
    if (playingPatternId) {
      const active = patterns.find((p) => p.id === playingPatternId)
      if (active) {
        startPlayback(active)
      }
    }
  }, [tempo]) // eslint-disable-line react-hooks/exhaustive-deps

  // CRUD handlers
  const handleOpenCreate = () => {
    setEditingPattern(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (pattern) => {
    setEditingPattern(pattern)
    setIsModalOpen(true)
  }

  const handleSavePattern = ({ name, instrument, steps }) => {
    if (editingPattern) {
      updatePattern(editingPattern.id, { name, instrument, steps })
    } else {
      addPattern({ name, instrument, steps })
    }
    setIsModalOpen(false)
    setEditingPattern(null)
  }

  const handleDeleteConfirm = () => {
    if (deletingPattern) {
      if (playingPatternId === deletingPattern.id) {
        stopPlayback()
      }
      deletePattern(deletingPattern.id)
      setDeletingPattern(null)
    }
  }

  // Filtered patterns
  const filteredPatterns = patterns.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchInst =
      instrumentFilter === 'all' ? true : p.instrument === instrumentFilter
    return matchSearch && matchInst
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Sequencer & Presets</p>
          <h1 className="mt-1 font-['Bebas_Neue'] text-5xl leading-none text-[#C81E3A]">
            Beat Pattern Library
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_12px_rgba(200,30,58,0.4)] transition hover:bg-[#a6172e]"
        >
          <span>＋</span>
          <span>Buat Pola Baru</span>
        </button>
      </header>

      {/* Orientation hint on mobile portrait */}
      <OrientationPrompt message="Putar layar ke landscape untuk menyusun dan memainkan pola beat dengan lebih leluasa." />

      {/* Tempo & Metronome Control */}
      <section aria-label="Kontrol Tempo">
        <Metronome />
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded border border-[#2A2828] bg-[#151417] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pola beat..."
          className="w-full sm:w-72 rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-sm text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
        />

        {/* Instrument Filter Tabs */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'drumkit', label: 'Drum Kit' },
            { id: 'launchpad', label: 'Launchpad' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setInstrumentFilter(tab.id)}
              className={[
                'rounded px-3 py-1.5 font-medium transition',
                instrumentFilter === tab.id
                  ? 'border border-[#C81E3A] bg-[#6B1420]/40 text-[#EDE9E6]'
                  : 'border border-[#2A2828] bg-[#0A0A0B] text-[#7A7570] hover:text-[#EDE9E6]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Cards Grid */}
      {filteredPatterns.length === 0 ? (
        <div className="rounded border border-[#2A2828] bg-[#151417] p-12 text-center text-[#7A7570]">
          <p className="text-3xl">🎛️</p>
          <p className="mt-2 text-sm">Tidak ada pola beat yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPatterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              isPlaying={playingPatternId === pattern.id}
              currentStep={playingPatternId === pattern.id ? currentStep : -1}
              onTogglePlay={handleTogglePlay}
              onEdit={handleOpenEdit}
              onDelete={(pat) => setDeletingPattern(pat)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <PatternModal
        isOpen={isModalOpen}
        pattern={editingPattern}
        playDrumPad={playDrumPad}
        playLaunchpadPad={playLaunchpadPad}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPattern(null)
        }}
        onSave={handleSavePattern}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingPattern)}
        title="Hapus Pola Beat?"
        message={`Apakah Anda yakin ingin menghapus pola "${deletingPattern?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onCancel={() => setDeletingPattern(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
