import Session, { sessionFilterGenerator } from "./Session"
import SessionGroup, { createSessionGroup } from "./SessionGroup"

export default class SessionGroups {
  constructor(public sessions: Map<string, SessionGroup>) {}
  private groupNames: string[] = []

  getNames(): string[] {
    if (this.groupNames.length === 0) {
      this.groupNames = [...this.sessions.keys()].sort()
    }
    return this.groupNames
  }

  getSessionGroupForName(name: string): SessionGroup | undefined {
    return this.sessions.get(name)
  }

  *[Symbol.iterator](): IterableIterator<SessionGroup> {
    for (const sessionGroup of this.sessions.values()) {
      yield sessionGroup
    }
  }
}

export const createSessionGroups = (
  allSessions: Session[],
  nameFilter: (session: Session) => string,
  sessionSkipper: Generator<Session, void, unknown> = sessionFilterGenerator(
    allSessions
  )
) => {
  if (allSessions.length === 0) return undefined

  const newSessions: Map<string, Session[]> = new Map()
  const newNames: Set<string> = new Set()

  for (const nextSession of sessionSkipper) {
    const name = nameFilter(nextSession)
    newNames.add(name)
    const newSessionsValue = newSessions.get(name) ?? []
    newSessionsValue.push(nextSession)
    newSessions.set(name, newSessionsValue)
  }
  const result: Map<string, SessionGroup> = new Map()
  for (const name of newNames) {
    result.set(name, createSessionGroup(name, newSessions.get(name)!)!)
  }

  return new SessionGroups(result)
}
