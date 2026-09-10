export function Toast({ message, isOpen, onClose, type = 'info' }) {
  if (!isOpen || !message) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded border border-[#C81E3A] bg-[#151417] px-4 py-3 text-sm text-[#EDE9E6] shadow-2xl animate-fade-in">
      <span className="text-[#C81E3A] font-bold">✓</span>
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-[#7A7570] hover:text-[#EDE9E6]"
        >
          ✕
        </button>
      )}
    </div>
  )
}
