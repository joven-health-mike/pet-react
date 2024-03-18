import Session from "../data/Session"

export default class NoShowRateCalculator {
  constructor(public sessions: Session[]) {}

  calculate(filter: (session: Session) => string): Map<string, number> {
    const sessionDataMap = new Map<string, number[]>()

    for (const session of this.sessions) {
      if (session.schoolName === "Joven Health") continue

      const filterValue = filter(session)
      if (!sessionDataMap.has(filterValue)) {
        sessionDataMap.set(filterValue, [0, 0])
      }
      if (session.directIndirect === "Direct Service") {
        const presentAbsentData = sessionDataMap.get(filterValue)
        if (session.presentAbsent === "Absent - No Notice") {
          sessionDataMap.set(filterValue, [
            presentAbsentData![0],
            presentAbsentData![1] + 1,
          ])
        } else {
          sessionDataMap.set(filterValue, [
            presentAbsentData![0] + 1,
            presentAbsentData![1],
          ])
        }
      }
    }

    const result = new Map<string, number>()

    for (const [filterValue, [presents, absents]] of sessionDataMap.entries()) {
      if (absents > 0) {
        const noShowRate = parseFloat(
          ((absents / (presents + absents)) * 100).toFixed(1)
        )
        result.set(filterValue, noShowRate)
      }
    }

    return result
  }
}

export const customerFilter = (session: Session) => session.schoolName
export const providerFilter = (session: Session) => session.providerName
