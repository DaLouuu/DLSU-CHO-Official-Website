"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// OLD UserProfile (matched fictional Users table):
// interface UserProfile {
//   id: string; name: string; role: string; committee: string | null
//   section: string | null; is_admin: boolean; is_performing: boolean
//   is_executive_board: boolean; admin_role: string | null; email: string
// }

interface UserProfile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  nickname: string | null
  voice_section: string | null
  membership_status: string
  current_term_stat: string
  committee: string | null
  is_admin: boolean | null
  school_id: number | null
}

/**
 * Profile Page
 * 
 * TEMPORARY AUTH APPROACH:
 * - Uses Directory-based authentication (email + school ID login)
 * - Does NOT use Supabase Auth sessions
 * - Loads profile via API route that reads auth_session cookie
 * - Gracefully redirects to /login if unauthenticated
 */
export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Load profile from API route
        // API route uses Directory-based session (auth_session cookie)
        // This is a temporary replacement for Supabase Auth
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include", // Include cookies in request
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          // Try to get error message from response
          let errorMessage = "Failed to fetch profile"
          try {
            const contentType = response.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
              const errorData = await response.json()
              errorMessage = errorData.error || errorMessage
            } else {
              // If response is not JSON, use status text
              errorMessage = response.statusText || errorMessage
            }
          } catch (parseError) {
            // If parsing fails, use status text
            errorMessage = response.statusText || errorMessage
            console.error("Error parsing error response:", parseError)
          }

          console.error("Profile fetch failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorMessage
          })

          if (response.status === 401) {
            // Unauthenticated - redirect to login
            router.push("/login")
            return
          }

          // For other errors, show message but don't crash
          console.error("Profile fetch error:", errorMessage)
          // Don't throw - let the UI show the "Profile not found" message
          setProfile(null)
          return
        }

        // Parse successful response
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Profile API returned non-JSON response")
          setProfile(null)
          return
        }

        const userData = await response.json()
        setProfile(userData)
      } catch (error) {
        console.error("Error fetching profile:", error)
        // On error, don't redirect immediately - let user see the error state
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  // Helper function to format role/committee/section for display
  const formatValue = (value: string | null) => {
    if (!value) return "N/A"

    // Convert kebab-case or snake_case to Title Case
    return value
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <PageHeader />

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-4xl">
            <DashboardNav isAdmin={profile?.is_admin ?? false} />

            <h1 className="text-2xl font-bold text-[#09331f] md:text-3xl mb-6">My Profile</h1>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#09331f] border-t-transparent"></div>
              </div>
            ) : profile ? (
              <div className="grid gap-6">
                {/* Profile Card */}
                <Card className="shadow-md">
                  <CardHeader className="bg-gray-100 rounded-t-lg pb-3">
                    <CardTitle className="text-xl font-bold text-[#09331f]">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <Avatar className="h-24 w-24 border-2 border-[#09331f]/20">
                        <AvatarImage src="/images/profile-1.jpg" alt={profile.first_name ?? "Member"} />
                        <AvatarFallback className="text-2xl">
                          {profile.first_name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—"}
                          </h2>
                          {profile.nickname && (
                            <p className="text-sm text-gray-400">"{profile.nickname}"</p>
                          )}
                          <p className="text-gray-500">{profile.email}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-[#09331f]">{profile.is_admin ? "Admin" : profile.membership_status}</Badge>
                          {profile.current_term_stat === "Performing" && (
                            <Badge className="bg-blue-500">Performing</Badge>
                          )}
                          {profile.current_term_stat?.startsWith("Graduating") && (
                            <Badge className="bg-amber-500">Graduating</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Details Card */}
                <Card className="shadow-md">
                  <CardHeader className="bg-gray-100 rounded-t-lg pb-3">
                    <CardTitle className="text-xl font-bold text-[#09331f]">Member Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Membership Status</h3>
                        <p className="text-lg font-medium">{formatValue(profile.membership_status)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Term Status</h3>
                        <p className="text-lg font-medium">{formatValue(profile.current_term_stat)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Voice Section</h3>
                        <p className="text-lg font-medium">{formatValue(profile.voice_section)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Committee</h3>
                        <p className="text-lg font-medium">{formatValue(profile.committee)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">School ID</h3>
                        <p className="text-lg font-medium">{profile.school_id ?? "—"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-md">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Profile not found. Please try logging in again.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  )
}
