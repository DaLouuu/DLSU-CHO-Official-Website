"use client"

import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { ExcuseApprovalContent } from "@/components/excuse/excuse-approval-content"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExcuseApprovalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <PageHeader />

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/admin/attendance-overview">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Overview
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-[#09331f] md:text-3xl">Excuse Approval</h1>
            </div>

            <ExcuseApprovalContent />
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  )
}
