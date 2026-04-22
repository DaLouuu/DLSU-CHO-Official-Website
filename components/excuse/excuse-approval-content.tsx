"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExcuseList } from "@/components/excuse/excuse-list"
import { HistoryList } from "@/components/excuse/history-list"
import { VoiceFilter } from "@/components/excuse/voice-filter"
import { DeclineReasonDialog } from "@/components/excuse/decline-reason-dialog"
import type { ExcuseItem, HistoryItem } from "@/types/excuse"

export function ExcuseApprovalContent() {
  const [activeTab, setActiveTab] = useState("pending")
  const [activeVoice, setActiveVoice] = useState<string | null>(null)

  // Decline dialog state
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [excuseToDecline, setExcuseToDecline] = useState<ExcuseItem | null>(null)
  const [historyItemToDecline, setHistoryItemToDecline] = useState<HistoryItem | null>(null)

  // OLD: hardcoded mock arrays removed — replaced with real API data below

  const [excuses, setExcuses] = useState<ExcuseItem[]>([])
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [loadingPending, setLoadingPending] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(true)

  // Helper to map raw API row → ExcuseItem
  function toExcuseItem(r: Record<string, unknown>): ExcuseItem {
    const p = r.profiles as { first_name?: string; last_name?: string; voice_section?: string } | null
    const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Unknown"
    return {
      id: String(r.request_id),
      name,
      voiceSection: p?.voice_section?.toLowerCase() ?? "unknown",
      voiceNumber: 1,
      type: String(r.excuse_type ?? "Absent").toUpperCase(),
      date: r.excused_date ? format(new Date(r.excused_date as string), "EEEE, MMMM d, yyyy") : "—",
      reason: String(r.notes ?? ""),
      notes: String(r.notes ?? ""),
      profileImage: "/images/default-avatar.jpg",
    }
  }

  useEffect(() => {
    async function fetchPending() {
      setLoadingPending(true)
      const res = await fetch("/api/admin/excuses", { credentials: "include" })
      if (res.ok) {
        const data: Record<string, unknown>[] = await res.json()
        setExcuses(data.map(toExcuseItem))
      }
      setLoadingPending(false)
    }

    async function fetchHistory() {
      setLoadingHistory(true)
      const res = await fetch("/api/admin/excuses/history", { credentials: "include" })
      if (res.ok) {
        const data: Record<string, unknown>[] = await res.json()
        const items: HistoryItem[] = data.map((r) => {
          const p = r.profiles as { first_name?: string; last_name?: string; voice_section?: string } | null
          const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Unknown"
          return {
            id: String(r.request_id),
            name,
            voiceSection: p?.voice_section?.toLowerCase() ?? "unknown",
            voiceNumber: 1,
            type: String(r.excuse_type ?? "Absent").toUpperCase(),
            date: r.excused_date ? format(new Date(r.excused_date as string), "EEEE, MMMM d, yyyy") : "—",
            status: String(r.status).toUpperCase() as "APPROVED" | "DECLINED",
            declineReason: r.notes ? String(r.notes) : undefined,
            profileImage: "/images/default-avatar.jpg",
          }
        })
        setHistoryItems(items)
      }
      setLoadingHistory(false)
    }

    fetchPending()
    fetchHistory()
  }, [])

  const handleApprove = async (id: string) => {
    const excuseToMove = excuses.find((excuse) => excuse.id === id)
    if (!excuseToMove) return

    await fetch("/api/admin/excuses", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: Number(id), status: "Approved" }),
    })

    const newHistoryItem: HistoryItem = {
      ...excuseToMove,
      id: `h${Date.now()}`,
      status: "APPROVED",
    }
    setHistoryItems([newHistoryItem, ...historyItems])
    setExcuses(excuses.filter((excuse) => excuse.id !== id))
  }

  const handleDeclineClick = (id: string) => {
    // Find the excuse and open the decline dialog
    const excuse = excuses.find((excuse) => excuse.id === id)
    if (excuse) {
      setExcuseToDecline(excuse)
      setHistoryItemToDecline(null)
      setIsDeclineDialogOpen(true)
    }
  }

  const handleDeclineConfirm = async (reason: string) => {
    if (excuseToDecline) {
      await fetch("/api/admin/excuses", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: Number(excuseToDecline.id), status: "Rejected", notes: reason }),
      })

      const newHistoryItem: HistoryItem = {
        ...excuseToDecline,
        id: `h${Date.now()}`,
        status: "DECLINED",
        declineReason: reason || undefined,
      }
      setHistoryItems([newHistoryItem, ...historyItems])
      setExcuses(excuses.filter((excuse) => excuse.id !== excuseToDecline.id))
    } else if (historyItemToDecline) {
      await fetch("/api/admin/excuses", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: Number(historyItemToDecline.id), status: "Rejected", notes: reason }),
      })

      setHistoryItems(
        historyItems.map((item) =>
          item.id === historyItemToDecline.id
            ? { ...item, status: "DECLINED", declineReason: reason || undefined }
            : item,
        ),
      )
    }

    setIsDeclineDialogOpen(false)
    setExcuseToDecline(null)
    setHistoryItemToDecline(null)
  }

  const handleEditApproval = (id: string) => {
    // Find the history item
    const historyItem = historyItems.find((item) => item.id === id)
    if (historyItem) {
      if (historyItem.status === "APPROVED") {
        // If changing from APPROVED to DECLINED, show the decline dialog
        setHistoryItemToDecline(historyItem)
        setExcuseToDecline(null)
        setIsDeclineDialogOpen(true)
      } else {
        // If changing from DECLINED to APPROVED, just update the status
        setHistoryItems(
          historyItems.map((item) =>
            item.id === id ? { ...item, status: "APPROVED", declineReason: undefined } : item,
          ),
        )
      }
    }
  }

  // Filter excuses based on active voice
  const filteredExcuses = activeVoice ? excuses.filter((excuse) => excuse.voiceSection === activeVoice) : excuses

  // Filter history items based on active voice
  const filteredHistoryItems = activeVoice
    ? historyItems.filter((item) => item.voiceSection === activeVoice)
    : historyItems

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-t-lg bg-gray-100 p-0">
          <TabsTrigger
            value="pending"
            className="rounded-tl-lg rounded-tr-none py-3 data-[state=active]:bg-white data-[state=active]:text-[#09331f] data-[state=active]:shadow-none"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-tr-lg rounded-tl-none py-3 data-[state=active]:bg-white data-[state=active]:text-[#09331f] data-[state=active]:shadow-none"
          >
            History
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <VoiceFilter activeVoice={activeVoice} setActiveVoice={setActiveVoice} />
        </div>

        <TabsContent value="pending" className="m-0">
          <ExcuseList excuses={filteredExcuses} onApprove={handleApprove} onDecline={handleDeclineClick} />
        </TabsContent>

        <TabsContent value="history" className="m-0">
          <HistoryList historyItems={filteredHistoryItems} onEditApproval={handleEditApproval} />
        </TabsContent>
      </Tabs>

      {/* Decline Reason Dialog */}
      {(excuseToDecline || historyItemToDecline) && (
        <DeclineReasonDialog
          isOpen={isDeclineDialogOpen}
          onClose={() => {
            setIsDeclineDialogOpen(false)
            setExcuseToDecline(null)
            setHistoryItemToDecline(null)
          }}
          onConfirm={handleDeclineConfirm}
          excuseName={excuseToDecline?.name || historyItemToDecline?.name || ""}
          excuseType={excuseToDecline?.type || historyItemToDecline?.type || ""}
          excuseDate={excuseToDecline?.date || historyItemToDecline?.date || ""}
        />
      )}
    </div>
  )
}
