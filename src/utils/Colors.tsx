export const randomColor = (alpha: number = 0) => {
  const redValue = Math.floor(Math.random() * 256)
  const greenValue = Math.floor(Math.random() * 256)
  const blueValue = Math.floor(Math.random() * 256)
  return `rgba(${redValue}, ${greenValue}, ${blueValue}, ${alpha})`
}
