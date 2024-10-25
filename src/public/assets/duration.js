

function processChart(data) {
  const scene_dur = []
  const scene_plays = []
  const play_dur = []
  const play_count = []
  const o_count = []
  const DAY = 24 * 60 * 60
  data.sort((a, b) => a.timestamp - b.timestamp)
    .forEach(val => {
      scene_dur.push({ x: val.timestamp, y: val.scene_dur/DAY })
      scene_plays.push({ x: val.timestamp, y: val.scene_plays })
      play_dur.push({ x: val.timestamp, y: val.play_dur/DAY })
      play_count.push({ x: val.timestamp, y: val.play_count })
      o_count.push({ x: val.timestamp, y: val.o_count })
    })
  return {
    scene_dur,
    scene_plays,
    play_dur,
    play_count,
    o_count
  }
}

// setup
function createChart(data) {
  const ctx = document.getElementById('chart')
  
  const config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Scene Duration (days)',
        data: data.scene_dur,
      }, {
        label: 'Played Duration (days)',
        data: data.play_dur
      }, {
        label: `Scene Plays`,
        data: data.scene_plays,
      }, {
        label: 'Play Count',
        data: data.play_count,
      }, {
        label: 'O Count',
        data: data.o_count,
      }]
    },
    options
  }
  new Chart(ctx, config)
}