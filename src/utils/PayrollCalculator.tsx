import Contractor from "../data/Contractor"
import Session from "../data/Session"

export default class PayrollCalculator {
  constructor(public contractors: Contractor[], public sessions: Session[]) {}

  calculate(): Map<Contractor, ContractorTime> {
    const counselorMap = new Map()

    for (const session of this.sessions) {
      const contractor = getContractorForName(
        this.contractors,
        session.providerName
      )
      if (!counselorMap.has(contractor)) {
        counselorMap.set(contractor, new ContractorTime(0, 0, 0, 0))
      }
      if (session.isDirect() && session.isPresent()) {
        counselorMap.get(contractor).directTime += parseFloat(session.totalTime)
        counselorMap.get(contractor).adminTime +=
          parseFloat(session.totalTime) * 0.2
      } else if (session.isDirect() && !session.isPresent()) {
        counselorMap.get(contractor).noShowTime += parseFloat(session.totalTime)
      } else if (session.directIndirect === "InDirect Service") {
        counselorMap.get(contractor).indirectTime += parseFloat(
          session.totalTime
        )
      }
    }

    return counselorMap
  }
}

function getContractorForName(contractors: Contractor[], name: string) {
  return contractors.find((contractor) => contractor.counselorName === name)
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
