export default class Customer {
  constructor(
    public customerName: string,
    public xeroName: string,
    public email: string,
    public address1: string,
    public address2: string,
    public address3: string,
    public address4: string,
    public city: string,
    public state: string,
    public zip: string,
    public country: string,
    public hourlyRate: string
  ) {}
}

export const createCustomer = (dataArray: string[]) => {
  return new Customer(
    dataArray[0],
    dataArray[1],
    dataArray[2],
    dataArray[3],
    dataArray[4],
    dataArray[5],
    dataArray[6],
    dataArray[7],
    dataArray[8],
    dataArray[9],
    dataArray[10],
    dataArray[11]
  )
}
