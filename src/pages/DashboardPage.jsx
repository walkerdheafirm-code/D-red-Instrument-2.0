import { Link } from 'react-router-dom'
import { useAchievementContext } from '../context/AchievementContext'
import { useRecordingContext } from '../context/RecordingContext'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentRecordingList } from '../components/dashboard/RecentRecordingList'
import { formatDuration } from '../utils/formatDuration'

const instrumentCards = [
  {
    name: 'Piano',
    path: '/piano',
    emoji: '🎹',
    desc: '3 Oktav · QWERTY',
  },
  {
    name: 'Launchpad',
    path: '/launchpad',
    emoji: '🔲',
    desc: '4×4 Performance Grid',
  },
  {
    name: 'Drum Kit',
    path: '/drumkit',
    emoji: '🥁',
    desc: 'Perkusi Digital',
  },
  {
    name: 'Practice',
    path: '/practice',
    emoji: '📚',
    desc: 'Mode Latihan',
  },
  {
    name: 'Beat Pattern',
    path: '/beat-patterns',
    emoji: '🎛️',
    desc: 'Sequencer Pola',
  },
]

export function DashboardPage() {
  const { recordings } = useRecordingContext()
  const { unlockedCount, totalCount } = useAchievementContext()

  const totalDuration = recordings.reduce(
    (total, rec) => total + Number(rec.duration || 0),
    0,
  )

  const instrumentCount = recordings.reduce((acc, rec) => {
    if (rec.instrument) acc[rec.instrument] = (acc[rec.instrument] || 0) + 1
    return acc
  }, {})

  const mostUsedInstrument =
    Object.entries(instrumentCount).sort((a, b) => b[1] - a[1])[0]

  const favoriteCount = recordings.filter((r) => r.isFavorite).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Overview</p>
        <h1 className="mt-2 font-['Bebas_Neue'] text-5xl leading-none text-[#C81E3A]">
          Dashboard
        </h1>
      </header>

      {/* Stat Cards */}
      <section aria-label="Statistik Rekaman" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Rekaman"
          value={recordings.length}
          subtext={recordings.length === 0 ? 'Belum ada rekaman' : 'rekaman tersimpan'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Zm8.5 3a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0ZM8 7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM4.5 11.5a3.5 3.5 0 0 1 7 0H4.5Z" />
            </svg>
          }
        />
        <StatCard
          title="Instrumen Favorit"
          value={mostUsedInstrument ? mostUsedInstrument[0].toUpperCase() : '—'}
          subtext={
            mostUsedInstrument
              ? `${mostUsedInstrument[1]}× digunakan`
              : 'Belum ada data'
          }
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M7.05 3.293a1 1 0 0 1 1.9 0l1.09 3.357H13.4a1 1 0 0 1 .588 1.81l-2.75 2a1 1 0 0 0-.364 1.118l1.052 3.235a1 1 0 0 1-1.538 1.118L8 14.347l-2.388 1.584a1 1 0 0 1-1.538-1.118l1.052-3.235a1 1 0 0 0-.364-1.118l-2.75-2A1 1 0 0 1 2.6 6.65h3.36L7.05 3.293Z" />
            </svg>
          }
        />
        <StatCard
          title="Total Durasi"
          value={formatDuration(totalDuration)}
          subtext="total waktu bermain"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          title="Rekaman Favorit"
          value={favoriteCount}
          subtext={favoriteCount === 0 ? 'Tandai sebagai favorit' : 'ditandai favorit'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M2 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v13.17a.5.5 0 0 1-.845.362L8 11.303l-5.155 4.23A.5.5 0 0 1 2 15.17V2Z" />
            </svg>
          }
        />
        <StatCard
          title="Lencana Terbuka"
          value={`${unlockedCount} / ${totalCount}`}
          subtext="prestasi tercapai"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L8 12.147l-3.136 1.847a.75.75 0 0 1-1.12-.814l.853-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
            </svg>
          }
        />
      </section>

      {/* Shortcut Instrumen */}
      <section
        aria-label="Shortcut Instrumen"
        className="rounded border border-[#2A2828] bg-[#151417] p-5"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#7A7570]">
          Shortcut Instrumen & Fitur
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
          {instrumentCards.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group flex flex-col items-center gap-2 rounded border border-[#2A2828] bg-[#0A0A0B] p-4 text-center transition hover:border-[#C81E3A] hover:shadow-[0_0_12px_rgba(200,30,58,0.2)]"
            >
              <span className="text-2xl leading-none">{item.emoji}</span>
              <span className="text-sm font-medium text-[#EDE9E6] group-hover:text-white">
                {item.name}
              </span>
              <span className="text-xs text-[#4A4844] group-hover:text-[#7A7570]">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Recordings */}
      <section
        aria-label="Rekaman Terbaru"
        className="rounded border border-[#2A2828] bg-[#151417] p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#7A7570]">
            Rekaman Terbaru
          </h2>
          <Link
            to="/recordings"
            className="text-xs text-[#C81E3A] transition hover:text-[#EDE9E6]"
          >
            Lihat semua →
          </Link>
        </div>
        <RecentRecordingList recordings={recordings} />
      </section>
    </div>
  )
}
