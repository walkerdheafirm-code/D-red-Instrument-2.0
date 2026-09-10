import { createContext, useContext, useMemo, useState } from 'react'
import { DEFAULT_BEAT_PATTERNS } from '../data/defaultBeatPatterns'

const BeatPatternContext = createContext(null)
const STORAGE_KEY = 'dred-beat-patterns'

function loadPatterns() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BEAT_PATTERNS))
      return DEFAULT_BEAT_PATTERNS
    }
    const parsed = JSON.parse(stored)
    // Ensure all default presets are present
    const existingIds = new Set(parsed.map((p) => p.id))
    const missingDefaults = DEFAULT_BEAT_PATTERNS.filter((dp) => !existingIds.has(dp.id))
    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    }
    return parsed
  } catch {
    return DEFAULT_BEAT_PATTERNS
  }
}

export function BeatPatternProvider({ children }) {
  const [patterns, setPatterns] = useState(loadPatterns)

  const persist = (nextPatterns) => {
    setPatterns(nextPatterns)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPatterns))
    } catch {
      // ignore storage errors
    }
  }

  const addPattern = (patternData) => {
    const newPattern = {
      id: `pattern-${Date.now()}`,
      name: patternData.name.trim() || 'Pola Beat Baru',
      instrument: patternData.instrument || 'drumkit',
      steps: patternData.steps,
      isDefault: false,
      createdAt: new Date().toISOString(),
    }
    persist([newPattern, ...patterns])
    return newPattern
  }

  const updatePattern = (id, updatedData) => {
    const next = patterns.map((p) => {
      if (p.id !== id) return p
      // Do not allow changing isDefault
      return {
        ...p,
        name: updatedData.name ? updatedData.name.trim() : p.name,
        instrument: updatedData.instrument || p.instrument,
        steps: updatedData.steps || p.steps,
        updatedAt: new Date().toISOString(),
      }
    })
    persist(next)
  }

  const deletePattern = (id) => {
    const target = patterns.find((p) => p.id === id)
    if (target?.isDefault) {
      // Prevent deleting default presets
      return false
    }
    const next = patterns.filter((p) => p.id !== id)
    persist(next)
    return true
  }

  const resetToDefaults = () => {
    persist(DEFAULT_BEAT_PATTERNS)
  }

  const value = useMemo(
    () => ({
      patterns,
      addPattern,
      updatePattern,
      deletePattern,
      resetToDefaults,
    }),
    [patterns]
  )

  return <BeatPatternContext.Provider value={value}>{children}</BeatPatternContext.Provider>
}

export function useBeatPatternContext() {
  const context = useContext(BeatPatternContext)
  if (!context) {
    throw new Error('useBeatPatternContext must be used inside BeatPatternProvider')
  }
  return context
}
