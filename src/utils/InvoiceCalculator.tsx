import AccountingCode from "../data/AccountingCode"
import Contractor from "../data/Contractor"
import Customer from "../data/Customer"
import InvoiceParams from "../data/InvoiceParams"
import Session from "../data/Session"

export default class InvoiceCalculator {
  constructor(
    public accountingCodes: AccountingCode[],
    public contractors: Contractor[],
    public customers: Customer[],
    public invoiceParams: InvoiceParams[],
    public sessions: Session[]
  ) {}

  calculate(): Map<Customer, SessionInfo[]> {
    const customerMap = new Map()

    for (const session of this.sessions) {
      if (session.schoolName === "Joven Health") continue

      const invoiceParams = getInvoiceParamsForName(
        this.invoiceParams,
        session.schoolName
      )
      const customer = getCustomerForName(this.customers, session.schoolName)
      if (!customerMap.has(customer)) {
        customerMap.set(customer, [])
      }

      const sessionInfo = new SessionInfo("", "", "", "", "", invoiceParams!)
      let description = session.serviceName
      if (session.presentAbsent === "Absent - No Notice") {
        description += " - Absent"
      }
      sessionInfo.lineAccountCode = getAccountingCodeForName(
        this.accountingCodes,
        description
      )!.accountCode

      description = session.serviceName
      if (session.presentAbsent === "Absent - No Notice") {
        description += " - Absent"
      }
      if (
        session.directIndirect === "Direct Service" &&
        session.schoolName.includes("Teacher")
      ) {
        description += " - Teacher"
      } else {
        description += " - Student"
      }
      sessionInfo.lineDescription = description
      sessionInfo.lineQuantity = `${parseFloat(
        minutesToHours(parseFloat(session.totalTime)).toFixed(3)
      )}`
      sessionInfo.lineRate = customer!.hourlyRate
      sessionInfo.lineAmount = `${calculateLineAmount(
        minutesToHours(parseFloat(session.totalTime)).toString(),
        sessionInfo.lineRate
      )}`

      customerMap.get(customer).push(sessionInfo)
    }

    return customerMap
  }
}

function getCustomerForName(customers: Customer[], name: string) {
  const customer = customers.find((customer) => customer.customerName === name)
  if (customer === undefined) {
    console.log("Customer not found: ", name)
  }
  return customer
}

function getInvoiceParamsForName(invoiceParams: InvoiceParams[], name: string) {
  return invoiceParams.find(
    (invoiceParam) => invoiceParam.customerName === name
  )
}

function getAccountingCodeForName(
  accountingCodes: AccountingCode[],
  name: string
) {
  return accountingCodes.find(
    (accountingCode) => accountingCode.sessionType === name
  )
}

export function calculateLineAmount(quantity: string, rate: string) {
  const quantityFloat = parseFloat(quantity)
  const rateFloat = parseFloat(rate)
  const lineAmountFloat = quantityFloat * rateFloat
  return parseFloat(lineAmountFloat.toFixed(2))
}

export function minutesToHours(minutes: number) {
  return minutes / 60
}

export class SessionInfo {
  constructor(
    public lineDescription: string,
    public lineQuantity: string,
    public lineRate: string,
    public lineAmount: string,
    public lineAccountCode: string,
    public lineInvoiceParams: InvoiceParams
  ) {}
}
