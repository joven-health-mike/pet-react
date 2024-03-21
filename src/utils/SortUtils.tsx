export const sortMapByValue = (
  map: Map<string, number>,
  filter: (
    a: [string, number],
    b: [string, number]
  ) => number = descendingFilter // default to descending order
) => {
  const array = Array.from(map)
  array.sort(filter)
  return new Map(array)
}

export const descendingFilter = (a: [string, number], b: [string, number]) => {
  return b[1] - a[1]
}

export const ascendingFilter = (a: [string, number], b: [string, number]) => {
  return a[1] - b[1]
}
