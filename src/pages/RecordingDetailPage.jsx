import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { RecordingPlayer } from '../components/recordings/RecordingPlayer'
import { useRecordingContext } from '../context/RecordingContext'
import { formatDate } from '../utils/formatDate'
import { formatDuration } from '../utils/formatDuration'

export function RecordingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recordings, deleteRecording } = useRecordingContext()
  const recording = recordings.find((item) => item.id === id)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!recording) {
    return (
      <div className="rounded border border-[#2A2828] bg-[#151417] p-6">
        <h1 className="text-2xl font-semibold text-[#EDE9E6]">Rekaman tidak ditemukan</h1>
        <Link to="/recordings" className="mt-4 inline-block text-[#C81E3A]">
          Kembali ke daftar rekaman
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    deleteRecording(recording.id)
    setIsDeleting(false)
    navigate('/recordings')
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Detail</p>
          <h1 className="mt-2 font-['Bebas_Neue'] text-5xl text-[#C81E3A]">{recording.title}</h1>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/recordings/${recording.id}/edit`)}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-4 py-2 text-sm text-[#EDE9E6] transition hover:border-[#C81E3A] hover:text-[#C81E3A]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a6172e]"
          >
            Delete
          </button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded border border-[#2A2828] bg-[#151417] p-5">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-[#7A7570]">Player</div>
          <RecordingPlayer audioData={recording.audioData} title={recording.title} />
        </div>

        <aside className="rounded border border-[#2A2828] bg-[#151417] p-5">
          <div className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Metadata</div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A7570]">Instrument</dt>
              <dd className="text-[#EDE9E6]">{recording.instrument}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A7570]">Kategori</dt>
              <dd className="text-[#EDE9E6]">{recording.category}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A7570]">Tempo</dt>
              <dd className="text-[#EDE9E6]">{recording.tempo} BPM</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A7570]">Durasi</dt>
              <dd className="text-[#EDE9E6]">{formatDuration(recording.duration)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A7570]">Tanggal</dt>
              <dd className="text-[#EDE9E6]">{formatDate(recording.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A7570]">Favorite</dt>
              <dd className="text-[#EDE9E6]">{recording.isFavorite ? 'Ya' : 'Tidak'}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <Link to="/recordings" className="inline-block text-sm text-[#C81E3A] hover:text-[#EDE9E6]">
        ← Kembali ke daftar rekaman
      </Link>

      <ConfirmDialog
        isOpen={isDeleting}
        title="Hapus rekaman?"
        message="Tindakan ini akan menghapus rekaman dari koleksi Anda."
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
