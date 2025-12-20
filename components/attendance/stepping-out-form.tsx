"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ExcuseReasonOptions } from "@/components/attendance/excuse-reason-options"

export function SteppingOutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [steppingOutDate, setSteppingOutDate] = useState("")
  const [steppingOutTime, setSteppingOutTime] = useState("")
  const [returnTime, setReturnTime] = useState("")
  const [steppingOutReason, setSteppingOutReason] = useState("")
  const [steppingOutDescription, setSteppingOutDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!steppingOutDate || !steppingOutTime || !returnTime || !steppingOutReason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate that return time is after stepping out time
    if (steppingOutTime >= returnTime) {
      toast({
        title: "Error",
        description: "Return time must be after stepping out time",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your stepping out request has been submitted successfully",
      })

      // Reset form
      setSteppingOutDate("")
      setSteppingOutTime("")
      setReturnTime("")
      setSteppingOutReason("")
      setSteppingOutDescription("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="stepping-out-date" className="text-sm font-medium text-[#1B1B1B]">
          Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="stepping-out-date"
          type="date"
          value={steppingOutDate}
          onChange={(e) => setSteppingOutDate(e.target.value)}
          className="border-[#09331f]/30 focus:ring-[#09331f]/30"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stepping-out-time" className="text-sm font-medium text-[#1B1B1B]">
            Stepping Out Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="stepping-out-time"
            type="time"
            value={steppingOutTime}
            onChange={(e) => setSteppingOutTime(e.target.value)}
            className="border-[#09331f]/30 focus:ring-[#09331f]/30"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return-time" className="text-sm font-medium text-[#1B1B1B]">
            Expected Return Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="return-time"
            type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="border-[#09331f]/30 focus:ring-[#09331f]/30"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stepping-out-reason" className="text-sm font-medium text-[#1B1B1B]">
          Reason <span className="text-red-500">*</span>
        </Label>
        <Select value={steppingOutReason} onValueChange={setSteppingOutReason} required>
          <SelectTrigger id="stepping-out-reason" className="border-[#09331f]/30 focus:ring-[#09331f]/30">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <ExcuseReasonOptions />
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stepping-out-description" className="text-sm font-medium text-[#1B1B1B]">
          Additional Details
        </Label>
        <Textarea
          id="stepping-out-description"
          placeholder="Please provide more details about your stepping out request..."
          value={steppingOutDescription}
          onChange={(e) => setSteppingOutDescription(e.target.value)}
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
          "Submit Request"
        )}
      </Button>
    </form>
  )
}
