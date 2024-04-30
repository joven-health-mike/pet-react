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
  const { sessions, setSessions } = useContext(SessionsContext)

  return (
    <>
      <UploadDataWidget
        prompt="Provider Report"
        subPrompt="The Provider Report can be exported from **TeleTeachers**. Upload the file here."
        enableSecondOption={false}
        hasData={sessions.length > 0}
        onDataLoaded={(data: string[][]) => {
          handleUploadDataNew(data, setSessions, createSession)
        }}
        onDataCleared={() => {
          setSessions([])
        }}
      />
    </>
  )
}

export default ProviderReportUploadWidget
