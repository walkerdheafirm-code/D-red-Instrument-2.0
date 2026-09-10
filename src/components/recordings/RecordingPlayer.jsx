export function RecordingPlayer({ audioData, title }) {
  const handleDownload = () => {
    if (!audioData) return

    const link = document.createElement('a')
    link.href = audioData
    const sanitizedTitle = (title || 'recording').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
    link.download = `${sanitizedTitle}.webm`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!audioData) {
    return (
      <div className="flex flex-col items-center justify-center rounded border border-dashed border-[#2A2828] bg-[#0A0A0B] p-8 text-center">
        <span className="text-3xl text-[#7A7570]">♪</span>
        <p className="mt-2 text-sm text-[#7A7570]">
          Audio preview belum tersedia untuk rekaman ini.
        </p>
        <p className="mt-1 text-xs text-[#7A7570]/70">
          Mainkan instrumen (Piano, Launchpad, Drum Kit) untuk merekam audio asli.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded border border-[#2A2828] bg-[#0A0A0B] p-4">
      <audio controls src={audioData} className="w-full accent-[#C81E3A]" />
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded border border-[#C81E3A] bg-[#6B1420]/30 px-3 py-1.5 text-xs font-medium text-[#EDE9E6] transition hover:bg-[#C81E3A] hover:text-white"
        >
          <span>↓</span> Download Audio
        </button>
      </div>
    </div>
  )
}
