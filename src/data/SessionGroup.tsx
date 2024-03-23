import {
  MONTH_NAMES,
  addOneWeek,
  compareDates,
  formatDateShort,
  getDateFromWeekNumber,
  getFullWeeksBetweenDates,
  getMonthName,
  getWeekOfYear,
} from "../utils/DateUtils"
import Session from "./Session"

export default class SessionGroup {
  constructor(public sessions: Session[]) {}
  private loaded = false
  private numPresences = 0
  private numAbsences = 0
  private presencesByMonth: Map<string, number> | undefined = undefined
  private absencesByMonth: Map<string, number> | undefined = undefined
  private absenceRatesByMonth: Map<string, number> | undefined = undefined

  private presencesByWeek: Map<string, number> | undefined = undefined
  private absencesByWeek: Map<string, number> | undefined = undefined
  private absenceRatesByWeek: Map<string, number> | undefined = undefined

  presences(): number {
    this.loadMetrics()
    return this.numPresences
  }

  absences(): number {
    this.loadMetrics()
    return this.numAbsences
  }

  absentRate(): number {
    this.loadMetrics()
    return this.calculateAbsentRate(this.numPresences, this.numAbsences)
  }

  noShowRatesByMonth(): Map<string, number> {
    this.loadMetrics()
    return this.absenceRatesByMonth!
  }

  noShowRatesByWeek(): Map<string, number> {
    this.loadMetrics()
    return this.absenceRatesByWeek!
  }

  private calculateAbsentRate(present: number, absent: number): number {
    return parseFloat(
      (absent + present === 0
        ? 0
        : (100 * absent) / (absent + present)
      ).toFixed(3)
    )
  }

  private loadMetrics(): void {
    if (this.loaded === false) {
      this.calculateMetrics()
      this.loaded = true
    }
  }

  private calculateMetrics(): void {
    this.absencesByMonth = new Map<string, number>()
    this.presencesByMonth = new Map<string, number>()
    this.absencesByWeek = new Map<string, number>()
    this.presencesByWeek = new Map<string, number>()
    let earliestDate: Date = new Date("01/01/2990")
    let latestDate: Date = new Date("01/01/1990")

    // assumes sessions are sorted by date
    for (const session of this.sessions) {
      const sessionDate = new Date(session.date)
      if (compareDates(sessionDate, earliestDate) === -1) {
        earliestDate = sessionDate
      }
      if (compareDates(sessionDate, latestDate) === 1) {
        latestDate = sessionDate
      }

      const month = getMonthName(sessionDate)
      let weekNum = getWeekOfYear(sessionDate)
      const weekDate = getDateFromWeekNumber(weekNum, sessionDate.getFullYear())
      const weekNumber = formatDateShort(weekDate)

      if (session.isDirect() && session.isPresent()) {
        this.numPresences++
        if (!this.presencesByMonth.has(month)) {
          this.presencesByMonth.set(month, 0)
        }
        this.presencesByMonth.set(month, this.presencesByMonth.get(month)! + 1)
        if (!this.presencesByWeek.has(weekNumber)) {
          this.presencesByWeek.set(weekNumber, 0)
        }
        this.presencesByWeek.set(
          weekNumber,
          this.presencesByWeek.get(weekNumber)! + 1
        )
      } else if (session.isDirect() && !session.isPresent()) {
        this.numAbsences++
        if (!this.absencesByMonth.has(month)) {
          this.absencesByMonth.set(month, 0)
        }
        this.absencesByMonth.set(month, this.absencesByMonth.get(month)! + 1)
        if (!this.absencesByWeek.has(weekNumber)) {
          this.absencesByWeek.set(weekNumber, 0)
        }
        this.absencesByWeek.set(
          weekNumber,
          this.absencesByWeek.get(weekNumber)! + 1
        )
      }
    }

    this.absenceRatesByMonth = new Map<string, number>()
    for (let i = 0; i <= MONTH_NAMES.length; i++) {
      const monthIndex = (i + 6) % MONTH_NAMES.length
      const monthName = MONTH_NAMES[monthIndex]
      let presencesForMonth = 0
      let absencesForMonth = 0
      if (this.presencesByMonth!.get(monthName)) {
        presencesForMonth = this.presencesByMonth!.get(monthName)!
      }
      if (this.absencesByMonth!.get(monthName)) {
        absencesForMonth = this.absencesByMonth!.get(monthName)!
      }
      this.absenceRatesByMonth.set(
        monthName,
        this.calculateAbsentRate(presencesForMonth, absencesForMonth)
      )
    }

    const numberOfWeeks = getFullWeeksBetweenDates(earliestDate, latestDate)
    let previousWeek = earliestDate

    this.absenceRatesByWeek = new Map<string, number>()

    for (let i = 0; i <= numberOfWeeks; i++) {
      let weekName = formatDateShort(
        getDateFromWeekNumber(
          getWeekOfYear(previousWeek),
          previousWeek.getFullYear()
        )
      )
      let presencesForWeek = 0
      let absencesForWeek = 0
      if (this.presencesByWeek!.get(weekName)) {
        presencesForWeek = this.presencesByWeek!.get(weekName)!
      }
      if (this.absencesByWeek!.get(weekName)) {
        absencesForWeek = this.absencesByWeek!.get(weekName)!
      }
      this.absenceRatesByWeek.set(
        weekName,
        this.calculateAbsentRate(presencesForWeek, absencesForWeek)
      )

      previousWeek = addOneWeek(previousWeek)
    }
  }
}

export const createSessionGroup = (sessions: Session[]) => {
  if (sessions.length === 0) {
    return undefined
  }
  return new SessionGroup(sessions)
}
