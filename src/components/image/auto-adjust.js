const intensity = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114

const getIntensities = pixels => {
  // Return array of intensities from rgba array
  let intensities = [];

  for (let i = 0; i < pixels.length; i += 4) {
    intensities.push(intensity(pixels[i], pixels[i + 1], pixels[i + 2]));
  }

  return intensities
}

const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length

const stdDev = (values, mean) => Math.sqrt(values.reduce((sum, value) => {
  const v = value - mean
  return sum + v * v
}, 0) / values.length)

export const getAutoAdjustValues = (imageRef, canvasRef) => {
  const context = canvasRef.current.getContext("2d")
  const width = canvasRef.current.width
  const height = canvasRef.current.height
    
  context.drawImage(imageRef.current, 0, 0, width, height)
  const image = context.getImageData(0, 0, width, height)

  const intensities = getIntensities(image.data)

  const m = mean(intensities)
  const sd = stdDev(intensities, m)

  return {
    brightness: m === 0 ? 1 : 128 / m,
    contrast: sd === 0 ? 1 : Math.max(1, 128 / (sd * 5))
  }
}