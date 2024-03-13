export default class InvoiceParams {
  constructor(
    public customerName: string,
    public invoiceNumber: string,
    public reference: string,
    public invoiceDate: string,
    public dueDate: string
  ) {}
}

export const createInvoiceParams = (dataArray: string[]) => {
  return new InvoiceParams(
    dataArray[0],
    dataArray[1],
    dataArray[2],
    dataArray[3],
    dataArray[4]
  )
}
