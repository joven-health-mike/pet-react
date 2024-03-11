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
