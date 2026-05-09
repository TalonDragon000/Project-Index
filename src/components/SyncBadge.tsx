import type { SyncState } from '../types'

interface Props {
  state: SyncState
  isSyncing?: boolean
  onClick?: () => void
  className?: string
}

const SYNC_CONFIG: Record<SyncState, { label: string; color: string; bg: string; dot: string }> = {
  synced:   { label: 'Synced',    color: '#34d399', bg: 'rgba(16,185,129,0.12)',  dot: '#34d399' },
  ahead:    { label: 'Ahead',     color: '#38bdf8', bg: 'rgba(14,165,233,0.12)',  dot: '#38bdf8' },
  behind:   { label: 'Behind',    color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  dot: '#fbbf24' },
  conflict: { label: 'Conflict',  color: '#f87171', bg: 'rgba(239,68,68,0.12)',   dot: '#f87171' },
}

export function SyncBadge({ state, isSyncing, onClick, className = '' }: Props) {
  const cfg = SYNC_CONFIG[state]

  return (
    <button
      onClick={onClick}
      disabled={isSyncing}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
    >
      {isSyncing ? (
        <span
          className="w-2 h-2 rounded-full border-2 border-current border-t-transparent animate-spin"
          style={{ display: 'inline-block' }}
        />
      ) : (
        <span
          className="w-2 h-2 rounded-full animate-pulse-dot"
          style={{ background: cfg.dot, flexShrink: 0 }}
        />
      )}
      {isSyncing ? 'Syncing…' : cfg.label}
    </button>
  )
}
