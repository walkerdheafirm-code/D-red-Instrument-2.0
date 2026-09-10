import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultRecordings } from '../data/defaultRecordings'

const RecordingContext = createContext(null)
const STORAGE_KEY = 'dred-recordings'

function loadRecordings() {
  if (typeof window === 'undefined') {
    return defaultRecordings
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultRecordings
  } catch (error) {
    console.error('Failed to load recordings from localStorage', error)
    return defaultRecordings
  }
}

export function RecordingProvider({ children }) {
  const [recordings, setRecordings] = useState(loadRecordings)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings))
    }
  }, [recordings])

  const addRecording = (recording) => {
    const newRecording = {
      ...recording,
      id: recording.id || `rec-${Date.now()}`,
      createdAt: recording.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRecordings((current) => [newRecording, ...current])
  }

  const updateRecording = (id, updates) => {
    setRecordings((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }

  const deleteRecording = (id) => {
    setRecordings((current) => current.filter((item) => item.id !== id))
  }

  const value = useMemo(
    () => ({
      recordings,
      addRecording,
      updateRecording,
      deleteRecording,
    }),
    [recordings],
  )

  return <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>
}

export function useRecordingContext() {
  const context = useContext(RecordingContext)

  if (!context) {
    throw new Error('useRecordingContext must be used inside RecordingProvider')
  }

  return context
}
