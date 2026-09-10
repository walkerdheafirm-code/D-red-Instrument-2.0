import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/', icon: '◉' },
  { label: 'Piano', path: '/piano', icon: '♪' },
  { label: 'Launchpad', path: '/launchpad', icon: '▣' },
  { label: 'Drum Kit', path: '/drumkit', icon: '◫' },
  { label: 'Rekaman', path: '/recordings', icon: '◌' },
  { label: 'Practice', path: '/practice', icon: '✓' },
  { label: 'Beat Pattern', path: '/beat-patterns', icon: '▤' },
  { label: 'Achievements', path: '/achievements', icon: '★' },
]

export function Sidebar({ isCollapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Sidebar Panel with smooth slide animation */}
      <aside
        id="app-sidebar"
        className={[
          'fixed inset-y-0 left-0 z-40 w-64 min-w-[16rem] border-r border-[#2A2828] bg-[#151417] text-[#EDE9E6]',
          'transition-all duration-300 ease-in-out',
          'lg:static lg:z-auto',
          // Mobile: drawer slide in/out
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: slide off-screen smoothly via negative margin
          isCollapsed
            ? 'lg:-ml-64 lg:translate-x-0 lg:pointer-events-none lg:opacity-0'
            : 'lg:ml-0 lg:translate-x-0 lg:pointer-events-auto lg:opacity-100',
        ].join(' ')}
      >
        <div className="flex h-full w-64 flex-col overflow-hidden">
          {/* Header Box (Dedicated exclusively for D'red Instrument logo mark per user request) */}
          <div className="shrink-0 border-b border-[#2A2828] px-5 py-5 text-left">
            <div className="font-['Bebas_Neue'] text-3xl tracking-wider text-[#C81E3A] leading-none">
              D'red Instrument
            </div>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#7A7570] uppercase">
              Virtual Audio Studio
            </p>
          </div>

          {/* Sub-bar: Separate row containing navigation title & three-line collapse button (☰) */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#2A2828] bg-[#0A0A0B]/40 px-4 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A7570]">
              Menu Navigasi
            </span>

            {/* Three-line toggle button */}
            <button
              type="button"
              onClick={() => {
                onToggleCollapse()
                onCloseMobile()
              }}
              title="Sembunyikan Sidebar"
              aria-label="Sembunyikan Sidebar"
              className="flex h-7 w-7 items-center justify-center rounded border border-[#2A2828] bg-[#151417] text-sm text-[#EDE9E6] transition hover:border-[#C81E3A] hover:text-[#C81E3A] active:scale-95"
            >
              <span className="leading-none text-sm">☰</span>
            </button>
          </div>

          {/* Navigation Links — scrollable so all items are reachable in landscape */}
          <nav className="flex-1 overflow-y-auto space-y-2 px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-r border-y border-r px-3 py-3 text-sm transition',
                    isActive
                      ? 'border-l-4 border-l-[#C81E3A] border-y-[#C81E3A]/40 border-r-[#C81E3A]/40 bg-[#6B1420]/30 text-[#EDE9E6] font-medium'
                      : 'border-transparent text-[#7A7570] hover:border-[#2A2828] hover:bg-[#1C1B1E] hover:text-[#EDE9E6]',
                  ].join(' ')
                }
              >
                <span className="text-base text-[#C81E3A]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Floating Reopen Icon Button on Desktop when Collapsed (matching ☰ symbol) */}
      {isCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Buka Sidebar"
          aria-label="Buka Sidebar"
          className="fixed left-4 top-4 z-50 hidden h-10 w-10 items-center justify-center rounded border border-[#2A2828] bg-[#151417]/90 text-lg text-[#EDE9E6] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-xs transition-all duration-200 hover:border-[#C81E3A] hover:text-[#C81E3A] hover:scale-105 active:scale-95 lg:flex"
        >
          <span className="leading-none text-base">☰</span>
        </button>
      )}
    </>
  )
}
