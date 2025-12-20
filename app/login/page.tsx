"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryBackground } from "@/components/ui/gallery-background"
import { WhiteLogo } from "@/components/ui/white-logo"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [schoolId, setSchoolId] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate inputs
      if (!email.trim() || !schoolId.trim()) {
        toast.error("Please enter both email and school ID")
        setIsLoading(false)
        return
      }

      // Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          school_id: schoolId.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Login successful - redirect based on user role
      toast.success("Login successful!")
      const redirectPath = data.redirect || "/attendance-overview"
      router.push(redirectPath)
      router.refresh() // Refresh to update middleware state
    } catch (error: any) {
      console.error("Error during login:", error)
      toast.error(error.message || "Invalid email or ID number.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <GalleryBackground />
      <div className="flex min-h-screen flex-col relative z-10">
        {/* Header with DLSU Chorale branding */}
        <header className="bg-[#09331f] py-8 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-white">DLSU Chorale</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center space-y-6 text-center mb-8">
              <WhiteLogo className="mb-2" />
              <h1 className="text-3xl font-bold tracking-tight text-white">Sign in to your account</h1>
              <p className="text-sm text-white/80">Access the DLSU Chorale Attendance System</p>
            </div>

            <Card className="border-2 border-[#09331f]/20 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@dlsu.edu.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="border-[#09331f]/30 focus:ring-[#09331f]/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school_id" className="text-sm font-medium text-gray-700">
                      School ID
                    </Label>
                    <Input
                      id="school_id"
                      type="text"
                      placeholder="Enter your school ID"
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      disabled={isLoading}
                      required
                      className="border-[#09331f]/30 focus:ring-[#09331f]/30"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#09331f] hover:bg-[#09331f]/90 text-white mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-700">Don't have an account?</span>{" "}
                  <Link href="/register" className="text-[#09331f] hover:underline font-medium">
                    Register
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#1B1B1B] py-6 shadow-inner">
          <div className="container mx-auto px-4 text-center text-white text-sm">
            &copy; {new Date().getFullYear()} DLSU Chorale. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
