export const HEADERS =
  "*Date,*Amount,Payee,Description,Reference,Check Number\n"

export const createTransactionLine = (inputs: string[]) => {
  return `${inputs[0]},${inputs[1]},${inputs[2]},,,\n`
}
