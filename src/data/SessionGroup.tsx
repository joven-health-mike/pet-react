import Session from "./Session"
import SessionGroupData from "./SessionGroupData"

export default class SessionGroup {
  constructor(public sessions: Session[]) {}
  private loaded = false
  private sessionGroupData = new SessionGroupData()

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
      for (const session of this.sessions) {
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
