import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { FileCard } from '../components/FileCard'
import { TagChip } from '../components/TagChip'
import { SyncBadge } from '../components/SyncBadge'
import type { Tag } from '../types'

const ALL_TAGS: Tag[] = ['DEV', 'SEC', 'AI']

export function Dashboard() {
  const { files, globalSyncState, isSyncing, activeTag, setActiveTag, openFile, sync } = useApp()
  const [search, setSearch] = useState('')

  const filtered = files.filter(f => {
    const matchesTag = !activeTag || f.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      f.filename.toLowerCase().includes(q) ||
      f.folder_path.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    return matchesTag && matchesSearch
  })

  const conflictCount = files.filter(f => f.has_conflict).length

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4"
        style={{
          background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {/* Logo + title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: 'var(--color-primary-dim)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#38bdf8" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="#38bdf8" opacity="0.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="#38bdf8" opacity="0.6" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#38bdf8" opacity="0.3" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1
              className="text-sm font-semibold leading-none truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Project Index
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {files.length} files · {conflictCount > 0 ? `${conflictCount} conflict${conflictCount > 1 ? 's' : ''}` : 'No conflicts'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm pl-8 pr-3 py-1.5 rounded-lg outline-none transition-all"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary-500)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>
        </div>

        {/* Sync button */}
        <SyncBadge
          state={globalSyncState}
          isSyncing={isSyncing}
          onClick={sync}
        />
      </header>

      {/* Mobile search */}
      <div
        className="px-4 pt-3 sm:hidden"
        style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40"
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search files…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-sm pl-8 pr-3 py-2 rounded-lg outline-none"
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
        <div className="pb-3" />
      </div>

      {/* Tag Bar */}
      <div
        className="flex items-center gap-2 px-4 sm:px-6 py-3 overflow-x-auto"
        style={{
          background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          scrollbarWidth: 'none',
        }}
      >
        <button
          onClick={() => setActiveTag(null)}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150 whitespace-nowrap"
          style={{
            background: !activeTag ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
            color: !activeTag ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            border: `1px solid ${!activeTag ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'}`,
          }}
        >
          All
        </button>
        {ALL_TAGS.map(tag => (
          <TagChip
            key={tag}
            tag={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          />
        ))}

        <div className="flex-1" />
        <span className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* File Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-bg-elevated)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.4">
                <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No files match your filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(file => (
              <FileCard key={file.id} file={file} onClick={() => openFile(file.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
