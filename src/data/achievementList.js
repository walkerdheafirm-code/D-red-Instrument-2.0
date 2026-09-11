/**
 * achievementList.js
 * Definitions and unlock evaluation criteria for the Achievement system.
 */

// Helper to filter for user-created recordings only (ignoring preset templates)
const getUserRecordings = (recordings = []) =>
  recordings.filter(
    (r) => !r.isDefault && r.id !== 'rec-1' && r.id !== 'rec-2' && r.id !== 'rec-3',
  )

export const ACHIEVEMENTS = [
  {
    id: 'badge-first-recording',
    title: 'Rekaman Pertama',
    description: 'Berhasil membuat dan menyimpan rekaman pertamamu.',
    icon: '🎙️',
    category: 'recording',
    isUnlocked: false,
    checkUnlocked: ({ recordings = [] }) => getUserRecordings(recordings).length >= 1,
  },
  {
    id: 'badge-recording-collector',
    title: 'Kolektor Rekaman',
    description: 'Menyimpan minimal 5 rekaman dalam perpustakaan instrumen.',
    icon: '📚',
    category: 'recording',
    isUnlocked: false,
    checkUnlocked: ({ recordings = [] }) => getUserRecordings(recordings).length >= 5,
  },
  {
    id: 'badge-first-practice',
    title: 'Latihan Pertama',
    description: 'Menyelesaikan 1 sesi tantangan di Practice Mode.',
    icon: '🎯',
    category: 'practice',
    isUnlocked: false,
    checkUnlocked: ({ scores = [] }) => scores.length >= 1,
  },
  {
    id: 'badge-perfect-score',
    title: 'Skor Sempurna',
    description: 'Meraih skor 100% pada sesi tantangan Practice Mode.',
    icon: '⭐',
    category: 'practice',
    isUnlocked: false,
    checkUnlocked: ({ scores = [] }) => scores.some((s) => s.score === 100),
  },
  {
    id: 'badge-beat-maker',
    title: 'Beat Maker',
    description: 'Membuat dan menyimpan setidaknya 1 pola ketukan kustom sendiri.',
    icon: '🎛️',
    category: 'pattern',
    isUnlocked: false,
    checkUnlocked: ({ patterns = [] }) => patterns.some((p) => !p.isDefault),
  },
  {
    id: 'badge-multi-instrument',
    title: 'Multi-Instrumentalist',
    description: 'Pernah membuat rekaman dengan setidaknya 2 instrumen berbeda.',
    icon: '🎶',
    category: 'recording',
    isUnlocked: false,
    checkUnlocked: ({ recordings = [] }) => {
      const userRecs = getUserRecordings(recordings)
      const distinctInstruments = new Set(userRecs.map((r) => r.instrument).filter(Boolean))
      return distinctInstruments.size >= 2
    },
  },
]
