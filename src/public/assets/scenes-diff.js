

function processChart(data) {
  const count = []
  const size = []
  const duration = []
  const groups = []
  const GB = 1024 * 1024 * 1024
  const DAY = 24 * 60 * 60
  const sorted = data.sort((a, b) => a.timestamp - b.timestamp)
  for (var i=1; i < sorted.length; i++) {
    var val = sorted[i]
    var prev = sorted[i-1]
    count.push({ x: val.timestamp, y: val.count-prev.count })
    size.push({ x: val.timestamp, y: (val.size-prev.size)/GB })
    duration.push({ x: val.timestamp, y: (val.duration-prev.duration)/DAY })
    groups.push({ x: val.timestamp, y: (val.groups-prev.groups) })
  }
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
        label: 'Scene count diff',
        data: data.count,
      }, {
        label: `Scene size diff (GB)`,
        data: data.size,
      },{
        label: `Total Duration diff (days)`,
        data: data.duration,
      }, {
        label: 'Group count diff',
        data: data.groups,
      }]
    },
    options
  }
  new Chart(ctx, config)
}