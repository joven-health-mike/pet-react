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

export const WEEK_DATES = [[]]

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

export const compareDates = (date1: Date, date2: Date) => {
  const time1 = date1.getTime()
  const time2 = date2.getTime()

  if (time1 < time2) {
    return -1 // date1 is before date2
  } else if (time1 > time2) {
    return 1 // date1 is after date2
  } else {
    return 0 // dates are equal
  }
}

export const getWeekOfYear = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1) // January 1st of the given year
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000 // Milliseconds in a day

  // Calculate the week number
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}
