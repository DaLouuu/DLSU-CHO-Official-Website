"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { HistoryItem } from "@/types/excuse"

interface HistoryListProps {
  historyItems: HistoryItem[]
  onEditApproval: (id: string) => void
}

export function HistoryList({ historyItems, onEditApproval }: HistoryListProps) {
  if (historyItems.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No history found.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {historyItems.map((item) => (
        <div key={item.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.profileImage || "/placeholder.svg"} alt={item.name} />
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <div className="text-sm text-gray-500 capitalize">
                  {item.voiceSection} {item.voiceNumber}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${
                  item.type === "ABSENT"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                }`}
              >
                {item.type}
              </Badge>
              <Badge className={`${item.status === "APPROVED" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {item.status}
              </Badge>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-gray-50 p-3">
            <div className="mb-2 text-sm">
              <span className="font-medium">Date:</span> {item.date}
            </div>
            {item.status === "DECLINED" && item.declineReason && (
              <div className="text-sm">
                <span className="font-medium">Decline Reason:</span> {item.declineReason}
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => onEditApproval(item.id)}
              variant="outline"
              size="sm"
              className={`text-sm ${
                item.status === "APPROVED"
                  ? "border-red-600 text-red-600 hover:bg-red-50"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              {item.status === "APPROVED" ? "Mark as Declined" : "Mark as Approved"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
