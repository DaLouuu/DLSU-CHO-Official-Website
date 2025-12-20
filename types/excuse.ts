export interface ExcuseItem {
  id: string
  name: string
  voiceSection: string
  voiceNumber: number
  type: string
  date: string
  reason: string
  notes?: string
  profileImage: string
}

export interface HistoryItem {
  id: string
  name: string
  voiceSection: string
  voiceNumber: number
  type: string
  date: string
  status: "APPROVED" | "DECLINED"
  declineReason?: string
  profileImage: string
}
