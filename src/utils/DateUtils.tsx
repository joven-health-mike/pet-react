export const todaysDate = () => {
  const today = new Date()

  // Get the current year, month, and day
  const year = today.getFullYear()
  const month = today.getMonth() + 1 // Months are zero-indexed, so we add 1
  const day = today.getDate()

  // Format the date as MM/DD/YYYY
  return (
    (month < 10 ? "0" : "") +
    month +
    "/" +
    (day < 10 ? "0" : "") +
    day +
    "/" +
    year
  )
}
