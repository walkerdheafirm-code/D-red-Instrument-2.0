import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetronomeContext } from '../../context/MetronomeContext'
import { useRecordingContext } from '../../context/RecordingContext'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { formatDuration } from '../../utils/formatDuration'

export function InstrumentRecorder({ instrument = 'piano' }) {
  const navigate = useNavigate()
  const { tempo } = useMetronomeContext()
  const { addRecording } = useRecordingContext()

  const {
    isRecording,
    duration,
    recordedAudioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder()

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'latihan',
    isFavorite: false,
  })

  const handleStop = () => {
    stopRecording()
    setShowModal(true)
  }

  const handleSave = (e) => {
    e.preventDefault()

    const newRecording = {
      id: `rec-${Date.now()}`,
      title: formData.title.trim() || `Rekaman ${instrument} ${new Date().toLocaleTimeString()}`,
      instrument,
      category: formData.category,
      tempo,
      duration: Math.max(1, duration),
      isFavorite: formData.isFavorite,
      audioData: recordedAudioUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addRecording(newRecording)
    setShowModal(false)
    resetRecording()
    navigate('/recordings')
  }

  return (
    <>
      {/* Recorder Bar */}
      <div className="flex flex-col gap-3 rounded border border-[#2A2828] bg-[#151417] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 rounded border border-[#C81E3A] bg-[#6B1420]/40 px-4 py-2 font-medium text-sm text-[#EDE9E6] transition hover:bg-[#C81E3A] hover:text-white"
            >
              <span className="h-3 w-3 rounded-full bg-[#C81E3A]"></span>
              <span>Mulai Rekam</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-2 rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 font-medium text-sm text-white shadow-[0_0_12px_#C81E3A]"
            >
              <span className="h-3 w-3 rounded-full bg-white animate-pulse"></span>
              <span>Stop Perekaman ({formatDuration(duration)})</span>
            </button>
          )}

          {isRecording && (
            <span className="text-xs text-[#C81E3A] animate-pulse">
              ● Sedang Merekam (Maks 60s)...
            </span>
          )}
        </div>

        <div className="font-mono text-xs text-[#7A7570]">
          Durasi: <strong className="text-[#EDE9E6]">{formatDuration(duration)}</strong> / 01:00
        </div>
      </div>

      {/* Save Recording Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded border border-[#2A2828] bg-[#151417] p-6 shadow-2xl">
            <h3 className="font-['Bebas_Neue'] text-3xl text-[#C81E3A]">Simpan Hasil Rekaman</h3>
            <p className="mt-1 text-xs text-[#7A7570]">
              Rekaman audio Anda siap disimpan ke koleksi rekaman local.
            </p>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <label className="block text-sm text-[#EDE9E6]">
                <span className="mb-1 block text-[#7A7570]">Judul Rekaman</span>
                <input
                  type="text"
                  required
                  placeholder="Misal: Latihan Solos Malam"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none focus:border-[#C81E3A]"
                />
              </label>

              <label className="block text-sm text-[#EDE9E6]">
                <span className="mb-1 block text-[#7A7570]">Kategori</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none focus:border-[#C81E3A]"
                >
                  <option value="latihan">latihan</option>
                  <option value="cover">cover</option>
                  <option value="eksperimen">eksperimen</option>
                  <option value="lainnya">lainnya</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs text-[#7A7570]">
                <div>
                  Instrumen: <span className="text-[#EDE9E6] font-medium uppercase">{instrument}</span>
                </div>
                <div>
                  Tempo: <span className="text-[#EDE9E6] font-medium">{tempo} BPM</span>
                </div>
                <div>
                  Durasi: <span className="text-[#EDE9E6] font-medium">{formatDuration(duration)}</span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#EDE9E6]">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  className="accent-[#C81E3A]"
                />
                Tandai sebagai favorit
              </label>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetRecording()
                  }}
                  className="rounded border border-[#2A2828] bg-[#0A0A0B] px-4 py-2 text-sm text-[#EDE9E6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 text-sm font-medium text-white shadow-[0_0_10px_#C81E3A]"
                >
                  Simpan Rekaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
