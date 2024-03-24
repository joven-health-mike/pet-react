import Contractor from "../data/Contractor"
import { ContractorTime } from "../utils/PayrollCalculator"

export const PAYROLL_SUMMARY_HEADERS =
  "contractor_name,direct_hours,admin_hours,no_show_hours,indirect_hours,total_hours\n"

export const createPayrollSummaryLine = (
  contractor: Contractor,
  totalHours: ContractorTime
) => {
  return `${contractor.counselorName},${(totalHours.directTime / 60).toFixed(
    3
  )},${(totalHours.adminTime / 60).toFixed(3)},${(
    totalHours.noShowTime / 60
  ).toFixed(3)},${(totalHours.indirectTime / 60).toFixed(3)},${totalHours
    .totalHours()
    .toString()}\n`
}
