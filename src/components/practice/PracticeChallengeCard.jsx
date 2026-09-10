export function PracticeChallengeCard({ challenge, onSelect }) {
  return (
    <button
      type="button"
      id={`challenge-card-${challenge.id}`}
      onClick={() => onSelect(challenge)}
      className="group flex w-full flex-col gap-3 rounded border border-[#2A2828] bg-[#151417] p-6 text-left transition hover:border-[#C81E3A] hover:shadow-[0_0_20px_rgba(200,30,58,0.2)]"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{challenge.emoji}</span>
        <div>
          <h3 className="font-['Bebas_Neue'] text-2xl text-[#EDE9E6] group-hover:text-[#C81E3A]">
            {challenge.title}
          </h3>
          <p className="text-xs uppercase tracking-wider text-[#7A7570]">
            {challenge.instrument === 'piano' ? 'Piano' : 'Drum Kit'} · {challenge.rounds} Ronde
          </p>
        </div>
      </div>
      <p className="text-sm text-[#7A7570]">{challenge.description}</p>
      <span className="mt-auto self-start rounded border border-[#C81E3A]/40 bg-[#6B1420]/20 px-3 py-1 text-xs font-medium text-[#C81E3A] transition group-hover:bg-[#C81E3A] group-hover:text-white">
        Mulai Tantangan →
      </span>
    </button>
  )
}
