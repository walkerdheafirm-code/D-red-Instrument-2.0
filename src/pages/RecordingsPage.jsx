import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { FilterDropdown } from '../components/common/FilterDropdown'
import { Pagination } from '../components/common/Pagination'
import { SearchBar } from '../components/common/SearchBar'
import { SortDropdown } from '../components/common/SortDropdown'
import { RecordingCard } from '../components/recordings/RecordingCard'
import { useRecordingContext } from '../context/RecordingContext'
import { sortRecordings } from '../utils/sortHelpers'

const PAGE_SIZE = 4

export function RecordingsPage() {
  const { recordings } = useRecordingContext()
  const [search, setSearch] = useState('')
  const [instrumentFilter, setInstrumentFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, instrumentFilter, categoryFilter, sortBy])

  const filteredRecordings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filtered = recordings.filter((recording) => {
      const matchesSearch =
        normalizedSearch.length === 0 || recording.title.toLowerCase().includes(normalizedSearch)
      const matchesInstrument =
        !instrumentFilter || recording.instrument === instrumentFilter
      const matchesCategory = !categoryFilter || recording.category === categoryFilter

      return matchesSearch && matchesInstrument && matchesCategory
    })

    return sortRecordings(filtered, sortBy)
  }, [categoryFilter, instrumentFilter, recordings, search, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredRecordings.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const paginatedRecordings = filteredRecordings.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">Collection</p>
        <h1 className="mt-2 font-['Bebas_Neue'] text-5xl text-[#C81E3A]">Recordings</h1>
        <p className="mt-1 text-xs text-[#7A7570]">
          Rekaman ditambahkan otomatis saat kamu merekam permainan di halaman instrumen.
        </p>
      </header>

      <section className="rounded border border-[#2A2828] bg-[#151417] p-4">
        {/* Search — full width */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filters row — 2 columns on mobile, 4 on md+ */}
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <FilterDropdown
            label="Instrument"
            value={instrumentFilter}
            onChange={setInstrumentFilter}
            options={[
              { value: 'piano', label: 'Piano' },
              { value: 'launchpad', label: 'Launchpad' },
              { value: 'drumkit', label: 'Drum Kit' },
            ]}
          />
          <FilterDropdown
            label="Kategori"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: 'latihan', label: 'latihan' },
              { value: 'cover', label: 'cover' },
              { value: 'eksperimen', label: 'eksperimen' },
              { value: 'lainnya', label: 'lainnya' },
            ]}
          />
          {/* Sort — spans full row on mobile, single cell on md+ */}
          <div className="col-span-2 md:col-span-2">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </section>

      <section>
        {paginatedRecordings.length === 0 ? (
          <EmptyState
            title="Tidak ada rekaman"
            description="Coba ubah kata kunci atau filter untuk melihat hasil lain."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedRecordings.map((recording) => (
              <RecordingCard key={recording.id} recording={recording} />
            ))}
          </div>
        )}
      </section>

      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredRecordings.length}
        pageSize={PAGE_SIZE}
      />

      <div className="text-right">
        <Link to="/" className="text-sm text-[#C81E3A] hover:text-[#EDE9E6]">
          Kembali ke dashboard
        </Link>
      </div>
    </div>
  )
}
