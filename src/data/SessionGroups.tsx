import Session, { sessionFilterGenerator } from "./Session"
import SessionGroup, { createSessionGroup } from "./SessionGroup"

export default class SessionGroups {
  constructor(public sessions: Map<string, SessionGroup>) {}
  private groupNames: string[] = []

  getSessionGroupForName(name: string): SessionGroup | undefined {
    return this.sessions.get(name)
  }

  *names(): IterableIterator<string> {
    const sortedKeys = [...this.sessions.keys()].sort()
    for (const name of sortedKeys) {
      yield name
    }
  }

  *[Symbol.iterator](): IterableIterator<SessionGroup> {
    for (const sessionGroup of this.sessions.values()) {
      yield sessionGroup
    }
  }
}

export const createEmptySessionGroups = () =>
  new SessionGroups(new Map<string, SessionGroup>())

export const createSessionGroups = (
  allSessions: Session[],
  nameFilter: (session: Session) => string,
  sessionSkipper: Generator<Session, void, unknown> = sessionFilterGenerator(
    allSessions
  )
) => {
  if (allSessions.length === 0) return createEmptySessionGroups()

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
