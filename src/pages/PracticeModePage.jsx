import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DrumKit } from '../components/instruments/DrumKit'
import { Piano } from '../components/instruments/Piano'
import { OrientationPrompt } from '../components/layout/OrientationPrompt'
import { PracticeChallengeCard } from '../components/practice/PracticeChallengeCard'
import { PracticeResult } from '../components/practice/PracticeResult'
import { usePracticeContext } from '../context/PracticeContext'
import {
  PRACTICE_DRUM_PADS,
  PRACTICE_PIANO_NOTES,
  practiceChallenges,
} from '../data/practiceChallenges'
import { useAudioEngine } from '../hooks/useAudioEngine'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEQUENCE_BASE_LENGTH = 3

function getRandomMelodySequence(roundNum) {
  const seqLen = SEQUENCE_BASE_LENGTH + (roundNum - 1)
  return Array.from({ length: seqLen }, () =>
    PRACTICE_PIANO_NOTES[Math.floor(Math.random() * PRACTICE_PIANO_NOTES.length)]
  )
}

function getRandomDrumSequence(roundNum) {
  const seqLen = SEQUENCE_BASE_LENGTH + (roundNum - 1)
  return Array.from({ length: seqLen }, () =>
    PRACTICE_DRUM_PADS[Math.floor(Math.random() * PRACTICE_DRUM_PADS.length)]
  )
}

// ─── Follow the Melody (Piano) ──────────────────────────────────────────────

function FollowMelodySession({ onComplete, playPianoNote }) {
  const TOTAL_ROUNDS = 5
  const [round, setRound] = useState(1)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [phase, setPhase] = useState('watching') // 'watching' | 'repeating'
  const [isStarted, setIsStarted] = useState(false)
  const [targetSequence, setTargetSequence] = useState(() => getRandomMelodySequence(1))
  const [userSequence, setUserSequence] = useState([])
  const [highlightedNote, setHighlightedNote] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [locked, setLocked] = useState(false)
  const playTimeoutRef = useRef(null)

  const playSequence = useCallback((sequence) => {
    setPhase('watching')
    setLocked(true)
    let i = 0

    const step = () => {
      if (i >= sequence.length) {
        setTimeout(() => {
          setHighlightedNote(null)
          setPhase('repeating')
          setLocked(false)
        }, 400)
        return
      }

      const note = sequence[i]
      setHighlightedNote(note)
      playPianoNote(note)
      i++

      playTimeoutRef.current = setTimeout(() => {
        setHighlightedNote(null)
        setTimeout(step, 200)
      }, 500)
    }

    step()
  }, [playPianoNote])

  // Cleanup timeout on unmount (tidak auto-play saat mount agar user siap)
  useEffect(() => {
    return () => {
      clearTimeout(playTimeoutRef.current)
    }
  }, [])

  const handleStartChallenge = () => {
    setIsStarted(true)
    setLocked(true)
    setTimeout(() => {
      playSequence(targetSequence)
    }, 400)
  }

  const startRound = (nextRoundNum) => {
    const nextSeq = getRandomMelodySequence(nextRoundNum)
    setRound(nextRoundNum)
    setTargetSequence(nextSeq)
    setUserSequence([])
    setFeedback(null)
    setTimeout(() => playSequence(nextSeq), 600)
  }

  const handleNotePress = (note) => {
    if (phase !== 'repeating' || locked) return

    // Immediately play the piano note audio
    playPianoNote(note)

    const nextUserSeq = [...userSequence, note]
    setUserSequence(nextUserSeq)

    // Check note-by-note
    const idx = nextUserSeq.length - 1
    if (nextUserSeq[idx] !== targetSequence[idx]) {
      // Wrong note
      setFeedback('wrong')
      setLocked(true)
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          onComplete({ correctRounds, totalRounds: TOTAL_ROUNDS })
        } else {
          startRound(round + 1)
        }
      }, 1200)
      return
    }

    if (nextUserSeq.length === targetSequence.length) {
      // Full correct melody
      const newCorrect = correctRounds + 1
      setCorrectRounds(newCorrect)
      setFeedback('correct')
      setLocked(true)
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          onComplete({ correctRounds: newCorrect, totalRounds: TOTAL_ROUNDS })
        } else {
          startRound(round + 1)
        }
      }, 1000)
    }
  }

  const handleReplayMelody = () => {
    if (phase !== 'repeating' || locked) return
    setUserSequence([])
    setFeedback(null)
    playSequence(targetSequence)
  }

  return (
    <div className="space-y-4">
      {/* Round / Status Bar */}
      <div className="rounded border border-[#2A2828] bg-[#151417] px-4 py-3">
        {/* Top row: Ronde + Benar */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#7A7570]">
            Ronde <span className="font-mono font-bold text-[#EDE9E6]">{round}</span> / {TOTAL_ROUNDS}
          </div>
          <div className="text-sm text-[#7A7570]">
            Benar: <span className="font-mono font-bold text-[#C81E3A]">{correctRounds}</span>
          </div>
        </div>
        {/* Bottom row: Target + Putar Ulang */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-[#7A7570]">
            Target: {targetSequence.length} nada
          </span>
          <button
            type="button"
            disabled={!isStarted || phase !== 'repeating' || locked}
            onClick={handleReplayMelody}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1 text-xs text-[#7A7570] transition hover:border-[#C81E3A] hover:text-[#EDE9E6] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ▶ Putar Ulang Melodi
          </button>
        </div>
      </div>

      {!isStarted ? (
        /* Tombol Mulai Tantangan - ditempatkan tepat di atas instrumen */
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-[#C81E3A]/50 bg-gradient-to-r from-[#1C1113] via-[#2A1317] to-[#1C1113] p-4 shadow-[0_0_24px_rgba(200,30,58,0.2)] sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#C81E3A]" />
              <h3 className="font-['Bebas_Neue'] text-2xl tracking-wider text-[#EDE9E6]">
                Siap Memulai Tantangan?
              </h3>
            </div>
            <p className="text-xs text-[#A8A29E]">
              Perhatikan tuts piano yang menyala dan dengarkan melodinya, lalu ulangi nada yang sama secara berurutan.
            </p>
          </div>

          <button
            type="button"
            id="btn-start-melody"
            onClick={handleStartChallenge}
            style={{ touchAction: 'manipulation' }}
            className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C81E3A] px-8 py-3 font-['Bebas_Neue'] text-xl tracking-wider text-white shadow-[0_0_20px_rgba(200,30,58,0.5)] transition hover:bg-[#A0182E] active:scale-95 sm:w-auto"
          >
            ▶ Mulai Tantangan
          </button>
        </div>
      ) : (
        <>
          {/* Phase Indicator */}
          <div
            className={[
              'rounded border px-4 py-2 text-center text-sm font-medium transition-colors',
              phase === 'watching'
                ? 'border-[#C81E3A]/40 bg-[#6B1420]/30 text-[#EDE9E6] shadow-[0_0_12px_rgba(200,30,58,0.2)]'
                : 'border-[#2A2828] bg-[#0A0A0B] text-[#EDE9E6]',
            ].join(' ')}
          >
            {phase === 'watching'
              ? '👀 Perhatikan tuts piano yang menyala merah dan dengarkan melodinya...'
              : '🎹 Sekarang giliranmu! Ulangi urutan melodi tersebut pada tuts piano.'}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={[
                'rounded border px-4 py-2 text-center text-sm font-medium transition-all',
                feedback === 'correct'
                  ? 'border-green-700/50 bg-green-950/30 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                  : 'border-red-700/50 bg-red-950/30 text-red-400 shadow-[0_0_12px_rgba(200,30,58,0.2)]',
              ].join(' ')}
            >
              {feedback === 'correct'
                ? '✓ Melodi tepat! +1'
                : '✗ Urutan keliru! Melanjutkan ke ronde berikutnya...'}
            </div>
          )}

          {/* User progress indicator dots */}
          {phase === 'repeating' && (
            <div className="flex gap-1.5 py-1">
              {targetSequence.map((_, idx) => (
                <div
                  key={idx}
                  className={[
                    'h-2 flex-1 rounded-full transition-colors',
                    idx < userSequence.length ? 'bg-[#C81E3A]' : 'bg-[#2A2828]',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Piano Component */}
      <Piano
        onPlayNote={handleNotePress}
        targetNote={highlightedNote}
        disabled={!isStarted || phase === 'watching' || locked}
      />
    </div>
  )
}

// ─── Follow the Rhythm (Drum Kit) ───────────────────────────────────────────

function FollowRhythmSession({ onComplete, playDrumPad }) {
  const TOTAL_ROUNDS = 5
  const [round, setRound] = useState(1)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [phase, setPhase] = useState('watching') // 'watching' | 'repeating'
  const [isStarted, setIsStarted] = useState(false)
  const [targetSequence, setTargetSequence] = useState(() => getRandomDrumSequence(1))
  const [userSequence, setUserSequence] = useState([])
  const [highlightedPad, setHighlightedPad] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [locked, setLocked] = useState(false)
  const playTimeoutRef = useRef(null)

  const playSequence = useCallback((sequence) => {
    setPhase('watching')
    setLocked(true)
    let i = 0

    const step = () => {
      if (i >= sequence.length) {
        setTimeout(() => {
          setHighlightedPad(null)
          setPhase('repeating')
          setLocked(false)
        }, 400)
        return
      }

      const padId = sequence[i]
      setHighlightedPad(padId)
      playDrumPad(padId)
      i++

      playTimeoutRef.current = setTimeout(() => {
        setHighlightedPad(null)
        setTimeout(step, 200)
      }, 500)
    }

    step()
  }, [playDrumPad])

  // Cleanup timeout on unmount (tidak auto-play saat mount agar user siap)
  useEffect(() => {
    return () => {
      clearTimeout(playTimeoutRef.current)
    }
  }, [])

  const handleStartChallenge = () => {
    setIsStarted(true)
    setLocked(true)
    setTimeout(() => {
      playSequence(targetSequence)
    }, 400)
  }

  const startRound = (nextRoundNum) => {
    const nextSeq = getRandomDrumSequence(nextRoundNum)
    setRound(nextRoundNum)
    setTargetSequence(nextSeq)
    setUserSequence([])
    setFeedback(null)
    setTimeout(() => playSequence(nextSeq), 600)
  }

  const handlePadPress = (padId) => {
    if (phase !== 'repeating' || locked) return

    // Immediately play the drum sound
    playDrumPad(padId)

    const nextUserSeq = [...userSequence, padId]
    setUserSequence(nextUserSeq)

    // Check step-by-step
    const idx = nextUserSeq.length - 1
    if (nextUserSeq[idx] !== targetSequence[idx]) {
      // Wrong
      setFeedback('wrong')
      setLocked(true)
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          onComplete({ correctRounds, totalRounds: TOTAL_ROUNDS })
        } else {
          startRound(round + 1)
        }
      }, 1200)
      return
    }

    if (nextUserSeq.length === targetSequence.length) {
      // Full correct sequence
      const newCorrect = correctRounds + 1
      setCorrectRounds(newCorrect)
      setFeedback('correct')
      setLocked(true)
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          onComplete({ correctRounds, totalRounds: TOTAL_ROUNDS })
        } else {
          startRound(round + 1)
        }
      }, 1000)
    }
  }

  const handleReplayRhythm = () => {
    if (phase !== 'repeating' || locked) return
    setUserSequence([])
    setFeedback(null)
    playSequence(targetSequence)
  }

  return (
    <div className="space-y-4">
      {/* Round / Status Bar */}
      <div className="rounded border border-[#2A2828] bg-[#151417] px-4 py-3">
        {/* Top row: Ronde + Benar */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#7A7570]">
            Ronde <span className="font-mono font-bold text-[#EDE9E6]">{round}</span> / {TOTAL_ROUNDS}
          </div>
          <div className="text-sm text-[#7A7570]">
            Benar: <span className="font-mono font-bold text-[#C81E3A]">{correctRounds}</span>
          </div>
        </div>
        {/* Bottom row: Target + Putar Ulang */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-[#7A7570]">
            Target: {targetSequence.length} pukulan
          </span>
          <button
            type="button"
            disabled={!isStarted || phase !== 'repeating' || locked}
            onClick={handleReplayRhythm}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1 text-xs text-[#7A7570] transition hover:border-[#C81E3A] hover:text-[#EDE9E6] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ▶ Putar Ulang Ritme
          </button>
        </div>
      </div>

      {!isStarted ? (
        /* Tombol Mulai Tantangan - ditempatkan tepat di atas instrumen */
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-[#C81E3A]/50 bg-gradient-to-r from-[#1C1113] via-[#2A1317] to-[#1C1113] p-4 shadow-[0_0_24px_rgba(200,30,58,0.2)] sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#C81E3A]" />
              <h3 className="font-['Bebas_Neue'] text-2xl tracking-wider text-[#EDE9E6]">
                Siap Memulai Tantangan?
              </h3>
            </div>
            <p className="text-xs text-[#A8A29E]">
              Perhatikan pad drum yang menyala dan dengarkan ketukannya, lalu ulangi urutan ritmenya.
            </p>
          </div>

          <button
            type="button"
            id="btn-start-rhythm"
            onClick={handleStartChallenge}
            style={{ touchAction: 'manipulation' }}
            className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C81E3A] px-8 py-3 font-['Bebas_Neue'] text-xl tracking-wider text-white shadow-[0_0_20px_rgba(200,30,58,0.5)] transition hover:bg-[#A0182E] active:scale-95 sm:w-auto"
          >
            ▶ Mulai Tantangan
          </button>
        </div>
      ) : (
        <>
          {/* Phase Indicator */}
          <div
            className={[
              'rounded border px-4 py-2 text-center text-sm font-medium transition-colors',
              phase === 'watching'
                ? 'border-[#C81E3A]/40 bg-[#6B1420]/30 text-[#EDE9E6] shadow-[0_0_12px_rgba(200,30,58,0.2)]'
                : 'border-[#2A2828] bg-[#0A0A0B] text-[#EDE9E6]',
            ].join(' ')}
          >
            {phase === 'watching'
              ? '👀 Perhatikan pad yang menyala merah dan bunyinya...'
              : '🥁 Sekarang giliranmu! Ulangi urutan ketukan tersebut.'}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={[
                'rounded border px-4 py-2 text-center text-sm font-medium transition-all',
                feedback === 'correct'
                  ? 'border-green-700/50 bg-green-950/30 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                  : 'border-red-700/50 bg-red-950/30 text-red-400 shadow-[0_0_12px_rgba(200,30,58,0.2)]',
              ].join(' ')}
            >
              {feedback === 'correct'
                ? '✓ Urutan benar! +1'
                : '✗ Urutan salah! Melanjutkan ke ronde berikutnya...'}
            </div>
          )}

          {/* User progress indicator dots */}
          {phase === 'repeating' && (
            <div className="flex gap-1.5 py-1">
              {targetSequence.map((_, idx) => (
                <div
                  key={idx}
                  className={[
                    'h-2 flex-1 rounded-full transition-colors',
                    idx < userSequence.length ? 'bg-[#C81E3A]' : 'bg-[#2A2828]',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* DrumKit */}
      <DrumKit
        onPlayPad={handlePadPress}
        externalHighlight={highlightedPad}
        disabled={!isStarted || phase === 'watching' || locked}
      />
    </div>
  )
}

// ─── Main PracticeModePage ───────────────────────────────────────────────────

export function PracticeModePage() {
  const { challengeId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { addPracticeScore, scores } = usePracticeContext()
  const { playPianoNote, playDrumPad } = useAudioEngine()

  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [sessionResult, setSessionResult] = useState(null)
  const [sessionCount, setSessionCount] = useState(0)

  // Helper untuk mencocokkan endpoint URL / param ke objek tantangan yang benar
  const resolveChallenge = useCallback((idOrSlug) => {
    if (!idOrSlug) return null
    const normalized = idOrSlug.toLowerCase()
    if (
      normalized === 'follow-rhythm' ||
      normalized === 'rhythm' ||
      normalized === 'ikuti-ritme' ||
      normalized === 'ritme'
    ) {
      return practiceChallenges.find((c) => c.id === 'follow-rhythm')
    }
    if (
      normalized === 'follow-melody' ||
      normalized === 'melody' ||
      normalized === 'ikuti-melodi' ||
      normalized === 'melodi' ||
      normalized === 'guess-note'
    ) {
      return practiceChallenges.find((c) => c.id === 'follow-melody')
    }
    return practiceChallenges.find((c) => c.id === idOrSlug) || null
  }, [])

  // Sinkronisasi otomatis saat endpoint URL berubah atau dibuka langsung
  useEffect(() => {
    const rawId = challengeId || searchParams.get('challenge')
    if (rawId) {
      const found = resolveChallenge(rawId)
      if (found) {
        setSelectedChallenge((prev) => (prev?.id === found.id ? prev : found))
        setSessionResult(null)
      }
    } else {
      setSelectedChallenge((prev) => (prev ? null : prev))
      setSessionResult(null)
    }
  }, [challengeId, searchParams, resolveChallenge])

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge)
    setSessionResult(null)
    setSessionCount((c) => c + 1)
    navigate(`/practice/${challenge.id}`)
  }

  const handleSessionComplete = ({ correctRounds, totalRounds }) => {
    const score = Math.round((correctRounds / totalRounds) * 100)
    const result = {
      challengeId: selectedChallenge.id,
      instrument: selectedChallenge.instrument,
      challengeTitle: selectedChallenge.title,
      score,
      correctRounds,
      totalRounds,
    }
    addPracticeScore(result)
    setSessionResult(result)
  }

  const handleRetry = () => {
    setSessionResult(null)
    setSessionCount((c) => c + 1)
  }

  const handleExit = () => {
    setSelectedChallenge(null)
    setSessionResult(null)
    navigate('/practice')
  }

  // Best scores for display
  const bestScores = practiceChallenges.map((ch) => {
    const chScores = scores.filter(
      (s) =>
        s.challengeId === ch.id ||
        (ch.id === 'follow-melody' && s.challengeId === 'guess-note')
    )
    const best = chScores.reduce((max, s) => (s.score > max ? s.score : max), 0)
    return { id: ch.id, best, count: chScores.length }
  })

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Latihan</p>
        <h1 className="mt-2 font-['Bebas_Neue'] text-5xl leading-none text-[#C81E3A]">
          Practice Mode
        </h1>
      </header>

      {/* Orientation hint on mobile portrait when challenge is active */}
      {selectedChallenge && !sessionResult && <OrientationPrompt />}

      {/* ── Result Screen ── */}
      {sessionResult && (
        <PracticeResult
          result={sessionResult}
          onRetry={handleRetry}
          onExit={handleExit}
        />
      )}

      {/* ── Active Session ── */}
      {!sessionResult && selectedChallenge && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Bebas_Neue'] text-3xl text-[#EDE9E6]">
              {selectedChallenge.emoji} {selectedChallenge.title}
            </h2>
            <button
              type="button"
              onClick={handleExit}
              className="rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-1 text-sm text-[#7A7570] transition hover:border-[#C81E3A] hover:text-[#EDE9E6]"
            >
              ← Keluar
            </button>
          </div>

          {(selectedChallenge.id === 'follow-melody' ||
            selectedChallenge.id === 'guess-note') && (
            <FollowMelodySession
              key={`melody-${sessionCount}`}
              onComplete={handleSessionComplete}
              playPianoNote={playPianoNote}
            />
          )}

          {selectedChallenge.id === 'follow-rhythm' && (
            <FollowRhythmSession
              key={`rhythm-${sessionCount}`}
              onComplete={handleSessionComplete}
              playDrumPad={playDrumPad}
            />
          )}
        </section>
      )}

      {/* ── Challenge Selection ── */}
      {!selectedChallenge && !sessionResult && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {practiceChallenges.map((ch) => {
              const stat = bestScores.find((b) => b.id === ch.id)
              return (
                <div key={ch.id} className="space-y-2">
                  <PracticeChallengeCard
                    challenge={ch}
                    onSelect={handleChallengeSelect}
                  />
                  {stat && stat.count > 0 && (
                    <p className="text-xs text-[#4A4844]">
                      Dimainkan {stat.count}× · Skor terbaik:{' '}
                      <span className="font-mono text-[#EDE9E6]">{stat.best}%</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Score History */}
          {scores.length > 0 && (
            <section className="rounded border border-[#2A2828] bg-[#151417] p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#7A7570]">
                Riwayat Skor Terakhir
              </h2>
              <ul className="space-y-2">
                {scores.slice(0, 5).map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded border border-[#2A2828] bg-[#0A0A0B] px-4 py-2 text-sm"
                  >
                    <div>
                      <span className="text-[#EDE9E6]">
                        {s.challengeId === 'follow-melody' || s.challengeId === 'guess-note'
                          ? '🎹 Ikuti Melodi'
                          : '🥁 Ikuti Ritme'}
                      </span>
                      <span className="ml-2 text-xs text-[#4A4844]">
                        {new Date(s.playedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span
                      className={[
                        'font-mono font-bold',
                        s.score === 100 ? 'text-[#C81E3A]' : 'text-[#EDE9E6]',
                      ].join(' ')}
                    >
                      {s.score}%
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
