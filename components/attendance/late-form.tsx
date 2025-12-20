"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ExcuseReasonOptions } from "@/components/attendance/excuse-reason-options"

export function LateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lateDate, setLateDate] = useState("")
  const [lateTime, setLateTime] = useState("")
  const [lateReason, setLateReason] = useState("")
  const [lateDescription, setLateDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!lateDate || !lateTime || !lateReason) {
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
        description: "Your late excuse has been submitted successfully",
      })

      // Reset form
      setLateDate("")
      setLateTime("")
      setLateReason("")
      setLateDescription("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="late-date" className="text-sm font-medium text-[#1B1B1B]">
          Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="late-date"
          type="date"
          value={lateDate}
          onChange={(e) => setLateDate(e.target.value)}
          className="border-[#09331f]/30 focus:ring-[#09331f]/30"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="late-time" className="text-sm font-medium text-[#1B1B1B]">
          Estimated Time of Arrival <span className="text-red-500">*</span>
        </Label>
        <Input
          id="late-time"
          type="time"
          value={lateTime}
          onChange={(e) => setLateTime(e.target.value)}
          className="border-[#09331f]/30 focus:ring-[#09331f]/30"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="late-reason" className="text-sm font-medium text-[#1B1B1B]">
          Reason <span className="text-red-500">*</span>
        </Label>
        <Select value={lateReason} onValueChange={setLateReason} required>
          <SelectTrigger id="late-reason" className="border-[#09331f]/30 focus:ring-[#09331f]/30">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <ExcuseReasonOptions />
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="late-description" className="text-sm font-medium text-[#1B1B1B]">
          Additional Details
        </Label>
        <Textarea
          id="late-description"
          placeholder="Please provide more details about your tardiness..."
          value={lateDescription}
          onChange={(e) => setLateDescription(e.target.value)}
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
