export function PracticeResult({ result, onRetry, onExit }) {
  const { correctRounds, totalRounds, score, challengeTitle } = result
  const isPerfect = score === 100

  return (
    <div className="flex flex-col items-center gap-6 rounded border border-[#2A2828] bg-[#151417] p-8 text-center">
      {/* Score Ring */}
      <div
        className={[
          'flex h-28 w-28 flex-col items-center justify-center rounded-full border-4',
          isPerfect
            ? 'border-[#C81E3A] shadow-[0_0_30px_rgba(200,30,58,0.5)]'
            : 'border-[#2A2828]',
        ].join(' ')}
      >
        <span className="font-mono text-3xl font-bold text-[#EDE9E6]">{score}%</span>
        <span className="text-xs text-[#7A7570]">Skor</span>
      </div>

      {/* Title */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#7A7570]">{challengeTitle}</p>
        <h2 className="mt-1 font-['Bebas_Neue'] text-4xl text-[#C81E3A]">
          {isPerfect ? 'Sempurna! 🎉' : score >= 60 ? 'Bagus! 👍' : 'Terus Berlatih 💪'}
        </h2>
      </div>

      {/* Stats */}
      <div className="flex gap-8 text-center">
        <div>
          <div className="font-mono text-2xl font-bold text-[#EDE9E6]">{correctRounds}</div>
          <div className="text-xs text-[#7A7570]">Benar</div>
        </div>
        <div className="w-px bg-[#2A2828]" />
        <div>
          <div className="font-mono text-2xl font-bold text-[#EDE9E6]">{totalRounds - correctRounds}</div>
          <div className="text-xs text-[#7A7570]">Salah</div>
        </div>
        <div className="w-px bg-[#2A2828]" />
        <div>
          <div className="font-mono text-2xl font-bold text-[#EDE9E6]">{totalRounds}</div>
          <div className="text-xs text-[#7A7570]">Total Ronde</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded border border-[#C81E3A] bg-[#C81E3A] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#a6172e]"
        >
          Coba Lagi
        </button>
        <button
          type="button"
          onClick={onExit}
          className="rounded border border-[#2A2828] bg-[#0A0A0B] px-6 py-2 text-sm text-[#EDE9E6] transition hover:border-[#C81E3A]"
        >
          Pilih Tantangan Lain
        </button>
      </div>
    </div>
  )
}
