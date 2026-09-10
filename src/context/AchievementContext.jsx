import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ACHIEVEMENTS } from '../data/achievementList'
import { useBeatPatternContext } from './BeatPatternContext'
import { usePracticeContext } from './PracticeContext'
import { useRecordingContext } from './RecordingContext'

const AchievementContext = createContext(null)
const STORAGE_KEY = 'dred-achievements-unlocked'

function loadUnlockedTimestamps() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function AchievementProvider({ children }) {
  const { recordings } = useRecordingContext()
  const { scores } = usePracticeContext()
  const { patterns } = useBeatPatternContext()

  const [unlockedMap, setUnlockedMap] = useState(loadUnlockedTimestamps)

  // Automatically check unlock criteria whenever recordings, scores, or patterns change
  useEffect(() => {
    let hasChanges = false
    const nextMap = { ...unlockedMap }
    const now = new Date().toISOString()

    ACHIEVEMENTS.forEach((ach) => {
      const isMet = ach.checkUnlocked({ recordings, scores, patterns })
      if (isMet && !nextMap[ach.id]) {
        nextMap[ach.id] = now
        hasChanges = true
      }
    })

    if (hasChanges) {
      setUnlockedMap(nextMap)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap))
      } catch {
        // ignore
      }
    }
  }, [recordings, scores, patterns, unlockedMap])

  const achievements = useMemo(() => {
    return ACHIEVEMENTS.map((ach) => {
      const unlockedAt = unlockedMap[ach.id] || null
      return {
        ...ach,
        isUnlocked: Boolean(unlockedAt),
        unlockedAt,
      }
    })
  }, [unlockedMap])

  const unlockedCount = useMemo(
    () => achievements.filter((a) => a.isUnlocked).length,
    [achievements]
  )

  const value = useMemo(
    () => ({
      achievements,
      unlockedCount,
      totalCount: ACHIEVEMENTS.length,
    }),
    [achievements, unlockedCount]
  )

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>
}

export function useAchievementContext() {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievementContext must be used inside AchievementProvider')
  }
  return context
}
