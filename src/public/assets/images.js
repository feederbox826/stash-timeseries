

function processChart(data) {
  const count = []
  const size = []
  const gallery = []
  const GB = 1024 * 1024 * 1024
  data.sort((a, b) => a.timestamp - b.timestamp)
    .forEach(val => {
      count.push({ x: val.timestamp, y: val.count })
      size.push({ x: val.timestamp, y: val.size/GB })
      gallery.push({ x: val.timestamp, y: val.gallery })
    })
  return {
    count,
    size,
    gallery
  }
}

// setup
function createChart(data) {
  const ctx = document.getElementById('chart')
  
  const config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Image count',
        data: data.count,
      }, {
        label: `Image size (GB}`,
        data: data.size,
      }, {
        label: 'Gallery count',
        data: data.gallery,
      }]
    },
    options
  }
  new Chart(ctx, config)
}