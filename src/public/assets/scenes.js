

function processChart(data) {
  const count = []
  const size = []
  const duration = []
  const groups = []
  const GB = 1024 * 1024 * 1024
  const DAY = 24 * 60 * 60
  data.sort((a, b) => a.timestamp - b.timestamp)
    .forEach(val => {
      count.push({ x: val.timestamp, y: val.count })
      size.push({ x: val.timestamp, y: val.size/GB })
      duration.push({ x: val.timestamp, y: val.duration/DAY })
      groups.push({ x: val.timestamp, y: val.groups })
    })
  return {
    count,
    size,
    duration,
    groups
  }
}

// setup
function createChart(data) {
  const ctx = document.getElementById('chart')
  
  const config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Scene count',
        data: data.count,
      }, {
        label: `Scene size (GB}`,
        data: data.size,
      },{
        label: `Total Duration (days)`,
        data: data.duration,
      }, {
        label: 'Group count',
        data: data.groups,
      }]
    },
    options
  }
  new Chart(ctx, config)
}