export const adaptTeleTeachersData = (data: string[][]): string[][] => {
  return parseData(data)
}

const parseData = (data: string[][]) => {
  const newData: string[][] = []
  let providerName = ""
  let foundNewProvider = false

  for (const datum of data) {
    if (lineIsEmpty(datum)) {
      foundNewProvider = true
      continue
    }
    if (foundNewProvider) {
      providerName = datum[4]
      foundNewProvider = false
      continue
    }
    if (lineIsHeaders(datum)) {
      continue
    }

    // add provider name to the beginning of the array
    datum.unshift(providerName)
    newData.push(datum)
  }

  return newData
}

const lineIsHeaders = (datum: string[]) => datum[0] === "District Name"

const lineIsEmpty = (datum: string[]) => {
  for (const data of datum) {
    if (data !== "") return false
  }

  return true
}
