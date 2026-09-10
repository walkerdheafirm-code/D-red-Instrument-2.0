/**
 * defaultBeatPatterns.js
 * Default presets for the 8-step sequencer beat pattern library.
 * Default patterns cannot be deleted (isDefault: true).
 */

export const DEFAULT_BEAT_PATTERNS = [
  {
    id: 'pattern-rock-classic',
    name: 'Rock Classic Beat',
    instrument: 'drumkit',
    steps: [
      { track: 'kick',   active: [true,  false, false, false, true,  false, false, false] },
      { track: 'snare',  active: [false, false, true,  false, false, false, true,  false] },
      { track: 'hihat',  active: [true,  true,  true,  true,  true,  true,  true,  true]  },
      { track: 'tom',    active: [false, false, false, false, false, false, false, false] },
      { track: 'cymbal', active: [true,  false, false, false, false, false, false, false] },
      { track: 'clap',   active: [false, false, false, false, false, false, false, false] },
    ],
    isDefault: true,
    createdAt: '2026-09-08T10:00:00.000Z',
  },
  {
    id: 'pattern-four-floor',
    name: 'Four on the Floor House',
    instrument: 'drumkit',
    steps: [
      { track: 'kick',   active: [true,  false, true,  false, true,  false, true,  false] },
      { track: 'snare',  active: [false, false, false, false, false, false, false, false] },
      { track: 'hihat',  active: [false, true,  false, true,  false, true,  false, true]  },
      { track: 'tom',    active: [false, false, false, false, false, false, false, false] },
      { track: 'cymbal', active: [false, false, false, false, false, false, false, false] },
      { track: 'clap',   active: [false, false, true,  false, false, false, true,  false] },
    ],
    isDefault: true,
    createdAt: '2026-09-08T10:05:00.000Z',
  },
  {
    id: 'pattern-hiphop-boom',
    name: 'Boom Bap Groove',
    instrument: 'drumkit',
    steps: [
      { track: 'kick',   active: [true,  false, false, true,  false, false, true,  false] },
      { track: 'snare',  active: [false, false, true,  false, false, false, true,  false] },
      { track: 'hihat',  active: [true,  true,  true,  true,  true,  true,  true,  true]  },
      { track: 'tom',    active: [false, false, false, false, false, true,  false, false] },
      { track: 'cymbal', active: [false, false, false, false, false, false, false, false] },
      { track: 'clap',   active: [false, false, false, false, false, false, false, false] },
    ],
    isDefault: true,
    createdAt: '2026-09-08T10:10:00.000Z',
  },
  {
    id: 'pattern-launchpad-groove',
    name: 'Electro Launch Pulse',
    instrument: 'launchpad',
    steps: [
      { track: '1', active: [true,  false, true,  false, true,  false, true,  false] }, // Kick Deep
      { track: '2', active: [false, false, true,  false, false, false, true,  false] }, // Snare Hard
      { track: '3', active: [true,  true,  true,  true,  true,  true,  true,  true]  }, // Hi-Hat Closed
      { track: '4', active: [true,  false, false, false, false, false, false, false] }, // Crash Cymbal
    ],
    isDefault: true,
    createdAt: '2026-09-08T10:15:00.000Z',
  },
]
