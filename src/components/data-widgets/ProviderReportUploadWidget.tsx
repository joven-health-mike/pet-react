import React, { useEffect, useState } from "react"
import UploadDataWidget from "../widgets/UploadDataWidget"
import { handleUploadData } from "../../utils/DataProcessor"
import Session from "../../data/Session"

type ProviderReportUploadWidgetProps = {
  onSessionsLoaded: (sessions: Session[]) => void
  onSessionsCleared: () => void
  sessionFactory: (input: string[]) => Session
  sessionDataAdapter?: (input: string[][]) => string[][]
}

const ProviderReportUploadWidget: React.FC<ProviderReportUploadWidgetProps> = ({
  onSessionsLoaded,
  onSessionsCleared,
  sessionFactory,
  sessionDataAdapter,
}) => {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    if (sessions.length === 0) {
      onSessionsCleared()
    } else {
      onSessionsLoaded(sessions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length])
  return (
    <>
      <UploadDataWidget
        prompt="Provider Report"
        subPrompt="The Provider Report can be exported from either the **Session Analysis Dashboard (SAD)** or from **TeleTeachers**. Select the option that coorelates with where the data was exported from."
        button1Text={"Upload SAD Format"}
        button2Text={"Upload TeleTeachers Format"}
        enableSecondOption={true}
        onDataLoaded={(data: string[][]) => {
          handleUploadData(data, setSessions, sessionFactory)
        }}
        onDataCleared={() => {
          setSessions([])
        }}
        onData2Loaded={(data: string[][]) => {
          if (sessionDataAdapter !== undefined) {
            data = sessionDataAdapter(data)
          }
          handleUploadData(data, setSessions, sessionFactory)
        }}
        onData2Cleared={() => {
          setSessions([])
        }}
      />
    </>
  )
}

export default ProviderReportUploadWidget
