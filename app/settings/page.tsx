"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully")
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion is disabled in this demo")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <PageHeader />

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-4xl">
            {/* Dashboard Navigation */}
            <DashboardNav />

            <h1 className="text-2xl font-bold text-[#09331f] md:text-3xl mb-6">Settings</h1>

            <div className="grid gap-6">
              {/* Notification Settings */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-100 rounded-t-lg pb-3">
                  <CardTitle className="text-xl font-bold text-[#09331f]">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-base font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Receive email notifications for attendance updates</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode" className="text-base font-medium">
                          Dark Mode
                        </Label>
                        <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                      </div>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="mt-6 bg-[#09331f] hover:bg-[#09331f]/90">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-100 rounded-t-lg pb-3">
                  <CardTitle className="text-xl font-bold text-[#09331f]">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button variant="outline" onClick={handleSignOut} disabled={isLoading} className="w-full">
                      {isLoading ? "Signing out..." : "Sign Out"}
                    </Button>

                    <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  )
}
