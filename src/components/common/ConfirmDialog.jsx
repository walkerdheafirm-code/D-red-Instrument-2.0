export function ConfirmDialog({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded border border-[#2A2828] bg-[#151417] p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-[#EDE9E6]">{title}</h3>
        <p className="mt-2 text-sm text-[#7A7570]">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-4 py-2 text-sm text-[#EDE9E6]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 text-sm font-medium text-white"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
