"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/api/supabase"

export function RegisterForm() {
  const router = useRouter()
  const [userType, setUserType] = useState<"admin" | "member" | "">("")
  const [adminRole, setAdminRole] = useState("")
  const [isExecutiveBoard, setIsExecutiveBoard] = useState(false)
  const [isPerforming, setIsPerforming] = useState(false)
  const [committee, setCommittee] = useState("")
  const [voiceSection, setVoiceSection] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if form is valid based on selections
  const isFormValid = () => {
    if (userType === "admin") {
      if (!adminRole) return false
      if (adminRole === "conductor") return true
      if (adminRole === "performing") {
        return !!voiceSection && !!committee
      } else {
        return !!committee
      }
    }

    if (userType === "member") {
      if (isPerforming) {
        return !!voiceSection && !!committee
      } else {
        return !!committee
      }
    }

    return false
  }

  // Reset dependent fields when user type changes
  const handleUserTypeChange = (value: string) => {
    setUserType(value as "admin" | "member" | "")
    setAdminRole("")
    setIsPerforming(false)
    setIsExecutiveBoard(false)
    setVoiceSection("")
    setCommittee("")
  }

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Proceed with Google sign in
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        throw error
      }

      // Store registration data in localStorage to retrieve after OAuth
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          userType,
          adminRole,
          isExecutiveBoard,
          committee,
          voiceSection,
          isPerforming,
        }),
      )

      // Redirect to the OAuth URL
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error during sign in:", error)
      toast.error("Failed to sign in with Google")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-[#09331f]/20 shadow-lg bg-white/90 backdrop-blur-sm">
      <div className="p-8 space-y-7">
        <div className="space-y-5">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1B1B1B]">I am registering as:</Label>
            <RadioGroup value={userType} onValueChange={handleUserTypeChange} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" disabled={isLoading} />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" disabled={isLoading} />
                <Label htmlFor="member">Member</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Admin Role Selection - Only show if admin is selected */}
          {userType === "admin" && (
            <div className="space-y-3">
              <Label htmlFor="admin-role" className="text-sm font-medium text-[#1B1B1B]">
                Admin Role:
              </Label>
              <Select
                value={adminRole}
                onValueChange={(value) => {
                  setAdminRole(value)
                  // Reset performing status if conductor is selected
                  if (value === "conductor") {
                    setIsPerforming(false)
                    setIsExecutiveBoard(false)
                    setVoiceSection("")
                    setCommittee("")
                  } else if (value === "performing") {
                    setIsPerforming(true)
                  } else {
                    setIsPerforming(false)
                    setVoiceSection("")
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger id="admin-role" className="border-[#09331f]/30 focus:ring-[#09331f]/30">
                  <SelectValue placeholder="Select your admin role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conductor">Conductor</SelectItem>
                  <SelectItem value="performing">Performing</SelectItem>
                  <SelectItem value="non-performing">Non-Performing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Executive Board Option - For admin only */}
          {userType === "admin" && adminRole !== "conductor" && adminRole !== "" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-executive-board"
                  checked={isExecutiveBoard}
                  onCheckedChange={(checked) => setIsExecutiveBoard(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="is-executive-board">Executive Board</Label>
              </div>
            </div>
          )}

          {/* Performing Member Option - Only for regular members */}
          {userType === "member" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-performing"
                  checked={isPerforming}
                  onCheckedChange={(checked) => {
                    setIsPerforming(checked === true)
                    if (!checked) {
                      setVoiceSection("")
                    }
                  }}
                  disabled={isLoading}
                />
                <Label htmlFor="is-performing">Performing Member</Label>
              </div>
            </div>
          )}

          {/* Voice Section - Show if performing member or performing admin */}
          {((userType === "member" && isPerforming) || (userType === "admin" && adminRole === "performing")) && (
            <div className="space-y-3">
              <Label htmlFor="voice-section" className="text-sm font-medium text-[#1B1B1B]">
                Voice Section: <span className="text-red-500">*</span>
              </Label>
              <Select value={voiceSection} onValueChange={setVoiceSection} disabled={isLoading}>
                <SelectTrigger id="voice-section" className="border-[#09331f]/30 focus:ring-[#09331f]/30">
                  <SelectValue placeholder="Select your voice section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soprano">Soprano</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="tenor">Tenor</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Committee Selection - Show for all members and admins except conductor */}
          {(userType === "member" || (userType === "admin" && adminRole !== "conductor" && adminRole !== "")) && (
            <div className="space-y-3">
              <Label htmlFor="committee" className="text-sm font-medium text-[#1B1B1B]">
                Committee: <span className="text-red-500">*</span>
              </Label>
              <Select value={committee} onValueChange={setCommittee} disabled={isLoading}>
                <SelectTrigger id="committee" className="border-[#09331f]/30 focus:ring-[#09331f]/30">
                  <SelectValue placeholder="Select your committee" />
                </SelectTrigger>
                <SelectContent>
                  {/* Standard committees */}
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="production">Production and Logistics</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>

                  {/* Additional options for admin */}
                  {userType === "admin" && (
                    <>
                      <SelectItem value="n/a">N/A</SelectItem>
                      <SelectItem value="cm">CM (Committee Manager)</SelectItem>
                      <SelectItem value="acm">ACM (Assistant Committee Manager)</SelectItem>
                      <SelectItem value="dm-marketing">DM for Marketing</SelectItem>
                      <SelectItem value="dm-documentations">DM for Documentations</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={!isFormValid() || isLoading}
          className="w-full bg-[#09331f] hover:bg-[#09331f]/90 text-white mt-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
          )}
        </Button>

        <div className="pt-5 border-t border-gray-200 mt-4">
          <p className="text-center text-xs text-gray-700">
            After registration, an admin will verify your membership before you can access the system.
          </p>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-700">Already have an account?</span>{" "}
          <Link href="/login" className="text-[#09331f] hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </Card>
  )
}
