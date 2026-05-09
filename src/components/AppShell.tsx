import type { ReactNode } from 'react'
import { useApp } from '../store/AppContext'

interface Props {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  const { route, goHome } = useApp()
  const isCanvas = route.view === 'canvas'

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg-base)' }}>
      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Bottom nav (mobile-first) — hidden in canvas mode */}
      {!isCanvas && (
        <nav
          className="flex items-center justify-around sm:hidden px-4 pb-safe"
          style={{
            background: 'var(--color-bg-surface)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '8px',
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          }}
        >
          <NavButton
            active={route.view === 'dashboard'}
            onClick={goHome}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
            label="Dashboard"
          />
          <NavButton
            active={false}
            onClick={() => {}}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                <line x1="10" y1="6" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="13" r="0.75" fill="currentColor" />
              </svg>
            }
            label="About"
            comingSoon
          />
          <NavButton
            active={false}
            onClick={() => {}}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            label="Profile"
            comingSoon
          />
        </nav>
      )}

      {/* Sidebar (desktop) */}
      {!isCanvas && (
        <aside
          className="hidden sm:flex fixed left-0 top-0 bottom-0 flex-col gap-1 py-4 px-2 w-14"
          style={{
            background: 'var(--color-bg-surface)',
            borderRight: '1px solid var(--color-border)',
            zIndex: 5,
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-primary-dim)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="#38bdf8" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="#38bdf8" opacity="0.6" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="#38bdf8" opacity="0.6" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="#38bdf8" opacity="0.3" />
              </svg>
            </div>
          </div>

          <SidebarIcon
            active={route.view === 'dashboard'}
            onClick={goHome}
            title="Dashboard"
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          />
          <SidebarIcon
            active={false}
            onClick={() => {}}
            title="Settings (coming soon)"
            disabled
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.41 1.41M14.37 14.37l1.41 1.41M4.22 15.78l1.41-1.41M14.37 5.63l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        </aside>
      )}

      {/* Offset for sidebar on desktop */}
      {!isCanvas && (
        <style>{`@media(min-width:640px){main{margin-left:56px}}`}</style>
      )}
    </div>
  )
}

function NavButton({
  active, onClick, icon, label, comingSoon,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
  comingSoon?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-150"
      style={{ color: active ? 'var(--color-primary-400)' : 'var(--color-text-muted)' }}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
      {comingSoon && (
        <span
          className="absolute -top-1 -right-1 text-[8px] px-1 rounded"
          style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
        >
          soon
        </span>
      )}
    </button>
  )
}

function SidebarIcon({
  active, onClick, icon, title, disabled,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  title: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-9 h-9 rounded-lg mx-auto transition-all duration-150 disabled:opacity-30"
      style={{
        background: active ? 'var(--color-primary-dim)' : 'transparent',
        color: active ? 'var(--color-primary-400)' : 'var(--color-text-muted)',
      }}
    >
      {icon}
    </button>
  )
}

