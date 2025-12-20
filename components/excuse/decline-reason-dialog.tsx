"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeclineReasonDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  excuseName: string
  excuseType: string
  excuseDate: string
}

export function DeclineReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  excuseName,
  excuseType,
  excuseDate,
}: DeclineReasonDialogProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = () => {
    setIsSubmitting(true)
    // Simulate a short delay for the submission
    setTimeout(() => {
      onConfirm(reason)
      setReason("")
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-base md:text-lg font-semibold text-[#09331f]">
            Decline Excuse
          </DialogTitle>
          <DialogDescription className="text-center text-xs md:text-sm">
            Please provide a reason for declining this excuse request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 py-3 md:py-4">
          <div className="rounded-md bg-gray-50 p-2 md:p-3 text-xs md:text-sm">
            <p className="font-medium text-gray-900">{excuseName}</p>
            <p className="text-gray-700">
              {excuseType} - {excuseDate}
            </p>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label htmlFor="decline-reason" className="text-xs md:text-sm font-medium text-gray-700">
              Reason for declining (optional)
            </label>
            <Textarea
              id="decline-reason"
              placeholder="Enter your reason for declining this excuse..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] md:min-h-[120px] text-xs md:text-sm border-[#09331f]/30 focus:ring-[#09331f]/30"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs md:text-sm w-full sm:w-auto"
          >
            <X className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 md:h-4 md:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm Decline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
