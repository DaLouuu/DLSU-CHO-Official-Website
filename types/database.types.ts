export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// export type Status = "Pending" | "Approved" | "Rejected"  // OLD — replaced by typed aliases below
// export type AttendanceLogMethod = "QR" | "Manual" | "Excused"  // OLD — kept below with additions

export type AttendanceLogMethod = "QR" | "Manual" | "Excused"
export type AttendanceLogStatus = "Present" | "Late" | "Absent" | "Excused"
export type ExcuseStatus = "Pending" | "Approved" | "Rejected"
export type ExcuseType = "Absent" | "Late" | "SteppingOut"
export type MembershipStatus = "Trainee" | "Junior Member" | "Senior Member"
export type EventType = "rehearsal" | "performance"

export interface Database {
  public: {
    Tables: {
      // ── Users: does NOT exist in Supabase. Real member table is `profiles`. ──
      // Users: {
      //   Row: {
      //     id: string
      //     name: string
      //     role: string
      //     committee: string | null
      //     verification: boolean
      //     section: string | null
      //     is_admin: boolean
      //     is_performing: boolean
      //     is_executive_board: boolean
      //     admin_role: string | null
      //   }
      //   Insert: { id: string; name: string; role: string; ... }
      //   Update: { id?: string; name?: string; ... }
      // }

      // ── AttendanceLogs: wrong name + wrong columns. Replaced by attendance_logs. ──
      // AttendanceLogs: {
      //   Row: { userID: string; timestamp: string; attendance_log_meta: string | null; synced: boolean }
      //   Insert: { userID: string; timestamp: string; ... }
      //   Update: { userID?: string; timestamp?: string; ... }
      // }

      // ── ExcuseRequests: wrong name + wrong columns. Replaced by excuse_requests. ──
      // ExcuseRequests: {
      //   Row: {
      //     userID: string; date: string; reason: string; status: string
      //     notes: string | null; type: string | null; eta: string | null; etd: string | null
      //     approved_by: string | null; approved_at: string | null
      //   }
      //   Insert: { ... }
      //   Update: { ... }
      // }

      directory: {
        Row: {
          // id: number  // OLD — actual PK column name is school_id
          school_id: number
          email: string | null
        }
        Insert: {
          school_id: number
          email?: string | null
        }
        Update: {
          school_id?: number
          email?: string | null
        }
      }

      // profiles: full schema from /supabase/exports/profiles_rows.csv
      profiles: {
        Row: {
          // id: string | number  // OLD — is strictly uuid
          // email: string        // OLD — is nullable
          // school_id: string    // OLD — is bigint / number
          id: string                        // uuid — matches Supabase Auth uid
          email: string | null
          created_at: string | null
          updated_at: string | null
          last_name: string | null
          first_name: string | null
          middle_name: string | null
          nickname: string | null
          membership_status: MembershipStatus
          current_term_stat: string
          committee: string | null
          voice_section: string | null
          bday: string | null
          mobile_num: string | null
          college: string | null
          course_code: string | null
          alternative_email: string | null
          terms_left: number | null
          telegram_user: string | null
          fb_link: string | null
          guardian_name: string | null
          parent_contact_num: string | null
          entry_date: string | null
          longevity_terms: number | null
          last_term_gpa: number | null
          school_id: number | null          // FK → directory.school_id
          is_admin: boolean | null          // added via migration
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_name?: string | null
          first_name?: string | null
          middle_name?: string | null
          nickname?: string | null
          membership_status: MembershipStatus
          current_term_stat: string
          committee?: string | null
          voice_section?: string | null
          bday?: string | null
          mobile_num?: string | null
          college?: string | null
          course_code?: string | null
          alternative_email?: string | null
          terms_left?: number | null
          telegram_user?: string | null
          fb_link?: string | null
          guardian_name?: string | null
          parent_contact_num?: string | null
          entry_date?: string | null
          longevity_terms?: number | null
          last_term_gpa?: number | null
          school_id?: number | null
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_name?: string | null
          first_name?: string | null
          middle_name?: string | null
          nickname?: string | null
          membership_status?: MembershipStatus
          current_term_stat?: string
          committee?: string | null
          voice_section?: string | null
          bday?: string | null
          mobile_num?: string | null
          college?: string | null
          course_code?: string | null
          alternative_email?: string | null
          terms_left?: number | null
          telegram_user?: string | null
          fb_link?: string | null
          guardian_name?: string | null
          parent_contact_num?: string | null
          entry_date?: string | null
          longevity_terms?: number | null
          last_term_gpa?: number | null
          school_id?: number | null
          is_admin?: boolean | null
        }
      }

      // attendance_logs — actual table name and columns
      attendance_logs: {
        Row: {
          log_id: number
          created_at: string
          account_id_fk: string | null      // FK → profiles.id (uuid)
          log_method: string | null
          event_id_fk: number | null        // FK → events.event_id
          log_status: AttendanceLogStatus | null
        }
        Insert: {
          log_id?: number
          created_at?: string
          account_id_fk?: string | null
          log_method?: string | null
          event_id_fk?: number | null
          log_status?: AttendanceLogStatus | null
        }
        Update: {
          log_id?: number
          created_at?: string
          account_id_fk?: string | null
          log_method?: string | null
          event_id_fk?: number | null
          log_status?: AttendanceLogStatus | null
        }
      }

      // excuse_requests — actual table name and columns
      excuse_requests: {
        Row: {
          request_id: number
          created_at: string
          account_id_fk: string | null      // FK → profiles.id (uuid)
          eta: string | null
          etd: string | null
          notes: string | null
          status: ExcuseStatus | null
          excused_date: string | null
          excuse_type: ExcuseType | null
        }
        Insert: {
          request_id?: number
          created_at?: string
          account_id_fk?: string | null
          eta?: string | null
          etd?: string | null
          notes?: string | null
          status?: ExcuseStatus | null
          excused_date?: string | null
          excuse_type?: ExcuseType | null
        }
        Update: {
          request_id?: number
          created_at?: string
          account_id_fk?: string | null
          eta?: string | null
          etd?: string | null
          notes?: string | null
          status?: ExcuseStatus | null
          excused_date?: string | null
          excuse_type?: ExcuseType | null
        }
      }

      // events — already exists in Supabase with these columns
      events: {
        Row: {
          event_id: number
          event_date: string
          start_time: string
          end_time: string | null
          notes: string | null
          event_type: EventType | null
          is_castable: string | null
        }
        Insert: {
          event_id?: number
          event_date: string
          start_time: string
          end_time?: string | null
          notes?: string | null
          event_type?: EventType | null
          is_castable?: string | null
        }
        Update: {
          event_id?: number
          event_date?: string
          start_time?: string
          end_time?: string | null
          notes?: string | null
          event_type?: EventType | null
          is_castable?: string | null
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
