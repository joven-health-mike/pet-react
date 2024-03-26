import { formatDateStr } from "../utils/DateUtils"

export default class Session {
  constructor(
    public providerName: string,
    public districtName: string,
    public directIndirect: string,
    public serviceName: string,
    public sessionStudents: string,
    public schoolName: string,
    public notes: string,
    public presentAbsent: string,
    public date: string,
    public timeFrom: string,
    public timeTo: string,
    public planDocTime: string,
    public sessionTime: string,
    public totalTime: string
  ) {}

  isPresent(): boolean {
    return this.presentAbsent !== "Absent - No Notice"
  }

  isDirect(): boolean {
    return this.directIndirect === "Direct Service"
  }

  isTeacher(): boolean {
    return this.schoolName.includes("Teacher")
  }

  enhancedServiceName(): string {
    return `${this.serviceName}${
      this.isDirect() ? (this.isTeacher() ? " - Teacher" : " - Student") : ""
    }${this.isDirect() ? (this.isPresent() ? "" : " - Absent") : ""}`
  }

  toString(): string {
    return `${formatDateStr(this.date)} - ${this.enhancedServiceName()}: ${
      this.sessionTime
    } min`
  }
}

export const createSession = (dataArray: string[]) => {
  return new Session(
    dataArray[0].trim(),
    dataArray[1].trim(),
    dataArray[2].trim(),
    dataArray[3].trim(),
    dataArray[4].trim(),
    dataArray[5].trim(),
    dataArray[6].trim(),
    dataArray[7].trim(),
    dataArray[8].trim(),
    dataArray[9].trim(),
    dataArray[10].trim(),
    dataArray[11].trim(),
    dataArray[12].trim(),
    dataArray[13].trim()
  )
}

export function* sessionFilterGenerator(
  sessionList: Session[],
  shouldSkip: (session: Session) => boolean = () => false
) {
  for (const session of sessionList) {
    if (!shouldSkip(session)) {
      yield session
    }
  }
}

export const skipTestData = (session: Session): boolean => {
  return (
    session.providerName === "Jacek McGuinness" ||
    session.schoolName === "Joven Test District"
  )
}

export const skipAllJovenData = (session: Session): boolean => {
  return skipTestData(session) || session.schoolName === "Joven Health"
}
