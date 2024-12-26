import { DATETIME_FORMAT } from "@/utils"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Moment } from "moment"

export function ValueBox({
  label,
  value,
  moment,
  suffix,
}: {
  label: string
  value: number
  moment: Moment
  suffix: string
}) {
  return (
    <Card className="min-w-40 border-black rounded-md border-2 px-2 py-2">
      <CardHeader className="flex-col text-center">
        <p className="uppercase tracking-wide">{label}</p>
        <small className="font-semibold text-lg">
          {moment.format(DATETIME_FORMAT)}
        </small>
      </CardHeader>
      <CardBody className="p-2 font-bold text-5xl text-center">{`${value} ${suffix}`}</CardBody>
    </Card>
  )
}
