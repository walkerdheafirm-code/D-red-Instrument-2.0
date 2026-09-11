let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Memutar suara imersif saat masuk ke studio dari Splash Screen.
 * Menghasilkan suara swell synth-pad hangat (akord D power studio) yang elegan dan megah.
 */
export function playStudioEnterSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Akord synthesizer studio audio: D2, A2, D3, F#3, A3, D4, D5 shimmer
    const notes = [
      { freq: 73.42, type: 'triangle', maxVol: 0.22, attack: 0.08, decay: 1.6 },
      { freq: 110.0, type: 'sine', maxVol: 0.18, attack: 0.1, decay: 1.5 },
      { freq: 146.83, type: 'triangle', maxVol: 0.16, attack: 0.12, decay: 1.4 },
      { freq: 185.0, type: 'sine', maxVol: 0.14, attack: 0.15, decay: 1.3 },
      { freq: 220.0, type: 'triangle', maxVol: 0.12, attack: 0.18, decay: 1.2 },
      { freq: 293.66, type: 'sine', maxVol: 0.1, attack: 0.2, decay: 1.2 },
      { freq: 587.33, type: 'sine', maxVol: 0.06, attack: 0.25, decay: 1.0 },
    ]

    notes.forEach(({ freq, type, maxVol, attack, decay }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.linearRampToValueAtTime(maxVol, now + attack)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + attack + decay + 0.05)
    })
  } catch (err) {
    console.warn('[uiSound] Gagal memutar studio enter sound:', err)
  }
}

/**
 * Memutar suara klik UI yang taktil, renyah, dan modern saat menu sidebar ditekan.
 * Sangat cepat dan halus (~55ms) sehingga tidak mengganggu pengalaman pengguna.
 */
export function playNavClickSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // Pitch sweep cepat dari 950Hz ke 320Hz memberikan efek klik fisik yang bersih
    osc.type = 'sine'
    osc.frequency.setValueAtTime(950, now)
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.045)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.06)
  } catch (err) {
    console.warn('[uiSound] Gagal memutar nav click sound:', err)
  }
}
