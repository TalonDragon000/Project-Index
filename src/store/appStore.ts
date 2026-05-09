import { useState, useCallback } from 'react'
import type { ProjectFile, SyncState, Tag, AppRoute } from '../types'
import { MOCK_FILES, computeSyncState } from '../lib/mockData'

export type GlobalState = {
  files: ProjectFile[]
  route: AppRoute
  isSyncing: boolean
  globalSyncState: SyncState
  penOnlyMode: boolean
  activeTag: Tag | null
}

export type GlobalActions = {
  openFile: (id: string) => void
  goHome: () => void
  sync: () => Promise<void>
  togglePenOnly: () => void
  setActiveTag: (tag: Tag | null) => void
  updateCanvasData: (id: string, data: object) => void
}

export function useAppStore(): GlobalState & GlobalActions {
  const [files, setFiles] = useState<ProjectFile[]>(() =>
    MOCK_FILES.map(computeSyncState)
  )
  const [route, setRoute] = useState<AppRoute>({ view: 'dashboard' })
  const [isSyncing, setIsSyncing] = useState(false)
  const [penOnlyMode, setPenOnlyMode] = useState(false)
  const [activeTag, setActiveTag] = useState<Tag | null>(null)

  const globalSyncState: SyncState = (() => {
    if (files.some(f => f.sync_state === 'conflict')) return 'conflict'
    if (files.some(f => f.sync_state === 'ahead')) return 'ahead'
    if (files.some(f => f.sync_state === 'behind')) return 'behind'
    return 'synced'
  })()

  const openFile = useCallback((id: string) => {
    setRoute({ view: 'canvas', fileId: id })
  }, [])

  const goHome = useCallback(() => {
    setRoute({ view: 'dashboard' })
  }, [])

  const sync = useCallback(async () => {
    setIsSyncing(true)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1800))
    const syncedAt = new Date().toISOString()
    setFiles(prev =>
      prev.map(f => {
        if (f.sync_state === 'conflict') return f
        // Resolve ahead/behind by updating synced timestamp
        return computeSyncState({
          ...f,
          last_synced_at: syncedAt,
          remote_updated_at: syncedAt,
        })
      })
    )
    setIsSyncing(false)
  }, [])

  const togglePenOnly = useCallback(() => {
    setPenOnlyMode(v => !v)
  }, [])

  const updateCanvasData = useCallback((id: string, data: object) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id !== id) return f
        const updated = {
          ...f,
          canvas_data: data,
          last_local_at: new Date().toISOString(),
        }
        return computeSyncState(updated)
      })
    )
  }, [])

  return {
    files,
    route,
    isSyncing,
    globalSyncState,
    penOnlyMode,
    activeTag,
    openFile,
    goHome,
    sync,
    togglePenOnly,
    setActiveTag,
    updateCanvasData,
  }
}
