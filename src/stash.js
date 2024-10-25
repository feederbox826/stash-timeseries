import axios from 'axios';
import * as https from "https";

const agent = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'ApiKey': process.env.STASH_APIKEY
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export const getStats = async () => {
  const query = {
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
  return agent.post(process.env.STASH_URL, query);
}