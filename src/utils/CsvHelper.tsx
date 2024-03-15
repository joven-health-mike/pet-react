export const downloadCsv = (dataStr: string, filename: string) => {
  const blob = new Blob([dataStr], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const makeCSVSafe = (input: string) => {
  // If the string contains double quotes, escape them by doubling them up
  let output = input
    .replace(/"/g, '""')
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, " ")

  // If the string contains commas, double quotes, or line breaks, enclose it within double quotes
  if (output.includes(",") || output.includes('"') || output.includes("\n")) {
    output = '"' + output + '"'
  }

  return output.trim()
}
