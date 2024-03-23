import {
  MONTH_NAMES,
  addOneWeek,
  getEarlierDate,
  getFirstDayOfWeekName,
  getFullWeeksBetweenDates,
  getLaterDate,
  getMonthName,
} from "../utils/DateUtils"
import Session from "./Session"

export default class SessionGroupData {
  numPresences = 0
  numAbsences = 0
  absentRate = 0

  presencesByMonth: Map<string, number> = new Map()
  absencesByMonth: Map<string, number> = new Map()
  absenceRatesByMonth: Map<string, number> = new Map()

  presencesByWeek: Map<string, number> = new Map()
  absencesByWeek: Map<string, number> = new Map()
  absenceRatesByWeek: Map<string, number> = new Map()

  earliestDate: Date = new Date("01/01/2990")
  latestDate: Date = new Date("01/01/1990")

  private calculateOverallAttendance(session: Session): void {
    if (session.isDirect() && session.isPresent()) {
      this.numPresences++
    } else if (session.isDirect() && !session.isPresent()) {
      this.numAbsences++
    }
  }

  private calculateMonthlyAttendance(session: Session): void {
    const sessionDate = new Date(session.date)
    const monthName = getMonthName(sessionDate)
    if (session.isDirect() && session.isPresent()) {
      const newPresentCount = this.presencesByMonth.get(monthName) ?? 0
      this.presencesByMonth.set(monthName, newPresentCount + 1)
    } else if (session.isDirect() && !session.isPresent()) {
      const newAbsentCount = this.absencesByMonth.get(monthName) ?? 0
      this.absencesByMonth.set(monthName, newAbsentCount + 1)
    }
  }

  private calculateWeeklyAttendance(session: Session): void {
    const sessionDate = new Date(session.date)
    const weekName = getFirstDayOfWeekName(sessionDate)
    if (session.isDirect() && session.isPresent()) {
      const newPresencesCount = this.presencesByWeek.get(weekName) ?? 0
      this.presencesByWeek.set(weekName, newPresencesCount + 1)
    } else if (session.isDirect() && !session.isPresent()) {
      const newAbsencesCount = this.absencesByWeek.get(weekName) ?? 0
      this.absencesByWeek.set(weekName, newAbsencesCount + 1)
    }
  }

  private calculateOverallAbsentRates = () => {
    this.absentRate = calculateAbsentRate(this.numPresences, this.numAbsences)
  }

  private calculateMonthlyAbsentRates = () => {
    // calculate absent rates for each month
    for (let i = 0; i <= MONTH_NAMES.length; i++) {
      const monthIndex = (i + 6) % MONTH_NAMES.length
      const monthName = MONTH_NAMES[monthIndex]
      this.absenceRatesByMonth.set(
        monthName,
        calculateAbsentRate(
          this.presencesByMonth!.get(monthName) ?? 0,
          this.absencesByMonth!.get(monthName) ?? 0
        )
      )
    }
  }

  private calculateWeeklyAbsentRates = () => {
    // calculate absent rates for each week
    const numberOfWeeks = getFullWeeksBetweenDates(
      this.earliestDate,
      this.latestDate
    )
    let previousWeek = this.earliestDate

    for (let i = 0; i <= numberOfWeeks; i++) {
      let weekName = getFirstDayOfWeekName(previousWeek)
      this.absenceRatesByWeek.set(
        weekName,
        calculateAbsentRate(
          this.presencesByWeek!.get(weekName) ?? 0,
          this.absencesByWeek!.get(weekName) ?? 0
        )
      )

      previousWeek = addOneWeek(previousWeek)
    }
  }

  processNewSession(session: Session): void {
    const sessionDate = new Date(session.date)
    this.earliestDate = getEarlierDate(this.earliestDate, sessionDate)
    this.latestDate = getLaterDate(this.latestDate, sessionDate)
    this.calculateOverallAttendance(session)
    this.calculateMonthlyAttendance(session)
    this.calculateWeeklyAttendance(session)
  }

  finalize(): void {
    this.calculateOverallAbsentRates()
    this.calculateMonthlyAbsentRates()
    this.calculateWeeklyAbsentRates()
  }
}

const calculateAbsentRate = (present: number, absent: number): number => {
  return parseFloat(
    (absent + present === 0 ? 0 : (100 * absent) / (absent + present)).toFixed(
      3
    )
  )
}
