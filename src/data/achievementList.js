/**
 * achievementList.js
 * Definitions and unlock evaluation criteria for the Achievement system.
 */

export const ACHIEVEMENTS = [
  {
    id: 'badge-first-recording',
    title: 'Rekaman Pertama',
    description: 'Berhasil membuat dan menyimpan rekaman pertamamu.',
    icon: '🎙️',
    category: 'recording',
    checkUnlocked: ({ recordings }) => recordings.length >= 1,
  },
  {
    id: 'badge-recording-collector',
    title: 'Kolektor Rekaman',
    description: 'Menyimpan minimal 5 rekaman dalam perpustakaan instrumen.',
    icon: '📚',
    category: 'recording',
    checkUnlocked: ({ recordings }) => recordings.length >= 5,
  },
  {
    id: 'badge-first-practice',
    title: 'Latihan Pertama',
    description: 'Menyelesaikan 1 sesi tantangan di Practice Mode.',
    icon: '🎯',
    category: 'practice',
    checkUnlocked: ({ scores }) => scores.length >= 1,
  },
  {
    id: 'badge-perfect-score',
    title: 'Skor Sempurna',
    description: 'Meraih skor 100% pada sesi tantangan Practice Mode.',
    icon: '⭐',
    category: 'practice',
    checkUnlocked: ({ scores }) => scores.some((s) => s.score === 100),
  },
  {
    id: 'badge-beat-maker',
    title: 'Beat Maker',
    description: 'Membuat dan menyimpan setidaknya 1 pola ketukan kustom sendiri.',
    icon: '🎛️',
    category: 'pattern',
    checkUnlocked: ({ patterns }) => patterns.some((p) => !p.isDefault),
  },
  {
    id: 'badge-multi-instrument',
    title: 'Multi-Instrumentalist',
    description: 'Pernah membuat rekaman dengan setidaknya 2 instrumen berbeda.',
    icon: '🎶',
    category: 'recording',
    checkUnlocked: ({ recordings }) => {
      const distinctInstruments = new Set(recordings.map((r) => r.instrument).filter(Boolean))
      return distinctInstruments.size >= 2
    },
  },
]
