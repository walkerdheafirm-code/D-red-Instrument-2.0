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
 * Memutar suara "KLIK" tombol fisik yang renyah dan nyata (BUKAN nada piano / akord musik).
 * Disintesis menggunakan audio buffer mikro-impuls dan noise filter transient (durasi ~20 milidetik),
 * persis seperti bunyi klik mouse atau switch mechanical button.
 *
 * @param {number} [volume=0.3] - Tingkat volume klik
 * @param {number} [pitchModifier=1.0] - Modifikasi frekuensi (1.0 = klik mouse renyah, 0.75 = klik saklar solid)
 */
function playTactileClick(volume = 0.3, pitchModifier = 1.0) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const sampleRate = ctx.sampleRate
    // Durasi mikro-klik sangat singkat (~20ms) agar murni terdengar bunyi klik mekanis tanpa nada berdering
    const duration = 0.02
    const frameCount = Math.floor(sampleRate * duration)
    const buffer = ctx.createBuffer(1, frameCount, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount
      // Peluruhan sangat tajam (kurva peluruhan cepat seperti benturan fisik switch)
      const env = Math.pow(1 - t, 7)
      // Sentakan suara gesekan mekanis
      const noise = Math.random() * 2 - 1
      // Mikro-ketukan fisik switch
      const clickPulse = Math.sin(2 * Math.PI * (2400 * pitchModifier) * (i / sampleRate)) * Math.exp(-t * 40)

      data[i] = (noise * 0.45 + clickPulse * 0.75) * env
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Filter bandpass untuk membentuk frekuensi klik yang natural dan tidak menusuk telinga
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2600 * pitchModifier, ctx.currentTime)
    filter.Q.setValueAtTime(1.1, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, ctx.currentTime)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start(ctx.currentTime)
  } catch (err) {
    console.warn('[uiSound] Gagal memutar suara klik:', err)
  }
}

/**
 * Suara klik saat tombol "Masuk ke Studio" / splash screen ditekan.
 * Bunyi klik tombol fisik yang solid dan mantap (bukan musik/piano).
 */
export function playStudioEnterSound() {
  playTactileClick(0.35, 0.8)
}

/**
 * Suara klik saat menu navigasi sidebar ditekan.
 * Bunyi klik mouse yang renyah, ringan, dan responsif (bukan musik/piano).
 */
export function playNavClickSound() {
  playTactileClick(0.24, 1.05)
}
