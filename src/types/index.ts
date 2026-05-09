export type SyncState = 'synced' | 'ahead' | 'behind' | 'conflict'

export type Tag = 'DEV' | 'SEC' | 'AI'

export interface ProjectFile {
  id: string
  user_id: string
  filename: string
  folder_path: string
  tags: Tag[]
  canvas_data: object | null
  last_local_at: string
  last_synced_at: string | null
  remote_updated_at: string | null
  has_conflict: boolean
  sync_state: SyncState
  created_at: string
}

export type View = 'dashboard' | 'canvas'

export interface AppRoute {
  view: View
  fileId?: string
}
