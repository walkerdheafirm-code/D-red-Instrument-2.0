import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../components/common/Toast'
import { ACHIEVEMENTS } from '../data/achievementList'
import { playAchievementSound } from '../utils/achievementSound'
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
  const [toastQueue, setToastQueue] = useState([])
  const [currentToast, setCurrentToast] = useState(null)

  // Evaluates achievements by comparing current state against unlock criteria
  const checkAndUnlockAchievements = useCallback(() => {
    let hasChanges = false
    const nextMap = { ...unlockedMap }
    const now = new Date().toISOString()
    const newlyUnlocked = []

    ACHIEVEMENTS.forEach((ach) => {
      const isMet = ach.checkUnlocked({ recordings, scores, patterns })
      if (isMet && !nextMap[ach.id]) {
        nextMap[ach.id] = now
        hasChanges = true
        newlyUnlocked.push(ach)
      }
    })

    if (hasChanges) {
      setUnlockedMap(nextMap)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap))
      } catch {
        // ignore
      }

      // Check if all achievements are now unlocked
      const totalUnlocked = Object.keys(nextMap).length
      const allCompleted = totalUnlocked === ACHIEVEMENTS.length
      const lastAchId = ACHIEVEMENTS[ACHIEVEMENTS.length - 1].id

      const newToasts = []
      newlyUnlocked.forEach((ach, index) => {
        const isFinalTrigger = allCompleted && (ach.id === lastAchId || index === newlyUnlocked.length - 1)
        if (isFinalTrigger) {
          newToasts.push({
            title: 'Selamat!',
            message: 'Selamat! Kamu telah membuka semua achievement!',
            icon: '🏆',
            isSpecial: true,
            duration: 7000,
          })
        } else {
          newToasts.push({
            title: 'Achievement Terbuka!',
            message: `Achievement terbuka: ${ach.title}!`,
            icon: ach.icon || '★',
            isSpecial: false,
            duration: 4500,
          })
        }
      })

      if (newToasts.length > 0) {
        setToastQueue((prev) => [...prev, ...newToasts])
      }
    }
  }, [recordings, scores, patterns, unlockedMap])

  // Automatically check unlock criteria whenever recordings, scores, or patterns change
  useEffect(() => {
    checkAndUnlockAchievements()
  }, [checkAndUnlockAchievements])

  // Toast Queue processor
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      const nextToast = toastQueue[0]
      setToastQueue((prev) => prev.slice(1))
      setCurrentToast(nextToast)
      playAchievementSound(nextToast.isSpecial)
    }
  }, [currentToast, toastQueue])

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
      checkAndUnlockAchievements,
    }),
    [achievements, unlockedCount, checkAndUnlockAchievements]
  )

  const navigate = useNavigate()

  const handleToastClick = () => {
    setCurrentToast(null)
    navigate('/achievements')
  }

  return (
    <AchievementContext.Provider value={value}>
      {children}
      <Toast
        isOpen={Boolean(currentToast)}
        message={currentToast?.message}
        title={currentToast?.title}
        icon={currentToast?.icon}
        isSpecial={currentToast?.isSpecial}
        onClick={handleToastClick}
        onClose={() => setCurrentToast(null)}
      />
    </AchievementContext.Provider>
  )
}

export function useAchievementContext() {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievementContext must be used inside AchievementProvider')
  }
  return context
}
