import { useRef, useCallback, useEffect, useState } from 'react'
import { Tldraw, type Editor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useApp } from '../store/AppContext'
import { SyncBadge } from '../components/SyncBadge'
import { TagChip } from '../components/TagChip'

export function CanvasWorkspace() {
  const { files, route, penOnlyMode, goHome, togglePenOnly, updateCanvasData } = useApp()
  const editorRef = useRef<Editor | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keep a ref to penOnlyMode so the event listener closure always sees latest value
  const penOnlyModeRef = useRef(penOnlyMode)
  useEffect(() => {
    penOnlyModeRef.current = penOnlyMode
  }, [penOnlyMode])

  const file = files.find(f => f.id === route.fileId)

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor

      // Palm rejection: block non-pen pointer events at capture phase
      const container = editor.getContainer()
      const onPointerDown = (e: PointerEvent) => {
        if (penOnlyModeRef.current && e.pointerType !== 'pen') {
          e.stopPropagation()
          e.preventDefault()
        }
      }
      container.addEventListener('pointerdown', onPointerDown, { capture: true })

      // Persist canvas changes to store
      const unsub = editor.store.listen(() => {
        if (!route.fileId) return
        const snapshot = editor.getSnapshot()
        updateCanvasData(route.fileId, snapshot)
      }, { scope: 'document', source: 'user' })

      return () => {
        container.removeEventListener('pointerdown', onPointerDown, { capture: true })
        unsub()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route.fileId, updateCanvasData],
  )

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !editorRef.current) return
    setImageUploading(true)
    try {
      const editor = editorRef.current
      await editor.putExternalContent({
        type: 'files',
        files: [f],
        point: editor.getViewportScreenCenter(),
        ignoreParent: false,
      })
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  if (!file) {
    return (
      <div
        className="flex items-center justify-center h-full text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        File not found.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#0a0e1a' }}>
      {/* Breadcrumb bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 flex-shrink-0"
        style={{
          background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          zIndex: 10,
        }}
      >
        <nav className="flex items-center gap-1.5 text-xs min-w-0" aria-label="breadcrumb">
          <button
            onClick={goHome}
            className="transition-colors hover:underline whitespace-nowrap"
            style={{ color: 'var(--color-primary-400)' }}
          >
            Project Index
          </button>
          <span style={{ color: 'var(--color-text-muted)' }}>›</span>
          <span className="truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {file.folder_path}
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>›</span>
          <span className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
            {file.filename}
          </span>
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          {file.tags.map(tag => (
            <TagChip key={tag} tag={tag} small />
          ))}
          <SyncBadge state={file.sync_state} />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <Tldraw
          onMount={handleMount}
          persistenceKey={`canvas-${file.id}`}
        />

        {/* Floating toolbar */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-xl z-20 animate-fade-in"
          style={{
            background: 'rgba(17,24,39,0.92)',
            border: '1px solid var(--color-border-strong)',
            backdropFilter: 'blur(12px)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Pen Only toggle */}
          <button
            onClick={togglePenOnly}
            title={penOnlyMode ? 'Pen Only: ON — touch ignored' : 'Pen Only: OFF'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: penOnlyMode ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.05)',
              color: penOnlyMode ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
              border: `1px solid ${penOnlyMode ? 'rgba(14,165,233,0.4)' : 'var(--color-border)'}`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M10 2L12 4L5 11L2 12L3 9L10 2Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pen Only
            {penOnlyMode && (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                style={{ background: 'var(--color-primary-400)' }}
              />
            )}
          </button>

          <div className="w-px h-5" style={{ background: 'var(--color-border)' }} />

          {/* Image upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
            title="Upload image"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M1 9l3-3 2.5 2.5L9 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4.5" cy="6" r="1" fill="currentColor" />
            </svg>
            {imageUploading ? 'Uploading…' : 'Image'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Palm rejection indicator */}
        {penOnlyMode && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg z-20 pointer-events-none animate-slide-in"
            style={{
              background: 'rgba(14,165,233,0.15)',
              border: '1px solid rgba(14,165,233,0.3)',
              color: 'var(--color-primary-400)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: 'currentColor' }}
            />
            Palm Rejection Active
          </div>
        )}
      </div>
    </div>
  )
}
