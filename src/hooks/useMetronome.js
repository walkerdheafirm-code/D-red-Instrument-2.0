import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { useMetronomeContext } from '../context/MetronomeContext'

export function useMetronome() {
  const { tempo, isPlaying, setCurrentBeat } = useMetronomeContext()
  const synthRef = useRef(null)
  const loopRef = useRef(null)
  const beatCounterRef = useRef(1)

  useEffect(() => {
    const clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination()
    clickSynth.volume.value = -6

    synthRef.current = clickSynth

    return () => {
      clickSynth.dispose()
    }
  }, [])

  useEffect(() => {
    Tone.getTransport().bpm.value = tempo
  }, [tempo])

  useEffect(() => {
    if (!synthRef.current) return

    if (isPlaying) {
      // Tone.start() is already called inside togglePlay (user gesture handler)
      // so AudioContext should be "running" by the time we reach here.
      beatCounterRef.current = 1
      setCurrentBeat(1)

      loopRef.current = new Tone.Loop((time) => {
        const beat = beatCounterRef.current
        if (beat === 1) {
          synthRef.current.triggerAttackRelease('C5', '16n', time)
        } else {
          synthRef.current.triggerAttackRelease('G4', '16n', time, 0.6)
        }

        Tone.getDraw().schedule(() => {
          setCurrentBeat(beat)
        }, time)

        beatCounterRef.current = beat >= 4 ? 1 : beat + 1
      }, '4n')

      loopRef.current.start(0)
      Tone.getTransport().start()
    } else {
      if (loopRef.current) {
        loopRef.current.stop()
        loopRef.current.dispose()
        loopRef.current = null
      }
      Tone.getTransport().stop()
      setCurrentBeat(1)
    }

    return () => {
      if (loopRef.current) {
        loopRef.current.stop()
        loopRef.current.dispose()
        loopRef.current = null
      }
    }
  }, [isPlaying, setCurrentBeat])

  return { tempo, isPlaying }
}
