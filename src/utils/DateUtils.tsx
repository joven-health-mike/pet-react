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

export const formatDateShort = (date: Date) => {
  const day = date.getDate()
  const year = date.getFullYear()
  return `${MONTH_NAMES[date.getMonth()].substring(
    0,
    3
  )} ${day} ${`${year}`.substring(2, 4)}`
}

export const getFullWeeksBetweenDates = (date1: Date, date2: Date) => {
  var timeDiff = Math.abs(date2.getTime() - date1.getTime())

  // Convert milliseconds to days
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

  // Calculate number of full weeks
  var fullWeeks = Math.floor(diffDays / 7)

  return fullWeeks
}

export const addOneWeek = (date: Date): Date => {
  const newDate = new Date(date.getTime())
  newDate.setDate(newDate.getDate() + 7)
  return newDate
}

export const getDateFromWeekNumber = (weekNumber: number, year: number) => {
  // Create a new date object for January 1st of the given year
  var date = new Date(year, 0, 1)

  // Calculate the day of the week for January 1st
  var dayOfWeek = date.getDay()

  // Calculate the number of days to adjust the date to the start of the week
  var daysToAdjust = 1 - dayOfWeek

  // If January 1st is not already a Monday (0), adjust the date accordingly
  if (dayOfWeek !== 1) {
    date.setDate(date.getDate() + daysToAdjust)
  }

  // Calculate the number of days to add to the date based on the week number
  var daysToAdd = (weekNumber - 1) * 7

  // Add the calculated number of days to the date
  date.setDate(date.getDate() + daysToAdd)

  // Check if the resulting date is in the previous year
  if (date.getFullYear() !== year) {
    // Adjust the date to the last day of the previous year
    date = new Date(year - 1, 11, 31)
  }

  return date
}

export const getFirstDayOfWeekName = (date: Date) => {
  const weekNum = getWeekOfYear(date)
  const weekDate = getDateFromWeekNumber(weekNum, date.getFullYear())
  return formatDateShort(weekDate)
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

export const getEarlierDate = (date1: Date, date2: Date) => {
  return compareDates(date1, date2) < 1 ? date1 : date2
}

export const getLaterDate = (date1: Date, date2: Date) => {
  return compareDates(date1, date2) > 1 ? date1 : date2
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
