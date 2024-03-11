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
