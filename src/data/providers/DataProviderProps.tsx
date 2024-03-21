import { ReactNode } from "react"

export type DataProviderProps<T> = {
  data: T
  children?: ReactNode | undefined
}

export type ContextData<T> = {
  data: T[]
  setData: (input: T[]) => void
}
