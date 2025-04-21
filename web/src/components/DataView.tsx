import { Spinner } from "@heroui/spinner"
import { MainChart } from "./MainChart"
import { TimeRecord } from "@/types"
import { GraphInterval } from "@/enums"

export function DataView({
  records,
  height,
  interval,
  meta,
}: {
  records: TimeRecord[] | undefined
  height: number
  interval: GraphInterval
  meta: { avg: { humidity: number; temperature: number } }
}) {
  if (records === undefined) {
    return <Spinner />
  }
  return (records as TimeRecord[]).length === 0 ? (
    <div className={"flex w-full justify-center items-center "}>
      <div
        className={
          "text-red-600 font-bold border-2 border-red-600 uppercase text-xl px-4 py-4"
        }
      >
        {"There are no records in the selected time frame"}
      </div>
    </div>
  ) : (
    <div className="flex-1">
      <MainChart
        stats={records as TimeRecord[]}
        interval={interval}
        meta={meta}
        height={height * 0.9}
      />
    </div>
  )
}
