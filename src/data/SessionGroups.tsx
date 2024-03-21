import Session from "./Session"
import SessionGroup, { createSessionGroup } from "./SessionGroup"

export default class SessionGroups {
  constructor(public sessions: Map<string, SessionGroup>) {}
  groupNames: string[] = []

  getNames(): string[] {
    if (this.groupNames.length === 0) {
      this.groupNames = [...this.sessions.keys()].sort()
    }
    return this.groupNames
  }

  getSessionGroupForName(name: string): SessionGroup | undefined {
    return this.sessions.get(name)
  }
}

export const createSessionGroups = (
  allSessions: Session[],
  nameFilter: (session: Session) => string
) => {
  if (allSessions.length === 0) return undefined

  const newSessions: Map<string, Session[]> = new Map()
  const newNames: Set<string> = new Set()

  for (const session of allSessions) {
    const name = nameFilter(session)
    newNames.add(name)
    if (!newSessions.has(name)) {
      newSessions.set(name, [])
    }

    newSessions.get(name)!.push(session)
  }
  const result: Map<string, SessionGroup> = new Map()
  for (const name of newNames) {
    result.set(name, createSessionGroup(newSessions.get(name)!)!)
  }

  return new SessionGroups(result)
}
