import Database from 'better-sqlite3';
const db = new Database('db/stash-timeseries.db');
db.pragma('journal_mode = WAL');

export const close = () => db.close()

export function setup() {
  db.prepare(`CREATE TABLE IF NOT EXISTS timeseries (
    timestamp INTEGER PRIMARY KEY,
    scene_count INTEGER,
    scenes_size INTEGER,
    scenes_duration REAL,
    image_count INTEGER,
    images_size INTEGER,
    gallery_count INTEGER,
    performer_count INTEGER,
    studio_count INTEGER,
    group_count INTEGER,
    tag_count INTEGER,
    total_o_count INTEGER,
    total_play_duration INTEGER,
    total_play_count INTEGER,
    scenes_played INTEGER,
    h264_count INTEGER,
    hevc_count INTEGER,
    av1_count INTEGER,
    vp9_count INTEGER
  )`).run()
  db.prepare(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`).run()
  // check version
  db.prepare("INSERT INTO settings (key, value) VALUES ('db_version', '1')").run()
}

export function migrate() {
  // v1 migration
  const row = db.prepare("SELECT value FROM settings WHERE key = 'db_version'").get()
  if (row) {
    let version = parseInt(row.value)
    if (version < 1) {
      // add codecs
      for (const codec of ['h264', 'hevc', 'av1', 'vp9']) {
        db.prepare(`ALTER TABLE timeseries ADD COLUMN ${codec}_count INTEGER DEFAULT 0`).run()
      }
      // initial version
      db.prepare("UPDATE settings SET value = '1' WHERE key = 'db_version'").run()
      version = 1
    }
  }
}


export const queryRange = () => db.prepare("SELECT * FROM timeseries WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp DESC").all()

export const queryLast = (limit) => db.prepare("SELECT * FROM timeseries ORDER BY timestamp DESC LIMIT ?").all(limit)

export const queryAll = () => db.prepare("SELECT * FROM timeseries").all()

export const insert = () => db.prepare(`INSERT INTO timeseries (
  timestamp,
  scene_count,
  scenes_size,
  scenes_duration,
  image_count,
  images_size,
  gallery_count,
  performer_count,
  studio_count,
  group_count,
  tag_count,
  total_o_count,
  total_play_duration,
  total_play_count,
  scenes_played,
  h264_count,
  hevc_count,
  av1_count,
  vp9_count
) VALUES (
  ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
)`)