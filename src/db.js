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
    scenes_played INTEGER
  )`).run()
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
  scenes_played
) VALUES (
  ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
)`)