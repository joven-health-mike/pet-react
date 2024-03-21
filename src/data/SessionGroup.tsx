import { MONTH_NAMES, getMonthName } from "../utils/DateUtils"
import Session from "./Session"

export default class SessionGroup {
  constructor(public sessions: Session[]) {}
  private loaded = false
  private numPresences = 0
  private numAbsences = 0
  private presencesByMonth: Map<string, number> | undefined = undefined
  private absencesByMonth: Map<string, number> | undefined = undefined

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
    const noShowRates = new Map<string, number>()
    for (const monthName of MONTH_NAMES) {
      let presencesForMonth = 0
      let absencesForMonth = 0
      if (this.presencesByMonth!.get(monthName)) {
        presencesForMonth = this.presencesByMonth!.get(monthName)!
      }
      if (this.absencesByMonth!.get(monthName)) {
        absencesForMonth = this.absencesByMonth!.get(monthName)!
      }
      noShowRates.set(
        monthName,
        this.calculateAbsentRate(presencesForMonth, absencesForMonth)
      )
    }

    return noShowRates
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
    for (const session of this.sessions) {
      const month = getMonthName(new Date(session.date))

      if (session.isDirect() && session.isPresent()) {
        this.numPresences++
        if (!this.presencesByMonth.has(month)) {
          this.presencesByMonth.set(month, 0)
        }
        this.presencesByMonth.set(month, this.presencesByMonth.get(month)! + 1)
      } else if (session.isDirect() && !session.isPresent()) {
        this.numAbsences++
        if (!this.absencesByMonth.has(month)) {
          this.absencesByMonth.set(month, 0)
        }
        this.absencesByMonth.set(month, this.absencesByMonth.get(month)! + 1)
      }
    }
  }
}

export const createSessionGroup = (sessions: Session[]) => {
  if (sessions.length === 0) {
    return undefined
  }
  return new SessionGroup(sessions)
}
