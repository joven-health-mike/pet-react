import {
  getEarlierDate,
  getFirstDayOfWeekName,
  getLaterDate,
  getMonthName,
  shiftedMonths,
  weekIterator,
} from "../utils/DateUtils"
import Session from "./Session"

export default class SessionGroupData {
  numMinutes = 0
  minutesByMonth: Map<string, number> = new Map()
  hoursByMonth: Map<string, number> = new Map()

  numPresences = 0
  numAbsences = 0
  absentRate = 0

  presencesByMonth: Map<string, number> = new Map()
  absencesByMonth: Map<string, number> = new Map()
  absenceRatesByMonth: Map<string, number> = new Map()

  presencesByWeek: Map<string, number> = new Map()
  absencesByWeek: Map<string, number> = new Map()
  absenceRatesByWeek: Map<string, number> = new Map()

  sessionTypeTimes: Map<string, number> = new Map()

  private earliestDate: Date = new Date("01/01/2990")
  private latestDate: Date = new Date("01/01/1990")

  private calculateMinutesByMonth(session: Session): void {
    const sessionDate = new Date(session.date)
    const monthName = getMonthName(sessionDate)
    const newHoursCount = this.minutesByMonth.get(monthName) ?? 0
    const sessionTime = parseInt(session.totalTime)
    this.minutesByMonth.set(monthName, newHoursCount + sessionTime)
    this.numMinutes += sessionTime
  }

  private calculateHoursByMonth(): void {
    // calculate absent rates for each month
    for (const monthName of shiftedMonths(6)) {
      const minutesForMonth = this.minutesByMonth!.get(monthName) ?? 0
      this.hoursByMonth.set(
        monthName,
        parseFloat((minutesForMonth / 60).toFixed(3))
      )
    }
  }

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
    for (const monthName of shiftedMonths(6)) {
      const presencesForMonth = this.presencesByMonth!.get(monthName) ?? 0
      const absencesForMonth = this.absencesByMonth!.get(monthName) ?? 0
      this.absenceRatesByMonth.set(
        monthName,
        calculateAbsentRate(presencesForMonth, absencesForMonth)
      )
    }
  }

  private calculateWeeklyAbsentRates = () => {
    // TODO: Test this. weeks might be off by 1...
    for (const weekName of weekIterator(this.earliestDate, this.latestDate)) {
      this.absenceRatesByWeek.set(
        weekName,
        calculateAbsentRate(
          this.presencesByWeek!.get(weekName) ?? 0,
          this.absencesByWeek!.get(weekName) ?? 0
        )
      )
    }
  }

  private calculateSessionTypeTimes = (session: Session) => {
    const newValue =
      (this.sessionTypeTimes.get(session.enhancedServiceName()) ?? 0) +
      parseInt(session.totalTime)

    this.sessionTypeTimes.set(session.enhancedServiceName(), newValue)
  }

  processNewSession(session: Session): void {
    const sessionDate = new Date(session.date)
    this.earliestDate = getEarlierDate(this.earliestDate, sessionDate)
    this.latestDate = getLaterDate(this.latestDate, sessionDate)
    this.calculateOverallAttendance(session)
    this.calculateMonthlyAttendance(session)
    this.calculateWeeklyAttendance(session)
    this.calculateMinutesByMonth(session)
    this.calculateSessionTypeTimes(session)
  }

  finalize(): void {
    this.calculateOverallAbsentRates()
    this.calculateMonthlyAbsentRates()
    this.calculateWeeklyAbsentRates()
    this.calculateHoursByMonth()
  }
}

const calculateAbsentRate = (present: number, absent: number): number => {
  return parseFloat(
    (absent + present === 0 ? 0 : (100 * absent) / (absent + present)).toFixed(
      3
    )
  )
}
