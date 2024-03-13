export const handleUploadData = <T,>(
  data: string[][],
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  createItem: (datum: string[]) => T
) => {
  const newData: T[] = data.slice(1).map((datum) => createItem(datum))
  setData(newData)
}
