/**
 * @jest-environment jsdom
 */
/* eslint-disable testing-library/prefer-screen-queries */

import { MOCK_ACCOUNTING_CODES } from "../test/MockAccountingCodes"
import { MOCK_CONTRACTORS } from "../test/MockContractors"
import { MOCK_CUSTOMERS } from "../test/MockCustomers"
import { MOCK_INVOICE_PARAMS } from "../test/MockInvoiceParams"
import { MOCK_SESSIONS } from "../test/MockSessions"
import InvoiceCalculator, {
  calculateLineAmount,
  minutesToHours,
} from "./InvoiceCalculator"

const NUM_CUSTOMERS = new Set(
  MOCK_SESSIONS.map((session) => {
    return session.schoolName
  })
).size

describe("Invoice Calculator", () => {
  const createInvoiceCalculator = () => {
    return new InvoiceCalculator(
      MOCK_ACCOUNTING_CODES,
      MOCK_CONTRACTORS,
      MOCK_CUSTOMERS,
      MOCK_INVOICE_PARAMS,
      MOCK_SESSIONS
    )
  }

  it("should calculate number of customers", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    expect(invoiceMap.size).toEqual(NUM_CUSTOMERS)
  })
  it("should determine line description - present", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    expect(MOCK_SESSIONS[0].serviceName).toEqual(
      invoiceMap.get(MOCK_CUSTOMERS[0])![0].lineDescription
    )
  })
  it("should determine line description - absent", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    expect(MOCK_SESSIONS[3].serviceName + " - Absent").toEqual(
      invoiceMap.get(MOCK_CUSTOMERS[0])![3].lineDescription
    )
  })
  it("should determine line quantity", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    const quantity = invoiceMap.get(MOCK_CUSTOMERS[0])![0].lineQuantity
    expect("0.333").toEqual(quantity)
  })
  it("should determine line rate", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    const lineRate = invoiceMap.get(MOCK_CUSTOMERS[0])![0].lineRate
    expect("150.0").toEqual(lineRate)
  })
  it("should determine line amount", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    const lineAmount = invoiceMap.get(MOCK_CUSTOMERS[0])![0].lineAmount
    expect("50").toEqual(lineAmount)
  })
  it("should determine line account code", () => {
    const invoiceCalculator = createInvoiceCalculator()
    const invoiceMap = invoiceCalculator.calculate()
    const lineAccountCode = invoiceMap.get(MOCK_CUSTOMERS[0])![0]
      .lineAccountCode
    expect("0").toEqual(lineAccountCode)
  })
  it("test calculateLineAmount", () => {
    const lineAmount = calculateLineAmount("20", "150")
    expect(20.0 * 150.0).toEqual(lineAmount)
  })
  it("test minutesToHours", () => {
    const result = minutesToHours(20)
    expect(1 / 3).toEqual(result)
  })
})
