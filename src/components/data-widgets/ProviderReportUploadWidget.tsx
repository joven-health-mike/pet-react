import React, { useContext } from "react"
import UploadDataWidget from "../widgets/UploadDataWidget"
import { handleUploadDataNew } from "../../utils/DataProcessor"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { createSession } from "../../data/Session"
import { adaptTeleTeachersData } from "../../utils/TeleTeachersAdapter"

type ProviderReportUploadWidgetProps = {
  sessionDataAdapter?: (input: string[][]) => string[][]
}

const ProviderReportUploadWidget: React.FC<ProviderReportUploadWidgetProps> = ({
  sessionDataAdapter = adaptTeleTeachersData,
}) => {
  const { allSessions: sessions, setAllSessions: setSessions } =
    useContext(SessionsContext)

  return (
    <>
      <UploadDataWidget
        prompt="Provider Report"
        subPrompt="The Provider Report can be exported from either the **Session Analysis Dashboard (SAD)** or from **TeleTeachers**. Select the option that coorelates with where the data was exported from."
        button1Text={"Upload SAD Format"}
        button2Text={"Upload TeleTeachers Format"}
        enableSecondOption={true}
        hasData={sessions.length > 0}
        onDataLoaded={(data: string[][]) => {
          handleUploadDataNew(data, setSessions, createSession)
        }}
        onDataCleared={() => {
          setSessions([])
        }}
        onData2Loaded={(data: string[][]) => {
          data = sessionDataAdapter ? sessionDataAdapter(data) : data
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
