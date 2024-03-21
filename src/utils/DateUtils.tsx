export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const todaysDate = () => {
  return formatDate(new Date())
}

export const formatDateStr = (dateStr: string) => {
  return formatDate(new Date(dateStr))
}

export const formatDate = (date: Date) => {
  // Get the current year, month, and day
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // Months are zero-indexed, so we add 1
  const day = date.getDate()

  // Format the date as MM/DD/YYYY
  return (
    (month < 10 ? "0" : "") +
    month +
    "/" +
    (day < 10 ? "0" : "") +
    day +
    "/" +
    year
  )
}

export const getMonthName = (date: Date) => {
  return MONTH_NAMES[date.getMonth()]
}

export const sortMapByMonth = (map: Map<string, number>) => {
  const entries = Array.from(map)
  entries.sort((a, b) => {
    return MONTH_NAMES.indexOf(a[0]) - MONTH_NAMES.indexOf(b[0])
  })
  return new Map(entries)
}
