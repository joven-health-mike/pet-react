import Session from "../data/Session"
import { makeCSVSafe } from "../utils/CsvHelper"

export const SAD_HEADERS =
  "Provider Name,District Name,Direct/InDirect,Service Name,Session Students,School,Notes,Present/Absent,Date,Time From,Time To,Plan/Doc Time,Session Time,Total Time,Month\n"

export const createSadLine = (session: Session) => {
  return `${session.providerName},${session.districtName},${
    session.directIndirect
  },${session.serviceName},"${session.sessionStudents}",${
    session.schoolName
  },${makeCSVSafe(session.notes)},${makeCSVSafe(session.presentAbsent)},${
    session.date
  },${session.timeFrom},${session.timeTo},${session.planDocTime},${
    session.sessionTime
  },${session.totalTime},\n`
}
