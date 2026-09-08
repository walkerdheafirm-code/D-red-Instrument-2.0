# PRD — D'red Instrument 2.0
### React Fundamental Training Final Project
### Living working document — update the "Progress Status" section after each phase is completed

---

## 0. Important Notes for the AI Agent (OpenCode.AI)

- This document is a **working instruction document**, not the submission document. Do not edit `README.md` unless explicitly asked — `README.md` is written separately at the end of the project.
- Follow the **Work Priority** order (Section 11) sequentially. Every feature is tagged `[REQUIRED]` (part of the grading rubric, must not be skipped) or `[OPTIONAL]` (can be simplified/cut if there isn't enough time).
- After finishing each phase, run `pnpm build` to make sure there are no errors, then update the checklist in Section 12 (Progress Status).
- Always briefly explain what was done and why — this working document is meant to be read by a human too, not just the AI.
- Follow the Design System (Section 4) strictly — do not improvise your own colors/fonts/component styles.

---

## 1. Overview

**App name (display):** D'red Instrument 2.0
**Technical name (folder/package):** `dred-instrument`

**Description:**
A React web application for playing virtual musical instruments (Piano, Launchpad, Drum Kit) with a metronome, recording performances, saving recordings as a fully manageable collection (CRUD), practicing through a scored Practice Mode, building custom beats through a Beat Pattern Library, and tracking progress through a Dashboard and an Achievement/Badge system. Visual identity: dark, bold, and mysterious ("bloody" — black & red).

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| Build tool | Vite |
| Package manager | pnpm |
| Framework | React JS (JavaScript) |
| Styling | Tailwind CSS |
| Routing | React Router (`react-router-dom`) |
| Global state | Context API |
| Audio engine | Tone.js |
| Piano sample | Tone.js `Sampler` with Salamander Grand Piano samples |
| Launchpad & Drum Kit | Tone.js `Sampler` / `MembraneSynth` / `NoiseSynth` (synthesis, no external samples needed) |
| Recording | `MediaRecorder API` (browser built-in) |
| Data storage | `localStorage` |
| Font | Google Fonts: `Bebas Neue` (display/logo), Tailwind default sans-serif (UI), monospace (numbers) |
| Deployment | Vercel |
| Version control | GitHub (public repository) |

Initial setup:
```bash
pnpm create vite@latest dred-instrument -- --template react
cd dred-instrument
pnpm install
pnpm install tailwindcss @tailwindcss/vite react-router-dom tone
```

---

## 3. Folder Structure

```
src/
├── assets/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── SplashScreen.jsx
│   │   ├── OrientationPrompt.jsx
│   │   └── PageLayout.jsx
│   ├── common/
│   │   ├── Pagination.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterDropdown.jsx
│   │   ├── SortDropdown.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Toast.jsx
│   │   ├── EmptyState.jsx
│   │   └── Badge.jsx
│   ├── instruments/
│   │   ├── Piano.jsx
│   │   ├── Launchpad.jsx
│   │   ├── DrumKit.jsx
│   │   └── Metronome.jsx
│   ├── recordings/
│   │   ├── RecordingCard.jsx
│   │   ├── RecordingForm.jsx
│   │   └── RecordingPlayer.jsx
│   ├── practice/
│   │   ├── PracticeChallengeCard.jsx
│   │   └── PracticeResult.jsx
│   ├── beatpattern/
│   │   ├── PatternGrid.jsx
│   │   └── PatternForm.jsx
│   └── dashboard/
│       ├── StatCard.jsx
│       └── RecentRecordingList.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── PianoPage.jsx
│   ├── LaunchpadPage.jsx
│   ├── DrumKitPage.jsx
│   ├── RecordingsPage.jsx
│   ├── RecordingDetailPage.jsx
│   ├── RecordingFormPage.jsx
│   ├── PracticeModePage.jsx
│   ├── BeatPatternPage.jsx
│   ├── AchievementsPage.jsx
│   └── NotFoundPage.jsx
├── context/
│   ├── RecordingContext.jsx
│   ├── PracticeContext.jsx
│   ├── BeatPatternContext.jsx
│   ├── AchievementContext.jsx
│   └── MetronomeContext.jsx
├── data/
│   ├── defaultBeatPatterns.js
│   ├── practiceChallenges.js
│   └── achievementList.js
├── hooks/
│   ├── useAudioEngine.js
│   ├── useMetronome.js
│   ├── useOrientation.js
│   └── useLocalStorage.js
├── utils/
│   ├── formatDuration.js
│   ├── formatDate.js
│   └── sortHelpers.js
├── App.jsx
└── main.jsx
```

Note: there is no `ThemeContext`/dark-mode toggle. The app intentionally has **one fixed dark visual identity** as part of its branding (not a user-switchable preference).

---

## 4. Design System

### 4.1 Color Palette
| Token | Hex | Usage |
|---|---|---|
| Main background | `#0A0A0B` | Page background |
| Panel/surface | `#151417` | Sidebar, card, panel |
| Hairline border | `#2A2828` | Thin border between elements |
| Oxblood (dark accent) | `#6B1420` | Secondary accent, inactive button background |
| Glowing red (main accent) | `#C81E3A` | Logo, record/active indicator, pressed-key outline, active menu highlight |
| Off-white | `#EDE9E6` | Primary text |
| Neutral gray | `#7A7570` | Secondary text/labels, inactive menu items |

### 4.2 Typography
- **Logo & large headings:** `Bebas Neue` (Google Fonts), red color `#C81E3A` — bold, tall, Netflix title-card-like vibe
- **UI/body text:** Tailwind default sans-serif, off-white/gray depending on hierarchy
- **Numbers (BPM, score, duration, record timer):** monospace font

### 4.3 Logo
Text wordmark only: **"D'red Instrument"**, Bebas Neue font, red color `#C81E3A`. No additional symbol/monogram. Used in the Sidebar (top) and Splash Screen.

### 4.4 Layout Principles
- Sharp-cornered panels (minimal/no large rounding), hairline borders — studio hardware feel, not a soft SaaS card with soft shadows
- One red "moment" as the focal point per screen (Record button, active menu item, active key outline) — everything else stays monochrome

### 4.5 Instruments — Visual Detail

**Piano:**
- Normal key shape (white keys aligned in a row, black keys nested between them in standard piano position — NOT flat equal-sized boxes)
- White keys: subtle box-shadow at the bottom (slightly raised look)
- Black keys: stronger box-shadow + top-light-to-bottom-dark gradient (gives a "floating above the white keys" look)
- Pressed state (`:active` / `.is-pressed` class): `transform: scale(0.97)` or `translateY(2px)`, shadow shrinks, ~100ms transition
- Pressed / target-note state: glowing red outline (`box-shadow: 0 0 10px 2px #C81E3A, inset 0 0 0 2px #C81E3A`) — does NOT change the key's base color

**Launchpad & Drum Kit:**
- Flat pad grid with hairline borders, dark base color (`#151417`/`#1C1B1E`)
- Active/pressed pad: glowing red outline, consistent with the piano

### 4.6 Sidebar Navigation
- Fixed to the left, full height, background `#151417` (slightly lighter than the page background for layering)
- Contents: logo at top, menu list with icon + label, active item gets a subtle red-tinted background + solid red left border
- **Collapse toggle:** clicking the toggle button makes the sidebar **disappear completely** (not shrink to icon-only), with a small button appearing to reopen it
- **Default state:** fully open on first app load
- Collapse state persisted in `localStorage` so the user's preference survives reloads
- **Mobile (<768px):** hidden by default, appears as an overlay with a dark transparent backdrop when the menu (hamburger) button is tapped; tapping outside the sidebar closes it automatically

### 4.7 Splash Screen
- Shown the first time the app is opened within a browser session (check `sessionStorage`, not `localStorage`)
- Full-screen, `#0A0A0B` background, "D'red Instrument" text in Bebas Neue red centered on screen
- CSS animation: fade-in + scale (from small/transparent to full-size/solid), ~2–2.5 second duration
- Skippable by clicking anywhere
- No audio (browser autoplay policy does not allow automatic audio playback without prior user interaction)
- After finishing/skipping, redirect to `/` (Dashboard)

---

## 5. Responsive & Orientation Behavior

### 5.1 General Principles
- Standard Tailwind breakpoints: `sm` `md` `lg`
- Minimum 44x44px touch target on mobile
- Non-instrument pages (Dashboard, Recordings, Practice, Beat Pattern, Achievements): multi-column card/grid on desktop → stacks to 1 column on mobile. No special handling needed beyond a regular responsive grid.

### 5.2 Instrument Pages (Piano, Launchpad, Drum Kit)
- **Mobile, portrait orientation (default):** must remain usable — Piano: keys can be **scrolled horizontally** (`overflow-x: auto`, optional scroll-snap) since not all octaves fit on a narrow screen. Launchpad/Drum Kit: grid columns auto-adjust (`grid-template-columns: repeat(auto-fit, minmax(...))`)
- **Mobile, landscape orientation:** when the user physically rotates the device, the `orientation: landscape` CSS media query automatically provides more horizontal space — NO forced CSS-rotate trick, purely responsive to the device's actual physical orientation
- Optional: show a small non-blocking banner in portrait mode ("Rotate your device to landscape for a more comfortable view") — this is a suggestion, NOT a blocking overlay, since the piano must remain usable in portrait (via horizontal scroll)

### 5.3 Testing Orientation Without a Physical Device
- Chrome DevTools → Toggle Device Toolbar (`Ctrl+Shift+M`) → pick a device preset → click the rotate icon to simulate landscape/portrait
- Testing on a real device: run `pnpm run dev`, access it from a phone via the network address shown in the terminal (must be on the same WiFi network)

---

## 6. Routing

| Path | Page | Notes |
|---|---|---|
| `/` | DashboardPage | Stats, instrument shortcuts, recent recordings |
| `/piano` | PianoPage | Play piano + metronome + record |
| `/launchpad` | LaunchpadPage | Play launchpad + metronome + record |
| `/drumkit` | DrumKitPage | Play drum kit + metronome + record |
| `/recordings` | RecordingsPage | Recording list: search, filter, sort, pagination |
| `/recordings/:id` | RecordingDetailPage | Recording detail, `useParams()` |
| `/recordings/new` | RecordingFormPage | Form to add recording metadata |
| `/recordings/:id/edit` | RecordingFormPage | Edit metadata form (reuses the form component) |
| `/practice` | PracticeModePage | Choose & play a challenge |
| `/beat-patterns` | BeatPatternPage | List & build beat patterns (CRUD) |
| `/achievements` | AchievementsPage | Badge list |
| `*` | NotFoundPage | 404 page |

Requirements: `BrowserRouter`, `Routes`, `Route`, `NavLink` for highlighting the active Sidebar item, `useParams()` on the detail page, no full page reload when navigating.

---

## 7. Data Model

### 7.1 Recording
```js
{
  id: "rec-<timestamp>",
  title: "Latihan Malam",
  instrument: "piano" | "launchpad" | "drumkit",
  category: "latihan" | "cover" | "eksperimen" | "lainnya",
  tempo: 90,
  duration: 45,          // seconds, max 60 seconds per recording
  isFavorite: false,
  audioData: "data:audio/webm;base64,...",
  createdAt: "2026-09-08T20:00:00.000Z",
  updatedAt: "2026-09-08T20:00:00.000Z"
}
```

### 7.2 Practice Score
```js
{
  id: "score-<timestamp>",
  challengeId: "guess-note" | "follow-rhythm",
  instrument: "piano" | "drumkit",
  score: 80,             // percentage correct out of 5 rounds
  correctRounds: 4,
  totalRounds: 5,
  playedAt: "2026-09-08T20:00:00.000Z"
}
```

### 7.3 Beat Pattern
```js
{
  id: "pattern-<timestamp>",
  name: "Beat Pop Sederhana",
  instrument: "launchpad" | "drumkit",
  steps: [
    { track: "kick", active: [true, false, false, false, true, false, false, false] }, // 8 steps
    { track: "snare", active: [false, false, true, false, false, false, true, false] }
  ],
  isDefault: false,
  createdAt: "2026-09-08T20:00:00.000Z"
}
```

### 7.4 Achievement
```js
{
  id: "badge-first-recording",
  title: "Rekaman Pertama",
  description: "Berhasil membuat rekaman pertamamu",
  icon: "mic",
  isUnlocked: false,
  unlockedAt: null
}
```

Note: keep the `title`/`description` string values above in Indonesian (as shown) since those are user-facing content shown in the app UI, not code. Only the schema/field names and code are in English.

---

## 8. Feature Details

### 8.1 Instrument — Piano `[REQUIRED]`
- At least 2 octaves, fixed keyboard mapping: `A S D F G H J` → `C4 D4 E4 F4 G4 A4 B4`
- Uses Tone.js `Sampler` with Salamander Grand Piano samples
- Connected to the Metronome and Recording features
- Styling per Section 4.5

### 8.2 Instrument — Launchpad `[REQUIRED]`
- Dark-colored pad grid (4x4 or 4x8), each pad triggers a different short sample/loop
- Usable in free-play mode and within the Beat Pattern Library

### 8.3 Instrument — Drum Kit `[OPTIONAL — nice to have, 3rd instrument]`
- At least 4–6 parts: kick, snare, hi-hat, tom, cymbal
- `Tone.MembraneSynth` (kick/tom), `Tone.NoiseSynth` (hi-hat/cymbal/snare)
- Fixed keyboard mapping: `Q W E R` → kick/snare/hihat/tom

### 8.4 Metronome `[REQUIRED]`
- 40–240 BPM tempo range, visual indicator on each beat, accent on the first beat
- Tempo state lives in `MetronomeContext`, shared across instrument pages and the Beat Pattern feature

### 8.5 Recording (Main CRUD) `[REQUIRED]`
- **Create:** record from any instrument page (max 60 seconds) → quick form (title, category) before saving
- **Read (list):** `/recordings` — search by title (`.filter()`), filter by instrument/category, sort A-Z/Z-A and Newest/Oldest (`.sort()`), pagination (`Math.ceil()`, Prev/Next buttons disabled at the edges), search+filter+sort+pagination stay consistent together, show a message when results are empty
- **Read (detail):** `/recordings/:id` — audio player, metadata, Edit & Delete buttons
- **Update:** metadata edit form, updates without reload
- **Delete:** `ConfirmDialog` before deleting
- **Download:** button to download the recorded audio file

### 8.6 Practice Mode `[OPTIONAL — nice to have]`
Only available for **Piano** and **Drum Kit**. No Practice Mode for the Launchpad.

**Piano — "Guess the Note":**
1. The system picks 1 random note from the available piano notes array (`Math.floor(Math.random() * notes.length)`)
2. The note is played automatically via `Piano.jsx`'s `playNote()` function
3. The target key is given a highlight (glowing red outline) — always shown, there is no "hard mode" without a highlight
4. The user presses a key on the piano as usual
5. The system compares `playedNote === targetNote` (string comparison, not audio analysis)
6. Correct → score +1, generate a new note, move to the next round
7. After **5 rounds**, show the final result and save it as a new `Practice Score`

**Drum Kit — "Follow the Rhythm":**
1. The system picks and plays a short sequence of drum hits (e.g. 3–4 pads in sequence, from the drum pad id array)
2. Each pad the system plays is briefly highlighted (same flow as the piano)
3. The user repeats the same sequence by pressing the drum pads
4. The system compares the user's pressed sequence against the target sequence (index-by-index)
5. After **5 rounds**, show the final result and save it as a new `Practice Score`

### 8.7 Beat Pattern Library `[OPTIONAL — nice to have]`
Only available for **Launchpad** and **Drum Kit**. No Beat Pattern feature for the Piano.
- **8-step** sequencer per pattern, with several tracks (kick, snare, hi-hat, launchpad pad)
- Click a cell to toggle it on/off, Play button runs the pattern in sync with `MetronomeContext`'s tempo
- CRUD: Create (build & name a pattern), Read (list including default presets marked `isDefault: true`, which cannot be deleted), Update (edit user-created patterns), Delete (with confirmation; default presets cannot be deleted)

### 8.8 Achievement/Badge `[OPTIONAL — nice to have]`
- Badge grid at `/achievements`, locked badges shown dimmed (conditional rendering on `isUnlocked`)
- Minimum examples: "First Recording" (≥1 recording), "Recording Collector" (≥10 recordings), "First Practice" (1x practice session), "Beat Maker" (1x pattern created), "Perfect Score" (100% practice score)
- Unlock status checked via `AchievementContext` whenever related data changes

### 8.9 Dashboard `[REQUIRED — as the main routing landing page]`
- Stats computed from existing data (`.reduce()`/`.filter()`): total recordings, most-used instrument, total play duration, number of unlocked badges
- Recent recordings (last 3–5 by `createdAt`), playable directly from here
- Shortcut cards to each instrument and to Practice Mode/Beat Pattern Library

---

## 9. Context API

| Context | Stores | Minimum functions |
|---|---|---|
| `RecordingContext` | Recording list | `addRecording`, `updateRecording`, `deleteRecording` |
| `PracticeContext` | Practice score list | `addPracticeScore` |
| `BeatPatternContext` | Beat pattern list (default + custom) | `addPattern`, `updatePattern`, `deletePattern` |
| `AchievementContext` | Badge list & unlock status | `checkAndUnlockAchievements` |
| `MetronomeContext` | Tempo, play status, time signature | `setTempo`, `togglePlay` |

The sidebar's collapse state only needs to be stored via the `useLocalStorage` hook inside the `PageLayout`/`Sidebar` component — it doesn't need a separate Context since it isn't consumed by many far-apart components.

---

## 10. State Management (component level, `useState`)

Must be used for at least: each feature's main data (partly in Context, partly local to forms), form input, search keyword, sort selection, active pagination page, the item currently being edited, sidebar open/closed state, whether the splash screen has already been shown this session.

---

## 11. Work Priority

1. **Phase 1 `[REQUIRED]`:** Project setup, Tailwind, folder structure, Sidebar + basic Layout, routing for all pages (can still be empty), full Recording CRUD (search, filter, sort, pagination), `RecordingContext`.
2. **Phase 2 `[REQUIRED]`:** Piano + Metronome + Recording integration from the Piano page. Launchpad + Recording integration.
3. **Phase 3 `[REQUIRED]`:** Dashboard stats & shortcuts. Basic responsiveness (grid, mobile sidebar overlay).
4. **Phase 4 `[OPTIONAL]`:** Drum Kit. Practice Mode (Piano first, then Drum Kit). Piano horizontal scroll + mobile orientation handling.
5. **Phase 5 `[OPTIONAL]`:** Beat Pattern Library. Achievement/Badge.
6. **Phase 6 `[OPTIONAL, polish]`:** Splash Screen, detailed key animations (shadow, scale, glowing outline), extra audio effects.
7. **Final `[REQUIRED]`:** Full responsive testing, check for console errors, write README.md, deploy to Vercel.

If time runs short during Phases 4–6, the recommended cut order (safest to cut first, going down the list) is: Splash Screen → Achievement/Badge → Beat Pattern Library → Practice Mode → Drum Kit. **Phases 1–3 and the Final phase must not be cut.**

---

## 12. Progress Status
*(update this section after each phase is completed)*

- [ ] Phase 1 — Setup, Sidebar/Layout, Routing, Recording CRUD
- [ ] Phase 2 — Piano, Metronome, Launchpad
- [ ] Phase 3 — Dashboard, basic responsiveness
- [ ] Phase 4 — Drum Kit, Practice Mode, orientation handling
- [ ] Phase 5 — Beat Pattern Library, Achievement
- [ ] Phase 6 — Splash Screen, visual polish
- [ ] Final — Testing, README, Deploy

---

## 13. Rubric Compliance Checklist

- [ ] ES6: `let`/`const`, arrow functions, template literals, destructuring, spread operator, rest parameter used in at least 1 function
- [ ] Clean folder structure: pages, components, context, data kept separate
- [ ] Minimum components: Sidebar (replaces Navbar), Card, Form, Pagination, Layout
- [ ] Props: pass data & functions from parent to child
- [ ] Fully styled with Tailwind, responsive on mobile & desktop
- [ ] List rendering with `.map()` and a unique `key`
- [ ] Conditional rendering: empty data, search results, add/edit form, data status, confirmation messages
- [ ] Event handling: at least one each of `onClick`, `onChange`, `onSubmit`
- [ ] Full CRUD on Recording (ideally also Beat Pattern)
- [ ] Search with `.filter()` + a "not found" message
- [ ] At least 1 category/status filter
- [ ] Sorting with `.sort()`, at least 2 sort orders, compatible with search/filter
- [ ] Pagination: `Math.ceil()`, dynamic page numbers, Prev/Next buttons disabled at the edges
- [ ] Editing data: form pre-filled with existing data, updates without reload
- [ ] Context API: at least 1 Provider, `useContext`, at least 1 data-changing function via context
- [ ] React Router: `BrowserRouter`, `Routes`, `Route`, `NavLink`, `useParams()`, Not Found page
- [ ] No full page reload when navigating
- [ ] No errors in the browser console
- [ ] Deployed to Vercel, public GitHub repo

---

## 14. Out of Scope

- Backend/database, user authentication/login
- MIDI hardware input
- Multi-track mixing/complex audio effects
- Dark/light mode toggle (the app has one fixed dark visual identity)
- Forced landscape rotation via CSS transform (only responds to the device's actual physical rotation)