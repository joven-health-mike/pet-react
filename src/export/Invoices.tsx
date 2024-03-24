import Customer from "../data/Customer"
import { SessionInfo } from "../utils/InvoiceCalculator"

export const INVOICE_HEADERS =
  "ContactName,EmailAddress,POAddressLine1,POAddressLine2,POAddressLine3,POAddressLine4,POCity,PORegion,POPostalCode,POCountry,SAAddressLine1,SAAddressLine2,SAAddressLine3,SAAddressLine4,SACity,SARegion,SAPostalCode,SACountry,InvoiceNumber,Reference,InvoiceDate,DueDate,PlannedDate,Total,TaxTotal,InvoiceAmountPaid,InvoiceAmountDue,InventoryItemCode,Description,Quantity,UnitAmount,Discount,LineAmount,AccountCode,TaxType,TaxAmount,TrackingName1,TrackingOption1,TrackingName2,TrackingOption2,Currency,Type,Sent,Status\n"

export const createInvoiceLine = (
  customer: Customer,
  sessionInfo: SessionInfo,
  invoiceTotalStr: string
) => {
  return `${customer.xeroName},${customer.email},${customer.address1},${customer.address2},${customer.address3},${customer.address4},${customer.city},${customer.state},${customer.zip},${customer.country},${customer.address1},${customer.address2},${customer.address3},${customer.address4},${customer.city},${customer.state},${customer.zip},${customer.country},${sessionInfo.lineInvoiceParams.invoiceNumber},${sessionInfo.lineInvoiceParams.reference},${sessionInfo.lineInvoiceParams.invoiceDate},${sessionInfo.lineInvoiceParams.dueDate},,${invoiceTotalStr},0,0,${invoiceTotalStr},,${sessionInfo.lineDescription},${sessionInfo.lineQuantity},${sessionInfo.lineRate},,${sessionInfo.lineAmount},${sessionInfo.lineAccountCode},Tax Exempt,,,,,,USD,Sales Invoice,,Draft\n`
}
