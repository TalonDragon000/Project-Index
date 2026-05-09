/*
  # Project Index Schema

  ## Overview
  Initializes the data layer for the Project Index App — a local-first
  canvas-based project management tool.

  ## New Tables

  ### project_files
  Stores metadata for every canvas/document file tracked by the app.

  | Column           | Type        | Description                                       |
  |------------------|-------------|---------------------------------------------------|
  | id               | uuid (PK)   | Unique identifier                                 |
  | user_id          | uuid        | Owner — references auth.users                     |
  | filename         | text        | e.g. "design.md"                                  |
  | folder_path      | text        | e.g. "Indexer" or "app/docs"                      |
  | tags             | text[]      | Array of tag strings: DEV, SEC, AI                |
  | canvas_data      | jsonb       | Serialized tldraw snapshot                        |
  | last_local_at    | timestamptz | Timestamp of the most recent local change         |
  | last_synced_at   | timestamptz | Timestamp of last successful sync                 |
  | remote_updated_at| timestamptz | Mocked remote repo timestamp                      |
  | has_conflict     | boolean     | Whether a sync conflict is detected               |
  | sync_state       | text        | One of: synced, ahead, behind, conflict           |
  | created_at       | timestamptz | Row creation timestamp                            |

  ## Security
  - RLS enabled on project_files
  - Users can only access their own files
  - All operations (select/insert/update/delete) restricted to owner
*/

CREATE TABLE IF NOT EXISTS project_files (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename         text NOT NULL DEFAULT '',
  folder_path      text NOT NULL DEFAULT '',
  tags             text[] NOT NULL DEFAULT '{}',
  canvas_data      jsonb,
  last_local_at    timestamptz DEFAULT now(),
  last_synced_at   timestamptz,
  remote_updated_at timestamptz,
  has_conflict     boolean NOT NULL DEFAULT false,
  sync_state       text NOT NULL DEFAULT 'synced' CHECK (sync_state IN ('synced', 'ahead', 'behind', 'conflict')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_files_user_id_idx ON project_files(user_id);
CREATE INDEX IF NOT EXISTS project_files_tags_idx ON project_files USING GIN(tags);
CREATE INDEX IF NOT EXISTS project_files_sync_state_idx ON project_files(sync_state);

ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own files"
  ON project_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON project_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files"
  ON project_files FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON project_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
