import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { playNavClickSound } from '../../utils/uiSound'
import { Sidebar } from './Sidebar'

export function PageLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    'dred-sidebar-collapsed',
    false,
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDE9E6] overflow-x-hidden">
      <div className="flex min-h-screen">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
          <div
            className={[
              'mx-auto max-w-7xl p-4 md:p-6 transition-all duration-300',
              isSidebarCollapsed ? 'lg:pl-16' : '',
            ].join(' ')}
          >
            {/* Mobile Top Bar */}
            <div className="mb-4 flex items-center justify-between border-b border-[#2A2828] pb-4 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  playNavClickSound()
                  setMobileOpen(true)
                }}
                aria-label="Buka Menu"
                className="flex items-center gap-2 rounded border border-[#2A2828] bg-[#151417] px-3 py-2 text-sm text-[#EDE9E6] transition hover:border-[#C81E3A] cursor-pointer"
              >
                <span className="text-[#C81E3A]">☰</span>
                <span className="font-medium">Menu</span>
              </button>

              {/* Brand logo — center */}
              <span className="font-['Bebas_Neue'] text-xl tracking-wider text-[#C81E3A] leading-none">
                D'red Instrument
              </span>

              {/* Spacer so logo stays centered */}
              <div className="w-[72px]" aria-hidden="true" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
