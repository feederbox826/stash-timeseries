

function processChart(data) {
  const performers = []
  const studios = []
  const tags = []
  data.sort((a, b) => a.timestamp - b.timestamp)
    .forEach(val => {
      performers.push({ x: val.timestamp, y: val.performers })
      studios.push({ x: val.timestamp, y: val.studios })
      tags.push({ x: val.timestamp, y: val.tags })
    })
  return {
    performers,
    studios,
    tags
  }
}

// setup
function createChart(data) {
  const ctx = document.getElementById('chart')
  
  const config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Performers',
        data: data.performers,
      }, {
        label: 'Studios',
        data: data.studios,
      },{
        label: 'Tags',
        data: data.tags,
      }]
    },
    options
  }
  new Chart(ctx, config)
}