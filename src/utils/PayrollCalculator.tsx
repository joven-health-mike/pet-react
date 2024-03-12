import Contractor from "../data/Contractor"
import Session from "../data/Session"

export default class PayrollCalculator {
  constructor(public contractors: Contractor[], public sessions: Session[]) {}

  calculate(): Map<string, ContractorTime> {
    const counselorMap = new Map()

    for (const session of this.sessions) {
      const providerName = session.providerName
      if (!counselorMap.has(providerName)) {
        counselorMap.set(providerName, new ContractorTime(0, 0, 0, 0))
      }
      if (
        session.directIndirect === "Direct Service" &&
        session.presentAbsent === "Present"
      ) {
        counselorMap.get(providerName).directTime += parseFloat(
          session.totalTime
        )
        counselorMap.get(providerName).adminTime +=
          parseFloat(session.totalTime) * 0.2
      } else if (
        session.directIndirect === "Direct Service" &&
        session.presentAbsent === "Absent - No Notice"
      ) {
        counselorMap.get(providerName).noShowTime += parseFloat(
          session.totalTime
        )
      } else if (session.directIndirect === "InDirect Service") {
        counselorMap.get(providerName).indirectTime += parseFloat(
          session.totalTime
        )
      }
    }

    return counselorMap
  }
}

function minutesToHours(minutes: number) {
  const hours = minutes / 60
  return parseFloat(hours.toFixed(3))
}

export class ContractorTime {
  constructor(
    public directTime: number,
    public adminTime: number,
    public noShowTime: number,
    public indirectTime: number
  ) {}

  totalHours(): number {
    return minutesToHours(this.totalMinutes())
  }

  totalMinutes(): number {
    return (
      this.directTime + this.adminTime + this.noShowTime + this.indirectTime
    )
  }
}
