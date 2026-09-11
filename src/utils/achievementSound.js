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
 * Memutar efek audio synthesized untuk notifikasi unlock achievement.
 * Menggunakan Web Audio API murni sehingga mandiri, tidak memerlukan file mp3 eksternal,
 * dan tidak mengganggu alur Tone.js instrumen musik.
 *
 * @param {boolean} isSpecial - Jika true, memutar nada selebrasi/fanfare megah (saat ke-6 achievement selesai)
 */
export function playAchievementSound(isSpecial = false) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    if (isSpecial) {
      // Fanfare selebrasi megah & berkilau: C5 -> E5 -> G5 -> C6 -> E6 + harmonic shimmer
      const fanfareNotes = [
        { freq: 523.25, time: 0, dur: 0.22, vol: 0.16 }, // C5
        { freq: 659.25, time: 0.11, dur: 0.22, vol: 0.18 }, // E5
        { freq: 783.99, time: 0.22, dur: 0.25, vol: 0.2 }, // G5
        { freq: 1046.5, time: 0.35, dur: 0.45, vol: 0.22 }, // C6
        { freq: 1318.51, time: 0.48, dur: 0.9, vol: 0.25 }, // E6
        { freq: 1567.98, time: 0.52, dur: 0.85, vol: 0.15 }, // G6 (shimmer)
      ]

      fanfareNotes.forEach(({ freq, time, dur, vol }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + time)

        gain.gain.setValueAtTime(0.0001, now + time)
        gain.gain.linearRampToValueAtTime(vol, now + time + 0.025)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + time)
        osc.stop(now + time + dur + 0.05)
      })
    } else {
      // Chime lonceng cerah 3 nada: G5 -> C6 -> E6 (lembut, elegan, jernih)
      const chimeNotes = [
        { freq: 783.99, time: 0, dur: 0.28, vol: 0.18 }, // G5
        { freq: 1046.5, time: 0.1, dur: 0.32, vol: 0.2 }, // C6
        { freq: 1318.51, time: 0.2, dur: 0.65, vol: 0.22 }, // E6
      ]

      chimeNotes.forEach(({ freq, time, dur, vol }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + time)

        gain.gain.setValueAtTime(0.0001, now + time)
        gain.gain.linearRampToValueAtTime(vol, now + time + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + time)
        osc.stop(now + time + dur + 0.05)
      })
    }
  } catch (err) {
    console.warn('[AchievementSound] Gagal memutar audio notifikasi:', err)
  }
}
