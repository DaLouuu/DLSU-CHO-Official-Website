"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { DeclineReasonDialog } from "@/components/excuse/decline-reason-dialog"

// Update the ExcuseDetailView component to handle the simpler excuse objects
export function ExcuseDetailView({ excuse }) {
  const [status, setStatus] = useState(excuse.status || "PENDING")
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setStatus("APPROVED")
      setIsSubmitting(false)
    }, 500)
  }

  const handleDeclineClick = () => {
    setIsDeclineDialogOpen(true)
  }

  const handleDeclineConfirm = (reason) => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setStatus("DECLINED")
      setDeclineReason(reason)
      setIsDeclineDialogOpen(false)
      setIsSubmitting(false)
    }, 500)
  }

  // Status colors
  const statusColors = {
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      badge: "bg-yellow-500 text-white",
    },
    APPROVED: {
      bg: "bg-green-100",
      text: "text-green-800",
      badge: "bg-green-500 text-white",
    },
    DECLINED: {
      bg: "bg-red-100",
      text: "text-red-800",
      badge: "bg-red-500 text-white",
    },
  }

  const colors = statusColors[status]

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 border border-gray-200">
          <AvatarImage src="/images/profile-1.jpg" alt={excuse.name} />
          <AvatarFallback>{excuse.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{excuse.name}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {excuse.voiceSection} {excuse.voiceNumber}
          </p>
        </div>
      </div>

      <div className="rounded-md bg-gray-50 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <Badge
              className={`
                ${excuse.type === "ABSENT" ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
                font-medium py-1 px-3
              `}
            >
              {excuse.type}
            </Badge>
          </div>
          <Badge className={`${colors.badge} py-1 px-3`}>{status}</Badge>
        </div>

        <p className="text-sm">
          <span className="font-medium">Date:</span> {format(excuse.date, "MMMM d, yyyy")}
        </p>

        {status === "DECLINED" && declineReason && (
          <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
            <p className="font-medium">Decline Reason:</p>
            <p>{declineReason}</p>
          </div>
        )}
      </div>

      {status === "PENDING" && (
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting}
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={handleDeclineClick}
            variant="outline"
            className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </div>
      )}

      {/* Decline Reason Dialog */}
      <DeclineReasonDialog
        isOpen={isDeclineDialogOpen}
        onClose={() => setIsDeclineDialogOpen(false)}
        onConfirm={handleDeclineConfirm}
        excuseName={excuse.name}
        excuseType={excuse.type}
        excuseDate={format(excuse.date, "MMMM d, yyyy")}
      />
    </div>
  )
}
