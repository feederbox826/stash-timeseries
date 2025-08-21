import { getAllStats } from './stash.js';
import * as db from './db.js';
import { schedule } from "node-cron";
import Fastify from 'fastify'
import cors from '@fastify/cors'
import * as fastifyStatic from '@fastify/static'
import path from 'path';
const fastify = Fastify()

const update = async () => {
  getAllStats()
    .then(data => {
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
        data.scenes_played,
        data.h264_count || 0,
        data.hevc_count || 0,
        data.av1_count || 0,
        data.vp9_count || 0
      );
    })
}

const queryLast = (limit, transform) => {
  const rows = db.queryLast(limit);
  return rows.map(row => transform(row));
}

// /scenes
fastify.get("/api/stats/scenes", async (req, rep) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const transform = row => ({
    timestamp: row.timestamp,
    count: row.scene_count,
    size: row.scenes_size,
    duration: row.scenes_duration,
    groups: row.group_count
  })
  return queryLast(limit, transform);
})
// /images
fastify.get("/api/stats/images", async (req, rep) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const transform = row => ({
    timestamp: row.timestamp,
    count: row.image_count,
    size: row.images_size,
    gallery: row.gallery_count
  })
  return queryLast(limit, transform);
})
// duration/ o count
fastify.get("/api/stats/duration", async (req, rep) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const transform = row => ({
    timestamp: row.timestamp,
    scene_dur: row.scenes_duration,
    scene_plays: row.scenes_played,
    play_dur: row.total_play_duration,
    play_count: row.total_play_count,
    o_count: row.total_o_count
  })
  return queryLast(limit, transform);
})
// codecs
fastify.get("/api/stats/codecs", async (req, rep) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const transform = row => ({
    timestamp: row.timestamp,
    h264: row.h264_count,
    hevc: row.hevc_count,
    av1: row.av1_count,
    vp9: row.vp9_count
  })
  return queryLast(limit, transform);
})
// other
fastify.get("/api/stats/other", async (req, rep) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const transform = row => ({
    timestamp: row.timestamp,
    performers: row.performer_count,
    studios: row.studio_count,
    tags: row.tag_count
  })
  return queryLast(limit, transform);
})
// all
fastify.get("/api/stats/all", async (req, rep) => {
  const rows = db.queryAll();
  return rows
})
fastify.get("/api/update", async (req, rep) => {
  update()
  return { status: "ok" }
})

db.setup()
update()
// run twice daily
schedule("0 */12 * * *", update)

async function startFastify(port = 9988, host = "::") {
  console.log(`Server running on http://${host}:${port}`);
  await fastify.register(cors)
  await fastify.register(fastifyStatic, {
    root: path.join(import.meta.dirname, 'public'),
  })
  await fastify.listen({ port, host })
}
startFastify()

process.on('exit', () => {
  console.log('Exiting');
  db.close()
});
process.on('SIGHUP', () => process.exit());
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());