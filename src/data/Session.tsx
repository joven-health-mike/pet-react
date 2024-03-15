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
    dataArray[11].trim(),
    dataArray[13].trim(),
    dataArray[15].trim(),
    dataArray[16].trim(),
    dataArray[17].trim(),
    dataArray[18].trim(),
    dataArray[19].trim()
  )
}
