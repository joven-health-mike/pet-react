export default class InvoiceParams {
  constructor(
    public customerName: string,
    public invoiceNumber: string,
    public reference: string,
    public invoiceDate: string,
    public dueDate: string
  ) {}
}
