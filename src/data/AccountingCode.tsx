export default class AccountingCode {
  constructor(public sessionType: string, public accountCode: string) {}
}

export const createAccountingCode = (dataArray: string[]) => {
  return new AccountingCode(dataArray[0], dataArray[1])
}
