export const handleUploadData = <T,>(
  data: string[][],
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  createItem: (datum: string[]) => T
) => {
  // call factory method on every item, skipping the 1st line of headers
  const newData: T[] = data.slice(1).map((datum) => createItem(datum))
  setData(newData)
}
