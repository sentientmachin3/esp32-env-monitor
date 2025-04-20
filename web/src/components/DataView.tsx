import { Spinner } from "@heroui/spinner"
import { MainChart } from "./MainChart"
import { TimeRecord } from "@/types"

export function DataView({
  records,
  height,
}: {
  records: TimeRecord[] | undefined
  height: number
}) {
  if (records === undefined) {
    return <Spinner />
  }
  return (records as TimeRecord[]).length === 0 ? (
    <div></div>
  ) : (
    <div className="flex-1">
      <MainChart stats={records as TimeRecord[]} height={height * 0.9} />
    </div>
  )
}
