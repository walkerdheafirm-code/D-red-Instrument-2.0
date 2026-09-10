import { createContext, useContext, useMemo, useState } from 'react'
import * as Tone from 'tone'
import { ensureAudioRunning } from '../hooks/useAudioEngine'

const MetronomeContext = createContext(null)

export function MetronomeProvider({ children }) {
  const [tempo, setTempoState] = useState(90)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(1)

  const setTempo = (value) => {
    const nextTempo = Math.min(240, Math.max(40, Number(value) || 90))
    setTempoState(nextTempo)
  }

  const togglePlay = async () => {
    if (Tone.context.state !== 'running') {
      await ensureAudioRunning()
    }
    setIsPlaying((prev) => !prev)
  }

  const value = useMemo(
    () => ({
      tempo,
      setTempo,
      isPlaying,
      setIsPlaying,
      togglePlay,
      currentBeat,
      setCurrentBeat,
    }),
    [tempo, isPlaying, currentBeat],
  )

  return <MetronomeContext.Provider value={value}>{children}</MetronomeContext.Provider>
}

export function useMetronomeContext() {
  const context = useContext(MetronomeContext)
  if (!context) {
    throw new Error('useMetronomeContext must be used inside MetronomeProvider')
  }
  return context
}
