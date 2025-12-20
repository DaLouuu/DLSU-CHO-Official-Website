"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ExcuseReasonOptions } from "@/components/attendance/excuse-reason-options"

export function AbsentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [absentDate, setAbsentDate] = useState("")
  const [absentReason, setAbsentReason] = useState("")
  const [absentDescription, setAbsentDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!absentDate || !absentReason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your absence excuse has been submitted successfully",
      })

      // Reset form
      setAbsentDate("")
      setAbsentReason("")
      setAbsentDescription("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="absent-date" className="text-sm font-medium text-[#1B1B1B]">
          Date of Absence <span className="text-red-500">*</span>
        </Label>
        <Input
          id="absent-date"
          type="date"
          value={absentDate}
          onChange={(e) => setAbsentDate(e.target.value)}
          className="border-[#09331f]/30 focus:ring-[#09331f]/30"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="absent-reason" className="text-sm font-medium text-[#1B1B1B]">
          Reason <span className="text-red-500">*</span>
        </Label>
        <Select value={absentReason} onValueChange={setAbsentReason} required>
          <SelectTrigger id="absent-reason" className="border-[#09331f]/30 focus:ring-[#09331f]/30">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <ExcuseReasonOptions />
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="absent-description" className="text-sm font-medium text-[#1B1B1B]">
          Additional Details
        </Label>
        <Textarea
          id="absent-description"
          placeholder="Please provide more details about your absence..."
          value={absentDescription}
          onChange={(e) => setAbsentDescription(e.target.value)}
          className="min-h-[120px] border-[#09331f]/30 focus:ring-[#09331f]/30"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#09331f] hover:bg-[#09331f]/90 text-white">
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Submitting...</span>
          </div>
        ) : (
          "Submit Excuse"
        )}
      </Button>
    </form>
  )
}
