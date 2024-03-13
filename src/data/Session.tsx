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
    dataArray[0],
    dataArray[1],
    dataArray[2],
    dataArray[3],
    dataArray[4],
    dataArray[5],
    dataArray[6],
    dataArray[11],
    dataArray[13],
    dataArray[15],
    dataArray[16],
    dataArray[17],
    dataArray[18],
    dataArray[19]
  )
}
