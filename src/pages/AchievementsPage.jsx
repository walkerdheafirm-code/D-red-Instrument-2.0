import { useState } from 'react'
import { AchievementCard } from '../components/achievements/AchievementCard'
import { useAchievementContext } from '../context/AchievementContext'

export function AchievementsPage() {
  const { achievements, unlockedCount, totalCount } = useAchievementContext()
  const [filter, setFilter] = useState('all') // 'all' | 'unlocked' | 'locked'

  const percentage = Math.round((unlockedCount / totalCount) * 100)

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'unlocked') return ach.isUnlocked
    if (filter === 'locked') return !ach.isUnlocked
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Prestasi & Dedikasi</p>
        <h1 className="mt-1 font-['Bebas_Neue'] text-5xl leading-none text-[#C81E3A]">
          Achievements
        </h1>
      </header>

      {/* Progress Banner */}
      <section className="rounded border border-[#2A2828] bg-[#151417] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#EDE9E6]">Kemajuan Koleksi Lencana</h2>
            <p className="mt-0.5 text-xs text-[#7A7570]">
              Terus bereksplorasi dengan instrumen dan raih semua penghargaan musik!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-3xl font-bold text-[#C81E3A]">
              {unlockedCount} / {totalCount}
            </span>
            <span className="rounded border border-[#C81E3A]/30 bg-[#6B1420]/20 px-2.5 py-1 font-mono text-xs font-semibold text-[#EDE9E6]">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#0A0A0B]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6B1420] to-[#C81E3A] transition-all duration-500 shadow-[0_0_10px_#C81E3A]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        {[
          { id: 'all', label: `Semua (${totalCount})` },
          { id: 'unlocked', label: `Terbuka (${unlockedCount})` },
          { id: 'locked', label: `Terkunci (${totalCount - unlockedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={[
              'rounded border px-4 py-2 font-medium transition',
              filter === tab.id
                ? 'border-[#C81E3A] bg-[#6B1420]/40 text-[#EDE9E6]'
                : 'border-[#2A2828] bg-[#151417] text-[#7A7570] hover:text-[#EDE9E6]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}
