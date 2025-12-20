"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExcuseDetailView } from "@/components/admin/excuse-detail-view"
import Link from "next/link"

// Update the mockExcuses array to match the format in the image
const mockExcuses = [
  {
    id: "1",
    name: "Tralalero Tralala",
    voiceSection: "alto",
    voiceNumber: 1,
    type: "ABSENT",
    date: new Date(2025, 4, 8), // September 21, 2025
  },
  {
    id: "2",
    name: "Tung Tung Tung Sahur",
    voiceSection: "tenor",
    voiceNumber: 1,
    type: "ABSENT",
    date: new Date(2025, 4, 6), // September 21, 2025
  },
  {
    id: "3",
    name: "Tenorino Cappuccino",
    voiceSection: "tenor",
    voiceNumber: 1,
    type: "ABSENT",
    date: new Date(2025, 4, 7), // September 21, 2025
  },
  {
    id: "4",
    name: "Dana Guillarte",
    voiceSection: "soprano",
    voiceNumber: 1,
    type: "ABSENT",
    date: new Date(2025, 4, 8), // September 22, 2025
  },
  {
    id: "5",
    name: "Marian Ariaga",
    voiceSection: "alto",
    voiceNumber: 2,
    type: "LATE",
    date: new Date(2025, 4, 9), // September 23, 2025
  },
  {
    id: "6",
    name: "Kean Genota",
    voiceSection: "bass",
    voiceNumber: 2,
    type: "ABSENT",
    date: new Date(2025, 4, 7), // September 24, 2025
  },
]

export default function AttendanceOverviewPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDate, setSelectedDate] = useState(today)
  const [currentWeek, setCurrentWeek] = useState(
    eachDayOfInterval({
      start: startOfWeek(today, { weekStartsOn: 0 }),
      end: endOfWeek(today, { weekStartsOn: 0 }),
    }),
  )
  const [activeVoice, setActiveVoice] = useState("all")
  const [selectedExcuse, setSelectedExcuse] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Update week when navigating
  const navigateWeek = (direction) => {
    if (direction === "next") {
      const nextWeekStart = addWeeks(currentWeek[0], 1)
      const nextWeekEnd = addWeeks(currentWeek[6], 1)
      setCurrentWeek(eachDayOfInterval({ start: nextWeekStart, end: nextWeekEnd }))
    } else {
      const prevWeekStart = subWeeks(currentWeek[0], 1)
      const prevWeekEnd = subWeeks(currentWeek[6], 1)
      setCurrentWeek(eachDayOfInterval({ start: prevWeekStart, end: prevWeekEnd }))
    }
  }

  // Get excuses for the selected date and filter by voice section
  const getFilteredExcuses = () => {
    return mockExcuses.filter(
      (excuse) =>
        isSameDay(excuse.date, selectedDate) && (activeVoice === "all" || excuse.voiceSection === activeVoice),
    )
  }

  // Count excuses for each day in the week
  const getExcuseCountForDay = (day) => {
    return mockExcuses.filter((excuse) => isSameDay(excuse.date, day)).length
  }

  // View excuse details
  const viewExcuseDetails = (excuse) => {
    setSelectedExcuse(excuse)
    setIsDetailOpen(true)
  }

  // Get day abbreviation
  const getDayAbbreviation = (day) => {
    const dayNames = ["S", "M", "T", "W", "Th", "F", "S"]
    return dayNames[day.getDay()]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <PageHeader />

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-4xl">
            {/* Dashboard Navigation */}
            <DashboardNav isAdmin={true} />

            {/* Page title */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#09331f] md:text-3xl">View Attendance Excuses</h1>

              <Button asChild className="bg-[#09331f] hover:bg-[#09331f]/90">
                <Link href="/admin/excuse-approval">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Excuse Approval
                </Link>
              </Button>
            </div>

            {/* Calendar Navigation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateWeek("prev")}
                  className="rounded-full hover:bg-gray-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <span className="text-sm font-medium text-gray-600">{format(currentWeek[0], "MMM yyyy")}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateWeek("next")}
                  className="rounded-full hover:bg-gray-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {currentWeek.map((day) => {
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, today)
                  const excuseCount = getExcuseCountForDay(day)

                  return (
                    <Button
                      key={day.toString()}
                      variant="outline"
                      className={`
                        flex flex-col items-center justify-center p-2 h-auto aspect-square relative
                        ${isSelected ? "bg-[#09331f] text-white hover:bg-[#09331f]/90" : ""}
                        ${isToday && !isSelected ? "border-[#09331f] border-2" : ""}
                        ${isToday && isSelected ? "bg-[#09331f] text-white" : ""}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className="text-xs font-medium">{getDayAbbreviation(day)}</span>
                      <span className="text-lg font-bold">{format(day, "d")}</span>
                      {isToday && (
                        <span className="absolute top-1 right-1 text-[10px] font-medium px-1 rounded-sm bg-white text-[#09331f]">
                          Today
                        </span>
                      )}
                      {excuseCount > 0 && (
                        <Badge
                          className={`mt-1 text-xs ${isSelected ? "bg-white text-[#09331f]" : "bg-[#09331f] text-white"}`}
                        >
                          {excuseCount}
                        </Badge>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Excuses Panel */}
            <Card className="shadow-md border-gray-200">
              <CardHeader className="bg-gray-100 rounded-t-lg pb-3">
                <CardTitle className="text-xl font-bold text-[#09331f]">
                  {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>

              {/* Voice Filter */}
              <div className="px-4 pt-4">
                <Tabs defaultValue="all" value={activeVoice} onValueChange={setActiveVoice}>
                  <TabsList className="grid grid-cols-5 w-full bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-[#09331f] data-[state=active]:text-white"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="soprano"
                      className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                    >
                      Soprano
                    </TabsTrigger>
                    <TabsTrigger
                      value="alto"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                    >
                      Alto
                    </TabsTrigger>
                    <TabsTrigger
                      value="tenor"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Tenor
                    </TabsTrigger>
                    <TabsTrigger
                      value="bass"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      Bass
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Update the CardContent section to match the simpler format in the image */}
              <CardContent className="pt-4">
                {getFilteredExcuses().length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredExcuses().map((excuse) => (
                      <div
                        key={excuse.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/images/profile-1.jpg" alt={excuse.name} />
                            <AvatarFallback>{excuse.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="font-medium text-gray-900">{excuse.name}</h3>
                            <div className="text-sm text-gray-500 capitalize">
                              {excuse.voiceSection} {excuse.voiceNumber}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{excuse.type}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewExcuseDetails(excuse)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No excuses for this date.</p>
                  </div>
                )}

                {getFilteredExcuses().length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200 text-center text-sm text-gray-500">
                    End of List
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <PageFooter />
      </div>

      {/* Excuse Detail Dialog */}
      {selectedExcuse && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Excuse Details</DialogTitle>
            </DialogHeader>
            <ExcuseDetailView excuse={selectedExcuse} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
