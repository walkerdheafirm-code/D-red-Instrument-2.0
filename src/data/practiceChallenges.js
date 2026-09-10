/**
 * practiceChallenges.js
 * Defines the practice challenge types available in Practice Mode.
 */

export const practiceChallenges = [
  {
    id: 'follow-melody',
    title: 'Ikuti Melodi',
    instrument: 'piano',
    description:
      'Sistem memainkan sekuens melodi piano. Tuts yang berbunyi akan menyala merah. Dengarkan dan ulangi urutan melodi tersebut sebanyak 5 ronde.',
    emoji: '🎹',
    rounds: 5,
  },
  {
    id: 'follow-rhythm',
    title: 'Ikuti Ritme',
    instrument: 'drumkit',
    description:
      'Sistem memainkan sekuens ketukan pad drum. Pad yang berbunyi akan menyala merah. Ulangi urutan yang sama. 5 ronde bertingkat.',
    emoji: '🥁',
    rounds: 5,
  },
]

// Diatonic scale C4 - C5 (Do Re Mi Fa Sol La Si Do) for natural, melodic piano sequences
// Keyboard shortcut: A S D F G H J K
export const PRACTICE_PIANO_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']

// Drum pad ids available for the "Follow the Rhythm" challenge
export const PRACTICE_DRUM_PADS = ['kick', 'snare', 'hihat', 'tom', 'cymbal', 'clap']
