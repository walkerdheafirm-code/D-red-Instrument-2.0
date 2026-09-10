import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const streamDestRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      // Disconnect stream destination when component unmounts
      if (streamDestRef.current) {
        try {
          Tone.getDestination().disconnect(streamDestRef.current)
        } catch {
          // ignore
        }
        streamDestRef.current = null
      }
    }
  }, [])

  const startRecording = async () => {
    // Ensure Tone.js AudioContext is running
    await Tone.start()

    audioChunksRef.current = []
    setRecordedAudioUrl(null)
    setDuration(0)

    try {
      // Create a MediaStreamDestination from Tone's AudioContext
      const audioContext = Tone.getContext().rawContext
      const streamDest = audioContext.createMediaStreamDestination()
      streamDestRef.current = streamDest

      // Connect Tone's master output to the stream destination
      Tone.getDestination().connect(streamDest)

      const mediaRecorder = new MediaRecorder(streamDest.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Disconnect after stopping
        try {
          Tone.getDestination().disconnect(streamDest)
        } catch {
          // ignore
        }
        streamDestRef.current = null

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result) // base64 data URL
        }
      }

      // Collect chunks every 100ms for reliability
      mediaRecorder.start(100)
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= 59) {
            stopRecording()
            return 60
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Failed to start MediaRecorder:', error)
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const resetRecording = () => {
    setRecordedAudioUrl(null)
    setDuration(0)
    setIsRecording(false)
  }

  return {
    isRecording,
    duration,
    recordedAudioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  }
}
