"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import type { ExcuseItem } from "@/types/excuse"

interface ExcuseListProps {
  excuses: ExcuseItem[]
  onApprove: (id: string) => void
  onDecline: (id: string) => void
}

export function ExcuseList({ excuses, onApprove, onDecline }: ExcuseListProps) {
  if (excuses.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No pending excuses found.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {excuses.map((excuse) => (
        <div key={excuse.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={excuse.profileImage || "/placeholder.svg"} alt={excuse.name} />
                <AvatarFallback>{excuse.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{excuse.name}</h3>
                <div className="text-sm text-gray-500 capitalize">
                  {excuse.voiceSection} {excuse.voiceNumber}
                </div>
              </div>
            </div>
            <Badge
              className={`${
                excuse.type === "ABSENT"
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
              }`}
            >
              {excuse.type}
            </Badge>
          </div>

          <div className="mt-3 rounded-md bg-gray-50 p-3">
            <div className="mb-2 text-sm">
              <span className="font-medium">Date:</span> {excuse.date}
            </div>
            <div className="mb-2 text-sm">
              <span className="font-medium">Reason:</span> {excuse.reason}
            </div>
            {excuse.notes && (
              <div className="text-sm">
                <span className="font-medium">Notes:</span> {excuse.notes}
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => onApprove(excuse.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              onClick={() => onDecline(excuse.id)}
              variant="outline"
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50 text-sm"
            >
              <X className="mr-1 h-4 w-4" />
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
