import { useEffect, useState } from 'react'

const initialForm = {
  title: '',
  instrument: 'piano',
  category: 'latihan',
  tempo: 90,
  duration: 30,
  isFavorite: false,
  audioData: '',
}

export function RecordingForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...initialForm, ...initialData })

  useEffect(() => {
    setForm({ ...initialForm, ...initialData })
  }, [initialData])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setForm((current) => ({
      ...current,
      [name]: type === 'number' ? Number(value) : nextValue,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-[#2A2828] bg-[#151417] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2 block text-sm text-[#EDE9E6]">
          <span className="mb-2 block text-[#7A7570]">Judul rekaman</span>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
          />
        </label>

        <label className="block text-sm text-[#EDE9E6]">
          <span className="mb-2 block text-[#7A7570]">Instrument</span>
          <select
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
          >
            <option value="piano">Piano</option>
            <option value="launchpad">Launchpad</option>
            <option value="drumkit">Drum Kit</option>
          </select>
        </label>

        <label className="block text-sm text-[#EDE9E6]">
          <span className="mb-2 block text-[#7A7570]">Kategori</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
          >
            <option value="latihan">latihan</option>
            <option value="cover">cover</option>
            <option value="eksperimen">eksperimen</option>
            <option value="lainnya">lainnya</option>
          </select>
        </label>

        <label className="block text-sm text-[#EDE9E6]">
          <span className="mb-2 block text-[#7A7570]">Tempo</span>
          <input
            type="number"
            name="tempo"
            min="40"
            max="240"
            value={form.tempo}
            onChange={handleChange}
            className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
          />
        </label>

        <label className="block text-sm text-[#EDE9E6]">
          <span className="mb-2 block text-[#7A7570]">Durasi (detik)</span>
          <input
            type="number"
            name="duration"
            min="1"
            max="60"
            value={form.duration}
            onChange={handleChange}
            className="w-full rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-2 text-[#EDE9E6] outline-none transition focus:border-[#C81E3A]"
          />
        </label>

        <label className="flex items-center gap-3 self-end rounded border border-[#2A2828] bg-[#0A0A0B] px-3 py-3 text-sm text-[#EDE9E6] md:col-span-2">
          <input
            type="checkbox"
            name="isFavorite"
            checked={form.isFavorite}
            onChange={handleChange}
            className="h-4 w-4 accent-[#C81E3A]"
          />
          Tandai sebagai favorit
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[#2A2828] bg-[#0A0A0B] px-4 py-2 text-sm text-[#EDE9E6]"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 text-sm font-medium text-white"
        >
          Simpan
        </button>
      </div>
    </form>
  )
}
