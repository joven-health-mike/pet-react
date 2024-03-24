import { compareDates } from "../utils/DateUtils"
import Session from "./Session"
import SessionGroupData from "./SessionGroupData"

export default class SessionGroup {
  constructor(public sessions: Session[]) {}
  private loaded = false
  private sessionGroupData = new SessionGroupData()

  totalHours(month?: string): number {
    this.loadMetrics()
    if (month !== undefined) {
      const hours = this.sessionGroupData.hoursByMonth.get(month) || 0
      return hours
    } else {
      return parseFloat((this.sessionGroupData.numMinutes / 60).toFixed(3))
    }
  }

  presences(): number {
    this.loadMetrics()
    return this.sessionGroupData.numPresences
  }

  absences(): number {
    this.loadMetrics()
    return this.sessionGroupData.numAbsences
  }

  absentRate(): number {
    this.loadMetrics()
    return this.sessionGroupData.absentRate
  }

  noShowRatesByMonth(): Map<string, number> {
    this.loadMetrics()
    return this.sessionGroupData.absenceRatesByMonth
  }

  noShowRatesByWeek(): Map<string, number> {
    this.loadMetrics()
    return this.sessionGroupData.absenceRatesByWeek
  }

  private loadMetrics(): void {
    if (this.loaded === false) {
      const sortedSessions = [...this.sessions]
      sortedSessions.sort((a: Session, b: Session) => {
        return compareDates(new Date(a.date), new Date(b.date))
      })
      for (const session of sortedSessions) {
        this.sessionGroupData.processNewSession(session)
      }
      this.sessionGroupData.finalize()
      this.loaded = true
    }
  }
}

export const createSessionGroup = (sessions: Session[]) => {
  if (sessions.length === 0) {
    return undefined
  }
  return new SessionGroup(sessions)
}
