"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  name: string
  role: string
  committee: string | null
  section: string | null
  is_admin: boolean
  is_performing: boolean
  is_executive_board: boolean
  admin_role: string | null
  email: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get current user
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          throw new Error("No active session")
        }

        // Get user profile from Users table
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError) {
          throw userError
        }

        // Set profile with user data and email from session
        setProfile({
          ...userData,
          email: session.user.email || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

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
            {/* Dashboard Navigation */}
            <DashboardNav isAdmin={profile?.is_admin || false} />

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
                        <AvatarImage src="/images/profile-1.jpg" alt={profile.name} />
                        <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold">{profile.name}</h2>
                          <p className="text-gray-500">{profile.email}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-[#09331f]">{profile.is_admin ? "Admin" : "Member"}</Badge>
                          {profile.is_performing && <Badge className="bg-blue-500">Performing</Badge>}
                          {profile.is_executive_board && <Badge className="bg-purple-500">Executive Board</Badge>}
                          {profile.admin_role && (
                            <Badge className="bg-amber-500">{formatValue(profile.admin_role)}</Badge>
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
                        <h3 className="text-sm font-medium text-gray-500">Role</h3>
                        <p className="text-lg font-medium">{formatValue(profile.role)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Committee</h3>
                        <p className="text-lg font-medium">{formatValue(profile.committee)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Voice Section</h3>
                        <p className="text-lg font-medium">{formatValue(profile.section)}</p>
                      </div>

                      {profile.is_admin && profile.admin_role && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Admin Role</h3>
                          <p className="text-lg font-medium">{formatValue(profile.admin_role)}</p>
                        </div>
                      )}
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
