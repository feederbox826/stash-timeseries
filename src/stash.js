import axios from 'axios';
import * as https from "https";

const CODECS = ['h264', 'hevc', 'av1', 'vp9'];

const agent = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'ApiKey': process.env.STASH_APIKEY
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export const getAllStats = async () => {
  // get all stats and combine them
  const statsQuery = {
    query: `{ stats {
      scene_count
      scenes_size
      scenes_duration
      image_count
      images_size
      gallery_count
      performer_count
      studio_count
      group_count
      tag_count
      total_o_count
      total_play_duration
      total_play_count
      scenes_played
    }}`
  }
  const statsResult = await agent.post(process.env.STASH_URL, statsQuery);
  const data = statsResult.data.data.stats;
  // get codec stats
  for (const codec of CODECS) {
    const codecQuery = {
      query: `query ($codec: String!) {
        findScenes(scene_filter: { video_codec: { value: $codec, modifier: EQUALS } }) {
          count
        }
      }`,
      variables: { codec }
    };
    const codecResult = await agent.post(process.env.STASH_URL, codecQuery);
    data[`${codec}_count`] = codecResult.data.data.findScenes.count;
  }
  return data;
}
