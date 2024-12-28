"use client"

import { UnitStatus } from "@/enums"
import { UnitConnectionStatus } from "@/types"
import { DATETIME_FORMAT } from "@/utils"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import moment from "moment"

export function StatusBox({
  unitStatus,
}: {
  unitStatus: UnitConnectionStatus
}) {
  const unitStatusStyles = () => {
    if (unitStatus.status === UnitStatus.OFFLINE) {
      return "border-red-600 bg-red-600"
    } else {
      return "border-lime-500 bg-lime-500"
    }
  }
  return (
    <Card
      className={`min-w-40  ${unitStatusStyles()} text-white rounded-md border-2 px-2 py-2`}
    >
      <CardHeader className="flex-col text-center">
        <p className={`uppercase tracking-wide ${unitStatusStyles()}`}>
          {"Last update"}
        </p>
        <small className="font-semibold text-lg">
          {unitStatus.lastUpdate
            ? moment.unix(unitStatus.lastUpdate).format(DATETIME_FORMAT)
            : "--/--/-- --:--:--"}
        </small>
      </CardHeader>
      <CardBody
        className={`${unitStatusStyles()} p-2 font-bold text-3xl text-center`}
      >
        {unitStatus.status}
      </CardBody>
    </Card>
  )
}
