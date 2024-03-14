export default class Contractor {
  constructor(
    public counselorName: string,
    public gustoType: string,
    public tin: string,
    public gustoBizName: string,
    public gustoFEIN: string
  ) {}
}

export const createContractor = (dataArray: string[]) => {
  return new Contractor(
    dataArray[0],
    dataArray[1],
    dataArray[2],
    // wrap the biz name in quotes in case it includes a comma
    `"${dataArray[3]}"`,
    dataArray[4]
  )
}
