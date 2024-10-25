import { getStats } from './stash.js';
import * as db from './db.js';
import { schedule } from "node-cron";
import Fastify from 'fastify'
import cors from '@fastify/cors'
import * as fastifyStatic from '@fastify/static'
import path from 'path';
const fastify = Fastify()

const update = async () => {
  getStats()
    .then(response => {
      const data = response.data.data.stats;
      db.insert().run(
        Date.now(),
        data.scene_count,
        data.scenes_size,
        data.scenes_duration,
        data.image_count,
        data.images_size,
        data.gallery_count,
        data.performer_count,
        data.studio_count,
        data.group_count,
        data.tag_count,
        data.total_o_count,
        data.total_play_duration,
        data.total_play_count,
        data.scenes_played
      );
    })
}

// /scenes
fastify.get("/api/stats/scenes", async (req, rep) => {
  const rows = db.queryLast100();
  const data = rows.map(row => ({
    timestamp: row.timestamp,
    count: row.scene_count,
    size: row.scenes_size,
    duration: row.scenes_duration,
    groups: row.group_count
  }))
  return data
})
// /images
fastify.get("/api/stats/images", async (req, rep) => {
  const rows = db.queryLast100();
  const data = rows.map(row => ({
    timestamp: row.timestamp,
    count: row.image_count,
    size: row.images_size,
    gallery: row.gallery_count
  }))
  return data
})
// duration/ o count
fastify.get("/api/stats/duration", async (req, rep) => {
  const rows = db.queryLast100();
  const data = rows.map(row => ({
    timestamp: row.timestamp,
    scene_dur: row.scenes_duration,
    scene_plays: row.scenes_played,
    play_dur: row.total_play_duration,
    play_count: row.total_play_count,
    o_count: row.total_o_count
  }))
  return data
})
// other
fastify.get("/api/stats/other", async (req, rep) => {
  const rows = db.queryLast100();
  const data = rows.map(row => ({
    timestamp: row.timestamp,
    performers: row.performer_count,
    studios: row.studio_count,
    tags: row.tag_count
  }))
  return data
})
// all
fastify.get("/api/stats/all", async (req, rep) => {
  const rows = db.queryAll();
  return rows
})

db.setup()
update()
// run twice daily
schedule("0 */12 * * *", update)

async function startFastify(port = 9988) {
  console.log(`Server running on http://localhost:${port}`);
  await fastify.register(cors)
  await fastify.register(fastifyStatic, {
    root: path.join(import.meta.dirname, 'public'),
  })
  await fastify.listen({ port })
}
startFastify()

process.on('exit', () => {
  console.log('Exiting');
  db.close()
});
process.on('SIGHUP', () => process.exit());
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());