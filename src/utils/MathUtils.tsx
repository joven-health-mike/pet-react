export const formatPercent = (input: number, digits: number = 1) => {
  return `${(input * 100).toFixed(digits)}%`
}
