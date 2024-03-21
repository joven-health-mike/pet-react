import Session from "./Session"

export default class SessionGroup {
  constructor(public sessions: Session[]) {}
  loaded = false
  numPresences = 0
  numAbsences = 0

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
    return this.numAbsences + this.numPresences === 0
      ? 0
      : this.numAbsences / (this.numAbsences + this.numPresences)
  }

  loadMetrics(): void {
    if (this.loaded === false) {
      this.calculateMetrics()
      this.loaded = true
    }
  }

  calculateMetrics(): void {
    for (const session of this.sessions) {
      if (session.isDirect() && session.isPresent()) {
        this.numPresences++
      } else if (session.isDirect() && !session.isPresent()) {
        this.numAbsences++
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
