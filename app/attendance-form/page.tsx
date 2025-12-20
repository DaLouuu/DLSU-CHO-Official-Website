"use client"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { AttendanceExcuseForm } from "@/components/attendance/excuse-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AttendanceExcusePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col">
        <PageHeader />

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center p-4">
          <div className="w-full max-w-4xl">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/attendance-overview">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
          </div>

          <div className="w-full max-w-md">
            <div className="flex flex-col items-center space-y-4 text-center mb-6">
              <Image
                src="/images/dlsu-chorale-logo.png"
                alt="DLSU Chorale Logo"
                width={120}
                height={160}
                className="mb-2"
              />
              <h1 className="text-3xl font-bold tracking-tight text-[#09331f]">Attendance Excuse Form</h1>
              <p className="text-sm text-[#1B1B1B]">Submit your excuse for absence or tardiness</p>
            </div>

            <AttendanceExcuseForm />
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  )
}
