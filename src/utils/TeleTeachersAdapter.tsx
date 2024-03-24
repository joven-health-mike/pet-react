const EMPTY_LINE = ["", "", "", "", "", "", "", "", "", "", "", "", ""]

export const adaptTeleTeachersData = (
  data: string[][],
  shouldSkip: (dataArray: string[]) => boolean = () => false
) => {
  const parsedData: string[][] = parseData(data)
  const filteredData: string[][] = []
  for (const datum of parsedData) {
    if (shouldSkip(datum)) continue
    filteredData.push(datum)
  }
  return filteredData
}

export const adaptTeleTeachersDataForInvoices = (data: string[][]) => {
  return adaptTeleTeachersData(
    data,
    (dataArray) =>
      dataArray[0] === "Jacek McGuinness" ||
      dataArray[1] === "Joven Health" ||
      dataArray[1] === "Joven Health Test District"
  )
}

export const adaptTeleTeachersDataForPayroll = (data: string[][]) => {
  return adaptTeleTeachersData(
    data,
    (dataArray) =>
      dataArray[0] === "Jacek McGuinness" ||
      dataArray[1] === "Joven Health Test District"
  )
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
  for (let i = 0; i < datum.length; i++) {
    if (datum[i] !== EMPTY_LINE[i]) {
      return false
    }
  }
  return true
}
