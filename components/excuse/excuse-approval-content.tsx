"use client"

import { useState } from "react"
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

  // Pending excuses data
  const [excuses, setExcuses] = useState<ExcuseItem[]>([
    {
      id: "1",
      name: "Dana Guillarte",
      voiceSection: "soprano",
      voiceNumber: 1,
      type: "ABSENT",
      date: "Thursday, May 8, 2025",
      reason: "Thesis Meeting",
      notes: "thesis offended",
      profileImage: "/images/default-avatar.jpg",
    },
    {
      id: "2",
      name: "Marian Ariaga",
      voiceSection: "alto",
      voiceNumber: 1,
      type: "ABSENT",
      date: "Thursday, May 8, 2025",
      reason: "Sick",
      notes: "masakit likod",
      profileImage: "/images/default-avatar.jpg",
    },
    {
      id: "3",
      name: "Kharlene Monloy",
      voiceSection: "alto",
      voiceNumber: 2,
      type: "ABSENT",
      date: "Thursday, May 8, 2025",
      reason: "Family Matters",
      notes: "Family reunion",
      profileImage: "/images/default-avatar.jpg",
    },
    {
      id: "4",
      name: "Rovin Montaño",
      voiceSection: "tenor",
      voiceNumber: 2,
      type: "LATE",
      date: "Friday, May 9, 2025",
      reason: "Traffic",
      notes: "Heavy traffic on EDSA",
      profileImage: "/images/default-avatar.jpg",
    },
    {
      id: "5",
      name: "Ballerina Cappuccina",
      voiceSection: "soprano",
      voiceNumber: 2,
      type: "ABSENT",
      date: "Friday, May 9, 2025",
      reason: "Exam",
      notes: "Final exam for Math 101",
      profileImage: "/images/default-avatar.jpg",
    },
    {
      id: "6",
      name: "Kean Genota",
      voiceSection: "bass",
      voiceNumber: 2,
      type: "LATE",
      date: "Wednesday, May 7, 2025",
      reason: "Requirements",
      notes: "Had to submit a project",
      profileImage: "/images/default-avatar.jpg",
    },
  ])

  // History data
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "h1",
      name: "Tralalero Tralala",
      voiceSection: "alto",
      voiceNumber: 1,
      type: "ABSENT",
      date: "Tueday, May 7, 2025",
      status: "DECLINED",
      declineReason: "Insufficient documentation provided",
      profileImage: "/images/profile-1.jpg",
    },
    {
      id: "h2",
      name: "Tralalero Tralala",
      voiceSection: "alto",
      voiceNumber: 1,
      type: "LATE",
      date: "Tueday, May 7, 2025",
      status: "APPROVED",
      profileImage: "/images/profile-1.jpg",
    },
    {
      id: "h3",
      name: "Tralalero Tralala",
      voiceSection: "alto",
      voiceNumber: 1,
      type: "ABSENT",
      date: "Tueday, May 7, 2025",
      status: "APPROVED",
      profileImage: "/images/profile-1.jpg",
    },
    {
      id: "h4",
      name: "Tralalero Tralala",
      voiceSection: "alto",
      voiceNumber: 1,
      type: "LATE",
      date: "Tueday, May 7, 2025",
      status: "DECLINED",
      declineReason: "Pattern of tardiness",
      profileImage: "/images/profile-1.jpg",
    },
    {
      id: "h5",
      name: "Soprano Example",
      voiceSection: "soprano",
      voiceNumber: 2,
      type: "ABSENT",
      date: "Tueday, May 7, 2025",
      status: "APPROVED",
      profileImage: "/images/profile-1.jpg",
    },
    {
      id: "h6",
      name: "Tenor Example",
      voiceSection: "tenor",
      voiceNumber: 1,
      type: "LATE",
      date: "Tueday, May 7, 2025",
      status: "DECLINED",
      declineReason: "No valid reason provided",
      profileImage: "/images/profile-1.jpg",
    },
    {
      id: "h7",
      name: "Bass Example",
      voiceSection: "bass",
      voiceNumber: 3,
      type: "ABSENT",
      date: "Tueday, May 7, 2025",
      status: "APPROVED",
      profileImage: "/images/profile-1.jpg",
    },
  ])

  const handleApprove = (id: string) => {
    // Move the excuse from pending to history with APPROVED status
    const excuseToMove = excuses.find((excuse) => excuse.id === id)
    if (excuseToMove) {
      const newHistoryItem: HistoryItem = {
        id: `h${Date.now()}`, // Generate a new ID
        name: excuseToMove.name,
        voiceSection: excuseToMove.voiceSection,
        voiceNumber: excuseToMove.voiceNumber,
        type: excuseToMove.type,
        date: excuseToMove.date,
        status: "APPROVED",
        profileImage: excuseToMove.profileImage,
      }

      setHistoryItems([newHistoryItem, ...historyItems])
      setExcuses(excuses.filter((excuse) => excuse.id !== id))
    }
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

  const handleDeclineConfirm = (reason: string) => {
    if (excuseToDecline) {
      // Move the excuse from pending to history with DECLINED status
      const newHistoryItem: HistoryItem = {
        id: `h${Date.now()}`, // Generate a new ID
        name: excuseToDecline.name,
        voiceSection: excuseToDecline.voiceSection,
        voiceNumber: excuseToDecline.voiceNumber,
        type: excuseToDecline.type,
        date: excuseToDecline.date,
        status: "DECLINED",
        declineReason: reason || undefined,
        profileImage: excuseToDecline.profileImage,
      }

      setHistoryItems([newHistoryItem, ...historyItems])
      setExcuses(excuses.filter((excuse) => excuse.id !== excuseToDecline.id))
    } else if (historyItemToDecline) {
      // Update the history item status to DECLINED
      setHistoryItems(
        historyItems.map((item) =>
          item.id === historyItemToDecline.id
            ? { ...item, status: "DECLINED", declineReason: reason || undefined }
            : item,
        ),
      )
    }

    // Close the dialog and reset state
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
