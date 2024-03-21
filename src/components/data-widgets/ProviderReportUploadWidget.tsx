import React, { useContext } from "react"
import UploadDataWidget from "../widgets/UploadDataWidget"
import { handleUploadDataNew } from "../../utils/DataProcessor"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { createSession } from "../../data/Session"

type ProviderReportUploadWidgetProps = {
  sessionDataAdapter?: (input: string[][]) => string[][]
}

const ProviderReportUploadWidget: React.FC<ProviderReportUploadWidgetProps> = ({
  sessionDataAdapter,
}) => {
  const { setData: setSessions } = useContext(SessionsContext)

  return (
    <>
      <UploadDataWidget
        prompt="Provider Report"
        subPrompt="The Provider Report can be exported from either the **Session Analysis Dashboard (SAD)** or from **TeleTeachers**. Select the option that coorelates with where the data was exported from."
        button1Text={"Upload SAD Format"}
        button2Text={"Upload TeleTeachers Format"}
        enableSecondOption={true}
        onDataLoaded={(data: string[][]) => {
          handleUploadDataNew(data, setSessions, createSession)
        }}
        onDataCleared={() => {
          setSessions([])
        }}
        onData2Loaded={(data: string[][]) => {
          if (sessionDataAdapter !== undefined) {
            data = sessionDataAdapter(data)
          }
          handleUploadDataNew(data, setSessions, createSession)
        }}
        onData2Cleared={() => {
          setSessions([])
        }}
      />
    </>
  )
}

export default ProviderReportUploadWidget
