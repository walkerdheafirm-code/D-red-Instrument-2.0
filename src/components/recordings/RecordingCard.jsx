import { Link } from 'react-router-dom'
import { Badge } from '../common/Badge'
import { formatDate } from '../../utils/formatDate'
import { formatDuration } from '../../utils/formatDuration'

export function RecordingCard({ recording }) {
  return (
    <Link
      to={`/recordings/${recording.id}`}
      className="block rounded border border-[#2A2828] bg-[#151417] p-4 transition hover:border-[#C81E3A] hover:shadow-[0_0_0_1px_rgba(200,30,58,0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-[#EDE9E6]">{recording.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#7A7570]">
            <Badge variant="default">{recording.instrument}</Badge>
            <Badge variant="muted">{recording.category}</Badge>
          </div>
        </div>
        {recording.isFavorite && (
          <Badge variant="favorite">Favorite</Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-xs text-[#7A7570]">
        <span>{formatDate(recording.createdAt)}</span>
        <span>{formatDuration(recording.duration)}</span>
      </div>
    </Link>
  )
}
