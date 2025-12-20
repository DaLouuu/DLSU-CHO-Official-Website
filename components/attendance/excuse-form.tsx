"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AbsentForm } from "@/components/attendance/absent-form"
import { LateForm } from "@/components/attendance/late-form"
import { SteppingOutForm } from "@/components/attendance/stepping-out-form"

export function AttendanceExcuseForm() {
  const [activeTab, setActiveTab] = useState("absent")

  return (
    <Card className="border-2 border-[#09331f]/20 shadow-lg bg-white">
      <CardContent className="p-0">
        <Tabs defaultValue="absent" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none rounded-t-lg bg-[#09331f]/10">
            <TabsTrigger
              value="absent"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#09331f] data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#09331f]"
            >
              Absent
            </TabsTrigger>
            <TabsTrigger
              value="late"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#09331f] data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#09331f]"
            >
              Late
            </TabsTrigger>
            <TabsTrigger
              value="stepping-out"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#09331f] data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#09331f]"
            >
              Stepping Out
            </TabsTrigger>
          </TabsList>

          <TabsContent value="absent" className="p-6 space-y-6">
            <AbsentForm />
          </TabsContent>

          <TabsContent value="late" className="p-6 space-y-6">
            <LateForm />
          </TabsContent>

          <TabsContent value="stepping-out" className="p-6 space-y-6">
            <SteppingOutForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
