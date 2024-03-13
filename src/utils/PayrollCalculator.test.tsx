/**
 * @jest-environment jsdom
 */
/* eslint-disable testing-library/prefer-screen-queries */

import { MOCK_CONTRACTORS } from "../test/MockContractors"
import { MOCK_SESSIONS } from "../test/MockSessions"
import PayrollCalculator from "./PayrollCalculator"

const ADMIN_BONUS = 0.2 // 20%

const NUM_PROVIDERS = new Set(
  MOCK_SESSIONS.map((session) => {
    return session.providerName
  })
).size

const DIRECT_TIMES = [80, 30]
const ADMIN_TIMES = DIRECT_TIMES.map((time) => time * ADMIN_BONUS)
const NO_SHOW_TIMES = [30, 0]
const INDIRECT_TIMES = [30, 45]
const TOTAL_MINUTES = [156, 81]
const TOTAL_HOURS = TOTAL_MINUTES.map((time) => time / 60)

describe("Payroll Calculator", () => {
  const createPayrollCalculator = () => {
    return new PayrollCalculator(MOCK_CONTRACTORS, MOCK_SESSIONS)
  }

  it("should calculate number of providers", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    expect(payrollMap.size).toEqual(NUM_PROVIDERS)
  })
  it("should calculate direct time", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    let i = 0
    for (const expectedTime of DIRECT_TIMES) {
      const mockContractor = MOCK_CONTRACTORS[i]
      let directTime = payrollMap.get(mockContractor)!.directTime
      expect(expectedTime).toEqual(directTime)
      i++
    }
  })
  it("should calculate admin time", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    let i = 0
    for (const expectedTime of ADMIN_TIMES) {
      const mockContractor = MOCK_CONTRACTORS[i]
      let adminTime = payrollMap.get(mockContractor)!.adminTime
      expect(expectedTime).toEqual(adminTime)
      i++
    }
  })
  it("should calculate no-show time", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    let i = 0
    for (const expectedTime of NO_SHOW_TIMES) {
      const mockContractor = MOCK_CONTRACTORS[i]
      let noShowTime = payrollMap.get(mockContractor)!.noShowTime
      expect(expectedTime).toEqual(noShowTime)
      i++
    }
  })
  it("should calculate indirect time", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    let i = 0
    for (const expectedTime of INDIRECT_TIMES) {
      const mockContractor = MOCK_CONTRACTORS[i]
      let indirectTime = payrollMap.get(mockContractor)!.indirectTime
      expect(expectedTime).toEqual(indirectTime)
      i++
    }
  })
  it("should calculate total minutes", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    let i = 0
    for (const expectedTime of TOTAL_MINUTES) {
      const mockContractor = MOCK_CONTRACTORS[i]
      let totalMinutes = payrollMap.get(mockContractor)!.totalMinutes()
      expect(expectedTime).toEqual(totalMinutes)
      i++
    }
  })
  it("should calculate total hours", () => {
    const payrollCalculator = createPayrollCalculator()
    const payrollMap = payrollCalculator.calculate()
    let i = 0
    for (const expectedTime of TOTAL_HOURS) {
      const mockContractor = MOCK_CONTRACTORS[i]
      let totalHours = payrollMap.get(mockContractor)!.totalHours()
      expect(expectedTime).toEqual(totalHours)
      i++
    }
  })
})
