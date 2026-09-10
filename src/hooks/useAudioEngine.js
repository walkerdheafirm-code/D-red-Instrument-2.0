import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

export const LAUNCHPAD_PADS = [
  { id: 1, name: 'Kick Deep', key: '1', note: 'C1', type: 'membrane', color: 'border-red-600 bg-red-950/40' },
  { id: 2, name: 'Snare Hard', key: '2', note: '8n', type: 'noise', color: 'border-red-500 bg-red-900/40' },
  { id: 3, name: 'Hi-Hat Closed', key: '3', note: '16n', type: 'metal', color: 'border-rose-600 bg-rose-950/40' },
  { id: 4, name: 'Crash Cymbal', key: '4', note: 'C2', type: 'metal-crash', color: 'border-rose-500 bg-rose-900/40' },

  { id: 5, name: 'Bass Punch', key: 'Q', note: 'C2', type: 'fm-bass', color: 'border-red-700 bg-red-950/50' },
  { id: 6, name: 'Synth Lead', key: 'W', note: 'E4', type: 'synth-lead', color: 'border-red-600 bg-red-900/50' },
  { id: 7, name: 'Pluck Arp', key: 'E', note: 'G4', type: 'synth-pluck', color: 'border-rose-700 bg-rose-950/50' },
  { id: 8, name: 'Power Chord', key: 'R', note: 'C4', type: 'poly-chord', color: 'border-rose-600 bg-rose-900/50' },

  { id: 9, name: 'Sub Bass', key: 'A', note: 'G1', type: 'membrane', color: 'border-red-800 bg-red-950/60' },
  { id: 10, name: 'Clap Attack', key: 'S', note: '16n', type: 'clap', color: 'border-red-700 bg-red-900/60' },
  { id: 11, name: 'Perc High', key: 'D', note: 'A4', type: 'synth-perc', color: 'border-rose-800 bg-rose-950/60' },
  { id: 12, name: 'Vocal Chop', key: 'F', note: 'C5', type: 'synth-vocal', color: 'border-rose-700 bg-rose-900/60' },

  { id: 13, name: 'FX Riser', key: 'Z', note: 'C3', type: 'fx-sweep', color: 'border-red-900 bg-red-950/70' },
  { id: 14, name: 'Drop Boom', key: 'X', note: 'A0', type: 'membrane', color: 'border-red-800 bg-red-900/70' },
  { id: 15, name: 'Tom High', key: 'C', note: 'G2', type: 'membrane', color: 'border-rose-900 bg-rose-950/70' },
  { id: 16, name: 'Tom Low', key: 'V', note: 'C2', type: 'membrane', color: 'border-rose-800 bg-rose-900/70' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Module-level Singletons — created ONCE for the lifetime of the application.
// This ensures that React re-renders NEVER recreate synths or lose AudioNode
// connections.
// ─────────────────────────────────────────────────────────────────────────────
let isInitialized = false
let pianoSampler = null
let fallbackPiano = null
let synths = null
let drumSynths = null
let resumePromise = null

/**
 * Initializes all synths and samplers.
 * Connected explicitly to .toDestination() with loud, clear, unmuted volume levels.
 */
function initSynths() {
  console.log('[AudioEngine] initSynths() dipanggil dari dalam gesture user')
  if (isInitialized) return
  isInitialized = true

  try {
    // ── 1. Piano Fallback Synth (PolySynth) ──────────────────────────────────
    // Rich, warm triangle-wave polyphonic piano that works 100% offline immediately.
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.8, sustain: 0.25, release: 1.2 },
    }).toDestination()
    polySynth.volume.value = -2
    fallbackPiano = polySynth

    // ── 2. Salamander Grand Piano Sampler (Async CDN) ───────────────────────
    try {
      const sampler = new Tone.Sampler({
        urls: {
          A0: 'A0.mp3', C1: 'C1.mp3', D2: 'D2.mp3',
          F3: 'F3.mp3', A4: 'A4.mp3', C5: 'C5.mp3', E6: 'E6.mp3',
        },
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        onload: () => {
          console.log('[AudioEngine] Salamander Grand Piano samples loaded successfully')
        },
        onerror: (err) => {
          console.warn('[AudioEngine] Salamander load failed (using fallback polySynth):', err)
        },
      }).toDestination()
      sampler.volume.value = 0
      pianoSampler = sampler
    } catch (err) {
      console.warn('[AudioEngine] Could not create Sampler instance:', err)
      pianoSampler = null
    }

    // ── 3. Launchpad Synths ──────────────────────────────────────────────────
    const kickSynth = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4 }).toDestination()
    kickSynth.volume.value = -2

    const snareNoise = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
    }).toDestination()
    snareNoise.volume.value = -4

    const metalSynth = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.08, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
    }).toDestination()
    metalSynth.volume.value = -8

    const fmSynth = new Tone.FMSynth().toDestination()
    fmSynth.volume.value = -4

    const leadSynth = new Tone.PolySynth(Tone.Synth).toDestination()
    leadSynth.volume.value = -4

    synths = {
      membrane: kickSynth,
      noise: snareNoise,
      metal: metalSynth,
      'metal-crash': metalSynth,
      'fm-bass': fmSynth,
      'synth-lead': leadSynth,
      'synth-pluck': leadSynth,
      'poly-chord': leadSynth,
      clap: snareNoise,
      'synth-perc': kickSynth,
      'synth-vocal': leadSynth,
      'fx-sweep': fmSynth,
    }

    // ── 4. Drum Kit Synths ───────────────────────────────────────────────────
    const drumKick = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 5,
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
    }).toDestination()
    drumKick.volume.value = 0

    const drumSnare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.03 },
    }).toDestination()
    drumSnare.volume.value = -4

    const drumHihat = new Tone.MetalSynth({
      frequency: 450,
      envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4500, octaves: 1.5,
    }).toDestination()
    drumHihat.volume.value = -8

    const drumTom = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 3,
      envelope: { attack: 0.001, decay: 0.16, sustain: 0, release: 0.04 },
    }).toDestination()
    drumTom.volume.value = -2

    const drumCymbal = new Tone.MetalSynth({
      frequency: 320,
      envelope: { attack: 0.001, decay: 0.25, release: 0.05 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
    }).toDestination()
    drumCymbal.volume.value = -8

    const drumClap = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.02 },
    }).toDestination()
    drumClap.volume.value = -4

    drumSynths = {
      kick: drumKick,
      snare: drumSnare,
      hihat: drumHihat,
      tom: drumTom,
      cymbal: drumCymbal,
      clap: drumClap,
    }

    console.log('[AudioEngine] All instrument synths initialized successfully')
  } catch (err) {
    console.error('[AudioEngine] Critical initialization error:', err)
  }
}

/**
 * Ensures Tone.context is in the 'running' state.
 * Safe to call concurrently: deduplicates resume promises.
 */
export async function ensureAudioRunning() {
  if (Tone.context.state === 'running') {
    if (!isInitialized) initSynths()
    return true
  }

  if (resumePromise) {
    return resumePromise
  }

  resumePromise = (async () => {
    try {
      const rawCtx = Tone.context.rawContext._context || Tone.context.rawContext
      
      // Resume langsung di level native AudioContext, JANGAN andalkan Tone.start()
      if (rawCtx && rawCtx.state !== 'running') {
        await rawCtx.resume()
      }

      // Polling: cek status setiap 50ms, maksimal 1 detik
      const maxAttempts = 20
      for (let i = 0; i < maxAttempts; i++) {
        if (Tone.context.state === 'running') break
        await new Promise((resolve) => setTimeout(resolve, 50))
        if (rawCtx && rawCtx.state !== 'running') {
          try { await rawCtx.resume() } catch (e) { /* ignore, will retry */ }
        }
      }

      console.log('[AudioEngine] Final context state after manual resume attempts:', Tone.context.state)
      
      // Inisialisasi synths SETELAH context berstatus running dalam user gesture
      if (Tone.context.state === 'running' && !isInitialized) {
        initSynths()
      }
    } catch (err) {
      console.warn('[AudioEngine] Failed to resume AudioContext (manual method):', err)
    } finally {
      resumePromise = null
    }
    return Tone.context.state === 'running'
  })()

  return resumePromise
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL INTERACTION UNLOCK
// Listens on window/document for the first touch or click to unlock AudioContext
// eagerly before the user even taps an instrument key.
// ─────────────────────────────────────────────────────────────────────────────
if (typeof document !== 'undefined') {
  const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown']
  const handleGlobalInteraction = () => {
    if (Tone.context.state !== 'running') {
      ensureAudioRunning()
    } else {
      unlockEvents.forEach((evt) => {
        document.removeEventListener(evt, handleGlobalInteraction, true)
      })
    }
  }

  unlockEvents.forEach((evt) => {
    document.addEventListener(evt, handleGlobalInteraction, { capture: true, passive: true })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Hook: useAudioEngine
// Memoizes playback functions and holds references to the singleton audio engine.
// ─────────────────────────────────────────────────────────────────────────────
export function useAudioEngine() {
  // Instrumen diinisialisasi secara lazy di dalam ensureAudioRunning()
  // tepat saat user gesture pertama terjadi dan context sudah running.

  /**
   * Play a piano note.
   * Explicitly checks that Tone.context.state === "running" before triggering.
   * If Salamander Sampler is fully loaded, uses Sampler; otherwise uses PolySynth fallback.
   */
  const playPianoNote = async (note, time) => {
    console.log('[AudioEngine] playPianoNote dipanggil dengan note:', note, '| context state:', Tone.context.state)
    if (Tone.context.state !== 'running') {
      await ensureAudioRunning()
    }
    if (Tone.context.state !== 'running') {
      console.warn('[AudioEngine] playPianoNote aborted: Tone.context is not running (state:', Tone.context.state, ')')
      return
    }

    try {
      // Use Sampler ONLY if fully loaded; otherwise use polySynth fallback
      const isSamplerReady = pianoSampler && pianoSampler.loaded
      const activeEngine = isSamplerReady ? pianoSampler : fallbackPiano

      if (!activeEngine) {
        console.warn('[AudioEngine] No piano engine available')
        return
      }

      if (time !== undefined) {
        console.log('[AudioEngine] Akan trigger suara menggunakan engine:', isSamplerReady ? 'Sampler' : 'PolySynth fallback', '| activeEngine ada?', !!activeEngine)
        activeEngine.triggerAttackRelease(note, '8n', time)
      } else {
        // Immediate playback (user interaction) — no time parameter for instant response
        console.log('[AudioEngine] Akan trigger suara menggunakan engine:', isSamplerReady ? 'Sampler' : 'PolySynth fallback', '| activeEngine ada?', !!activeEngine)
        activeEngine.triggerAttackRelease(note, '8n')
      }
    } catch (err) {
      console.error('[AudioEngine] Error in playPianoNote for', note, err)
    }
  }

  /**
   * Play a launchpad pad.
   * Explicitly checks Tone.context.state === "running".
   */
  const playLaunchpadPad = async (pad, time) => {
    if (Tone.context.state !== 'running') {
      await ensureAudioRunning()
    }
    if (Tone.context.state !== 'running') {
      console.warn('[AudioEngine] playLaunchpadPad aborted: AudioContext not running')
      return
    }
    if (!synths) return

    try {
      if (pad.type === 'noise' || pad.type === 'clap') {
        if (time !== undefined) synths.noise.triggerAttackRelease('16n', time)
        else synths.noise.triggerAttackRelease('16n')
      } else if (pad.type === 'metal' || pad.type === 'metal-crash') {
        const freq = pad.type === 'metal-crash' ? 320 : 450
        if (time !== undefined) synths.metal.triggerAttackRelease(freq, '16n', time)
        else synths.metal.triggerAttackRelease(freq, '16n')
      } else if (pad.type === 'poly-chord') {
        if (time !== undefined) synths['synth-lead'].triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '16n', time)
        else synths['synth-lead'].triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '16n')
      } else {
        const synth = synths[pad.type] || synths.membrane
        if (synth) {
          if (time !== undefined) synth.triggerAttackRelease(pad.note, '16n', time)
          else synth.triggerAttackRelease(pad.note, '16n')
        }
      }
    } catch (err) {
      console.error('[AudioEngine] Error in playLaunchpadPad for', pad, err)
    }
  }

  /**
   * Play a drum pad.
   * Correctly routes notes vs durations for MetalSynth, MembraneSynth, and NoiseSynth.
   * Explicitly checks Tone.context.state === "running".
   */
  const playDrumPad = async (padId, time) => {
    if (Tone.context.state !== 'running') {
      await ensureAudioRunning()
    }
    if (Tone.context.state !== 'running') {
      console.warn('[AudioEngine] playDrumPad aborted: AudioContext not running')
      return
    }

    const synth = drumSynths?.[padId]
    if (!synth) {
      console.warn('[AudioEngine] Drum synth not found for padId:', padId)
      return
    }

    try {
      if (padId === 'kick') {
        // MembraneSynth: (note, duration, time)
        if (time !== undefined) synth.triggerAttackRelease('C1', '16n', time)
        else synth.triggerAttackRelease('C1', '16n')
      } else if (padId === 'tom') {
        // MembraneSynth: (note, duration, time)
        if (time !== undefined) synth.triggerAttackRelease('G2', '16n', time)
        else synth.triggerAttackRelease('G2', '16n')
      } else if (padId === 'snare' || padId === 'clap') {
        // NoiseSynth: (duration, time)
        if (time !== undefined) synth.triggerAttackRelease('16n', time)
        else synth.triggerAttackRelease('16n')
      } else if (padId === 'hihat') {
        // MetalSynth: (note/frequency, duration, time)
        if (time !== undefined) synth.triggerAttackRelease(450, '32n', time)
        else synth.triggerAttackRelease(450, '32n')
      } else if (padId === 'cymbal') {
        // MetalSynth: (note/frequency, duration, time)
        if (time !== undefined) synth.triggerAttackRelease(320, '16n', time)
        else synth.triggerAttackRelease(320, '16n')
      }
    } catch (err) {
      console.error('[AudioEngine] Error in playDrumPad for', padId, err)
    }
  }

  return { playPianoNote, playLaunchpadPad, playDrumPad }
}
