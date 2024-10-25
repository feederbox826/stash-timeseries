// plugin confirmation
const dark = "#111"
const light = "#ddd"
const enabled = true
const zoom = {
  pan: { mode: 'x', enabled },
  zoom: {
    mode: 'x',
    wheel: { enabled },
    pinch: { enabled }
  }
}
const grid = {
  color: "#444"
}
const legend = {
  labels: {
    color: light
  }
}
const scales = {
  x: {
    type: 'time',
    time: {
      minUnit: 'minute'
    },
    title: {
      display: true,
      text: 'Date',
      color: dark
    },
    grid
  },
  y: {
    type: 'logarithmic',
    min: 1,
    title: {
      display: true,
      color: light
    },
    grid
  }
}
const options = {
  normalized: true,
  parsing: false,
  color: light,
  scales,
  plugins: {
    zoom,
    legend
  },
}