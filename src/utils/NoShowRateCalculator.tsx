import Session from "../data/Session"

export default class NoShowRateCalculator {
  constructor(public sessions: Session[]) {}

  calculate(): Map<string, number> {
    const sessionDataMap = new Map<string, number[]>()

    for (const session of this.sessions) {
      if (session.schoolName === "Joven Health") continue

      const customerName = session.schoolName
      if (!sessionDataMap.has(customerName)) {
        sessionDataMap.set(customerName, [0, 0])
      }
      if (session.directIndirect === "Direct Service") {
        const presentAbsentData = sessionDataMap.get(customerName)
        if (session.presentAbsent === "Absent - No Notice") {
          sessionDataMap.set(customerName, [
            presentAbsentData![0],
            presentAbsentData![1] + 1,
          ])
        } else {
          sessionDataMap.set(customerName, [
            presentAbsentData![0] + 1,
            presentAbsentData![1],
          ])
        }
      }
    }

    const result = new Map<string, number>()

    for (const [
      customerName,
      [presents, absents],
    ] of sessionDataMap.entries()) {
      if (absents > 0) {
        const noShowRate = parseFloat(
          ((absents / (presents + absents)) * 100).toFixed(1)
        )
        result.set(customerName, noShowRate)
      }
    }

    return result
  }
}
