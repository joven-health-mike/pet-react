import Customer from "../data/Customer"

export const INVOICE_SUMMARY_HEADERS =
  "customer_name,invoice_total,hours_delivered\n"

export const createInvoiceSummaryLine = (
  customer: Customer,
  invoiceTotal: string,
  totalHours: string
) => {
  return `${customer.customerName},${invoiceTotal},${totalHours}\n`
}
