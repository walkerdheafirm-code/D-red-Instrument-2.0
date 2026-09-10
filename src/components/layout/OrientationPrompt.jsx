import { useOrientation } from '../../hooks/useOrientation'

/**
 * Non-blocking banner shown on mobile in portrait mode
 * suggesting the user rotate to landscape for a better experience.
 * Hidden automatically when the screen is wide enough (md breakpoint).
 */
export function OrientationPrompt({ message, className = '' }) {
  const { isLandscape } = useOrientation()

  // Only show on narrow screens in portrait
  if (isLandscape) return null

  return (
    <div className={`flex items-center gap-3 rounded border border-[#2A2828] bg-[#151417] px-4 py-3 text-sm text-[#7A7570] md:hidden ${className}`}>
      <span className="text-lg leading-none">📱</span>
      <p>
        {message || (
          <>
            Putar layar ke{' '}
            <strong className="text-[#EDE9E6]">landscape</strong> untuk tampilan instrumen yang lebih nyaman.
          </>
        )}
      </p>
    </div>
  )
}
