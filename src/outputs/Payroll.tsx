import Contractor from "../data/Contractor"

export const HEADERS =
  "contractor_type,first_name,last_name,ssn,business_name,ein,memo,hours_worked,wage,reimbursement,bonus,invoice_number\n"

export const createPayrollLine = (
  contractor: Contractor,
  totalHours: string
) => {
  const [firstName, lastName] = contractor.counselorName.split(" ")
  return `${contractor.gustoType},${firstName},${lastName},${contractor.tin},${contractor.gustoBizName},${contractor.gustoFEIN},,${totalHours},,,,N/A\n`
}
