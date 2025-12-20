export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Status = "Pending" | "Approved" | "Rejected"
export type AttendanceLogMethod = "QR" | "Manual" | "Excused"

export interface Database {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string
          name: string
          role: string
          committee: string | null
          verification: boolean
          section: string | null
          is_admin: boolean
          is_performing: boolean
          is_executive_board: boolean
          admin_role: string | null
        }
        Insert: {
          id: string
          name: string
          role: string
          committee?: string | null
          verification?: boolean
          section?: string | null
          is_admin?: boolean
          is_performing?: boolean
          is_executive_board?: boolean
          admin_role?: string | null
        }
        Update: {
          id?: string
          name?: string
          role?: string
          committee?: string | null
          verification?: boolean
          section?: string | null
          is_admin?: boolean
          is_performing?: boolean
          is_executive_board?: boolean
          admin_role?: string | null
        }
      }
      AttendanceLogs: {
        Row: {
          userID: string
          timestamp: string
          attendance_log_meta: string | null
          synced: boolean
        }
        Insert: {
          userID: string
          timestamp: string
          attendance_log_meta?: string | null
          synced?: boolean
        }
        Update: {
          userID?: string
          timestamp?: string
          attendance_log_meta?: string | null
          synced?: boolean
        }
      }
      ExcuseRequests: {
        Row: {
          userID: string
          date: string
          reason: string
          status: string
          notes: string | null
          type: string | null
          eta: string | null
          etd: string | null
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          userID: string
          date: string
          reason: string
          status: string
          notes?: string | null
          type?: string | null
          eta?: string | null
          etd?: string | null
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          userID?: string
          date?: string
          reason?: string
          status?: string
          notes?: string | null
          type?: string | null
          eta?: string | null
          etd?: string | null
          approved_by?: string | null
          approved_at?: string | null
        }
      }
      Directory: {
        Row: {
          id: number
          email: string
        }
        Insert: {
          id?: number
          email: string
        }
        Update: {
          id?: number
          email?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
