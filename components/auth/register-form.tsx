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
import { supabase } from "@/lib/supabase"

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
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-google"
              >
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                <path d="M12 16V8" />
                <path d="M8 12h8" />
              </svg>
              <span>Sign in with Google</span>
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
