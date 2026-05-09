import type { ProjectFile } from '../types'

const now = new Date()
const t = (offsetMs: number) => new Date(now.getTime() + offsetMs).toISOString()

export const MOCK_FILES: ProjectFile[] = [
  {
    id: 'file-1',
    user_id: 'mock-user',
    filename: 'design.md',
    folder_path: 'Indexer',
    tags: ['DEV'],
    canvas_data: null,
    last_local_at: t(-60_000 * 5),
    last_synced_at: t(-60_000 * 60),
    remote_updated_at: t(-60_000 * 60),
    has_conflict: false,
    sync_state: 'ahead',
    created_at: t(-60_000 * 60 * 24),
  },
  {
    id: 'file-2',
    user_id: 'mock-user',
    filename: 'design.md',
    folder_path: 'app/docs',
    tags: ['DEV'],
    canvas_data: null,
    last_local_at: t(-60_000 * 30),
    last_synced_at: t(-60_000 * 45),
    remote_updated_at: t(-60_000 * 20),
    has_conflict: true,
    sync_state: 'conflict',
    created_at: t(-60_000 * 60 * 48),
  },
  {
    id: 'file-3',
    user_id: 'mock-user',
    filename: 'threat-model.md',
    folder_path: 'Indexer',
    tags: ['SEC'],
    canvas_data: null,
    last_local_at: t(-60_000 * 90),
    last_synced_at: t(-60_000 * 90),
    remote_updated_at: t(-60_000 * 60),
    has_conflict: false,
    sync_state: 'behind',
    created_at: t(-60_000 * 60 * 72),
  },
  {
    id: 'file-4',
    user_id: 'mock-user',
    filename: 'llm-pipeline.md',
    folder_path: 'Indexer',
    tags: ['AI', 'DEV'],
    canvas_data: null,
    last_local_at: t(-60_000 * 120),
    last_synced_at: t(-60_000 * 120),
    remote_updated_at: t(-60_000 * 120),
    has_conflict: false,
    sync_state: 'synced',
    created_at: t(-60_000 * 60 * 96),
  },
  {
    id: 'file-5',
    user_id: 'mock-user',
    filename: 'api-audit.md',
    folder_path: 'app/docs',
    tags: ['SEC', 'AI'],
    canvas_data: null,
    last_local_at: t(-60_000 * 10),
    last_synced_at: t(-60_000 * 120),
    remote_updated_at: t(-60_000 * 120),
    has_conflict: false,
    sync_state: 'ahead',
    created_at: t(-60_000 * 60 * 12),
  },
  {
    id: 'file-6',
    user_id: 'mock-user',
    filename: 'indexer-arch.md',
    folder_path: 'Indexer',
    tags: ['DEV', 'AI'],
    canvas_data: null,
    last_local_at: t(-60_000 * 200),
    last_synced_at: t(-60_000 * 200),
    remote_updated_at: t(-60_000 * 200),
    has_conflict: false,
    sync_state: 'synced',
    created_at: t(-60_000 * 60 * 120),
  },
]

export function computeSyncState(file: ProjectFile): ProjectFile {
  const localTs = new Date(file.last_local_at).getTime()
  const syncedTs = file.last_synced_at ? new Date(file.last_synced_at).getTime() : 0
  const remoteTs = file.remote_updated_at ? new Date(file.remote_updated_at).getTime() : 0

  const localAhead = localTs > syncedTs
  const remoteAhead = remoteTs > syncedTs

  let sync_state: ProjectFile['sync_state']
  let has_conflict = false

  if (localAhead && remoteAhead) {
    sync_state = 'conflict'
    has_conflict = true
  } else if (localAhead) {
    sync_state = 'ahead'
  } else if (remoteAhead) {
    sync_state = 'behind'
  } else {
    sync_state = 'synced'
  }

  return { ...file, sync_state, has_conflict }
}
