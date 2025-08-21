

function processChart(data) {
  const h264 = []
  const hevc = []
  const av1 = []
  const vp9 = []
  data
    .filter(val => val.h264 || val.hevc || val.av1 || val.vp9) // filter out no codec data
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(val => {
      h264.push({ x: val.timestamp, y: val.h264 })
      hevc.push({ x: val.timestamp, y: val.hevc })
      av1.push({ x: val.timestamp, y: val.av1 })
      vp9.push({ x: val.timestamp, y: val.vp9 })
    })
  return {
    h264,
    hevc,
    av1,
    vp9
  }
}

// setup
function createChart(data) {
  const ctx = document.getElementById('chart')
  
  const config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'h264 scenes',
        data: data.h264,
      }, {
        label: 'hevc scenes',
        data: data.hevc
      }, {
        label: 'av1 scenes',
        data: data.av1,
      }, {
        label: 'vp9 scenes',
        data: data.vp9,
      }]
    },
    options
  }
  new Chart(ctx, config)
}