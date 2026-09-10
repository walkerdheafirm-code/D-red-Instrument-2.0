import { createContext, useContext, useMemo, useState } from 'react'

const PracticeContext = createContext(null)
const STORAGE_KEY = 'dred-practice-scores'

function loadScores() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function PracticeProvider({ children }) {
  const [scores, setScores] = useState(loadScores)

  const addPracticeScore = (scoreData) => {
    const newScore = {
      id: `score-${Date.now()}`,
      challengeId: scoreData.challengeId,
      instrument: scoreData.instrument,
      score: scoreData.score,
      correctRounds: scoreData.correctRounds,
      totalRounds: scoreData.totalRounds,
      playedAt: new Date().toISOString(),
    }

    setScores((prev) => {
      const updated = [newScore, ...prev]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch { /* ignore */ }
      return updated
    })
  }

  const value = useMemo(() => ({ scores, addPracticeScore }), [scores])

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>
}

export function usePracticeContext() {
  const context = useContext(PracticeContext)
  if (!context) throw new Error('usePracticeContext must be used inside PracticeProvider')
  return context
}
