import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../common/Badge'
import { formatDate } from '../../utils/formatDate'
import { formatDuration } from '../../utils/formatDuration'

function MiniPlayer({ audioUrl }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  if (!audioUrl) return null

  function handleToggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  function handleEnded() {
    setPlaying(false)
  }

  return (
    <>
      <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} />
      <button
        onClick={handleToggle}
        title={playing ? 'Stop preview' : 'Play preview'}
        className="flex h-8 w-8 items-center justify-center rounded border border-[#2A2828] bg-[#0A0A0B] text-[#C81E3A] transition hover:border-[#C81E3A] hover:bg-[#6B1420]/30"
      >
        {playing ? (
          // Stop icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <rect x="3" y="3" width="10" height="10" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M3 2.75A.75.75 0 0 1 4.124 2.1l9.5 5.25a.75.75 0 0 1 0 1.3l-9.5 5.25A.75.75 0 0 1 3 13.25v-10.5Z" />
          </svg>
        )}
      </button>
    </>
  )
}

export function RecentRecordingList({ recordings }) {
  const recent = [...(recordings ?? [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2828] bg-[#0A0A0B] text-[#C81E3A]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
          </svg>
        </div>
        <p className="text-sm text-[#7A7570]">Belum ada rekaman tersimpan.</p>
        <p className="mt-1 text-xs text-[#4A4844]">Mulai rekam dari halaman instrumen.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {recent.map((rec) => (
        <li
          key={rec.id}
          className="group flex items-center gap-3 rounded border border-[#2A2828] bg-[#0A0A0B] p-3 transition hover:border-[#C81E3A]/50"
        >
          {/* Instrument icon dot */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#2A2828] bg-[#151417] text-[#C81E3A] text-xs font-bold uppercase group-hover:border-[#C81E3A]/50">
            {(rec.instrument || '?').slice(0, 2)}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-[#EDE9E6]">{rec.title || 'Untitled'}</p>
              {rec.isFavorite && (
                <Badge variant="favorite" className="shrink-0">★</Badge>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-[#7A7570]">
              <span>{formatDuration(rec.duration)}</span>
              <span>·</span>
              <span>{formatDate(rec.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <MiniPlayer audioUrl={rec.audioData} />
            <Link
              to={`/recordings/${rec.id}`}
              title="Buka detail"
              className="flex h-8 w-8 items-center justify-center rounded border border-[#2A2828] bg-[#0A0A0B] text-[#7A7570] transition hover:border-[#C81E3A] hover:text-[#EDE9E6]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
