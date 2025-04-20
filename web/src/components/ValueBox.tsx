"use client"

import { Card, CardBody, CardHeader } from "@nextui-org/card"

export function ValueBox({
  label,
  value,
  time,
  suffix,
}: {
  label: string
  value: number | undefined
  time: string
  suffix: string
}) {
  return (
    <Card className="min-w-40 border-black rounded-md border-2 px-2 py-2">
      <CardHeader className="flex-col text-center">
        <div className="uppercase tracking-wide">{label}</div>
        <div className="font-semibold text-lg">{time}</div>
      </CardHeader>
      <CardBody className="p-2 font-bold text-5xl text-center">{`${value ?? "--"} ${suffix}`}</CardBody>
    </Card>
  )
}
