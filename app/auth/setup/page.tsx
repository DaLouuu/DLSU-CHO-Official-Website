"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function SetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function setupUserProfile() {
      try {
        // Get the current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          throw new Error("No active session found")
        }

        // Get registration data from localStorage
        const registrationDataStr = localStorage.getItem("registrationData")
        if (!registrationDataStr) {
          throw new Error("Registration data not found")
        }

        const registrationData = JSON.parse(registrationDataStr)

        // Check if user email matches the one in Directory
        const { data: directoryData, error: directoryError } = await supabase
          .from("Directory")
          .select("id")
          .eq("email", session.user.email)
          .single()

        if (directoryError || !directoryData) {
          router.push("/unauthorized")
          return
        }

        // Prepare user data
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || "User",
          role: registrationData.userType === "admin" ? "admin" : "member",
          committee: registrationData.committee || null,
          verification: false, // Requires admin verification
          section: registrationData.voiceSection || null,
          is_admin: registrationData.userType === "admin",
          is_performing: registrationData.isPerforming || false,
          is_executive_board: registrationData.isExecutiveBoard || false,
          admin_role: registrationData.adminRole || null,
        }

        // Insert user data into Users table
        const { error: insertError } = await supabase.from("Users").upsert(userData)

        if (insertError) {
          throw insertError
        }

        // Clear registration data
        localStorage.removeItem("registrationData")

        // Redirect based on user role
        if (userData.is_admin) {
          router.push("/admin/attendance-overview")
        } else {
          router.push("/attendance-form")
        }

        toast.success("Registration successful! Awaiting admin verification.")
      } catch (error) {
        console.error("Setup error:", error)
        toast.error("Failed to complete registration")
        router.push("/register")
      } finally {
        setIsLoading(false)
      }
    }

    setupUserProfile()
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col">
        <PageHeader />

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-2 border-[#09331f]/20 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#09331f]">Setting up your account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#09331f] border-t-transparent mb-4"></div>
              <p className="text-center text-gray-600">Please wait while we set up your account...</p>
            </CardContent>
          </Card>
        </main>

        <PageFooter />
      </div>
    </div>
  )
}
