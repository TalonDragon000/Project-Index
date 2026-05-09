import { TagChip } from './TagChip'
import { SyncBadge } from './SyncBadge'
import type { ProjectFile } from '../types'

interface Props {
  file: ProjectFile
  onClick: () => void
}

const CANVAS_COLORS = ['#1e3a5f', '#1a3a2e', '#3a2a10', '#2a1a3a', '#1a2a3a']

export function FileCard({ file, onClick }: Props) {
  const colorIndex = file.id.charCodeAt(file.id.length - 1) % CANVAS_COLORS.length
  const thumbBg = CANVAS_COLORS[colorIndex]

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col text-left w-full rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] animate-fade-in"
      style={{
        background: 'var(--color-bg-surface)',
        border: file.has_conflict
          ? '1px solid rgba(239,68,68,0.4)'
          : '1px solid var(--color-border)',
        boxShadow: file.has_conflict
          ? '0 0 0 1px rgba(239,68,68,0.1), var(--shadow-sm)'
          : 'var(--shadow-sm)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-28 w-full flex items-center justify-center overflow-hidden"
        style={{ background: thumbBg }}
      >
        {/* Mock canvas lines */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 100"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 opacity-20"
        >
          <line x1="20" y1="30" x2="120" y2="30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="45" x2="90"  y2="45" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="60" x2="140" y2="60" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="75" x2="70"  y2="75" stroke="white" strokeWidth="1"   strokeLinecap="round" />
          <rect x="145" y="22" width="40" height="28" rx="3" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="165" cy="36" r="6" stroke="white" strokeWidth="1" fill="none" />
        </svg>

        {/* Folder badge */}
        <div
          className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded"
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(4px)',
          }}
        >
          /{file.folder_path}
        </div>

        {/* Conflict badge */}
        {file.has_conflict && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 1L9 8H1L5 1Z" />
            </svg>
            Conflict
          </div>
        )}

        {/* Sync state dot (top right, only when no conflict) */}
        {!file.has_conflict && file.sync_state !== 'synced' && (
          <div className="absolute top-2 right-2">
            <SyncBadge state={file.sync_state} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-medium text-sm truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {file.filename}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {file.tags.map(tag => (
            <TagChip key={tag} tag={tag} small />
          ))}
        </div>

        <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          {timeAgo(file.last_local_at)}
        </p>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      />
    </button>
  )
}

function timeAgo(ts: string): string {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
