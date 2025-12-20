import { supabase } from "./supabase"
import type { Database, Status, AttendanceLogMethod } from "@/types/database.types"

// USERS
export async function getUserById(id: string) {
  return supabase.from("Users").select("*").eq("id", id).single()
}
export async function createUser(user: Omit<Database["public"]["Tables"]["Users"]["Insert"], "id"> & { id: string }) {
  return supabase.from("Users").insert([user])
}
export async function updateUser(id: string, updates: Partial<Database["public"]["Tables"]["Users"]["Update"]>) {
  return supabase.from("Users").update(updates).eq("id", id)
}
export async function deleteUser(id: string) {
  return supabase.from("Users").delete().eq("id", id)
}

// ATTENDANCE LOGS
export async function getAttendanceLogsByUser(userID: string) {
  return supabase.from("AttendanceLogs").select("*").eq("userID", userID)
}
export async function createAttendanceLog(
  log: Omit<Database["public"]["Tables"]["AttendanceLogs"]["Insert"], "userID"> & {
    userID: string
    attendance_log_meta?: AttendanceLogMethod | null
  },
) {
  return supabase.from("AttendanceLogs").insert([log])
}
export async function updateAttendanceLog(
  userID: string,
  timestamp: string,
  updates: Partial<Omit<Database["public"]["Tables"]["AttendanceLogs"]["Update"], "userID" | "timestamp">> & {
    attendance_log_meta?: AttendanceLogMethod | null
  },
): Promise<any> {
  return supabase.from("AttendanceLogs").update(updates).eq("userID", userID).eq("timestamp", timestamp)
}
export async function deleteAttendanceLog(userID: string, timestamp: string) {
  return supabase.from("AttendanceLogs").delete().eq("userID", userID).eq("timestamp", timestamp)
}

// EXCUSE REQUESTS
export async function getExcuseRequestsByUser(userID: string) {
  return supabase.from("ExcuseRequests").select("*").eq("userID", userID)
}
export async function createExcuseRequest(
  request: Omit<Database["public"]["Tables"]["ExcuseRequests"]["Insert"], "status"> & { status: Status },
) {
  return supabase.from("ExcuseRequests").insert([request])
}
export async function updateExcuseRequest(
  userID: string,
  date: string,
  updates: Partial<Omit<Database["public"]["Tables"]["ExcuseRequests"]["Update"], "userID" | "date">> & {
    status?: Status
  },
): Promise<any> {
  return supabase.from("ExcuseRequests").update(updates).eq("userID", userID).eq("date", date)
}
export async function deleteExcuseRequest(userID: string, date: string) {
  return supabase.from("ExcuseRequests").delete().eq("userID", userID).eq("date", date)
}

// DIRECTORY
export async function getDirectoryEntryByEmail(email: string) {
  return supabase.from("Directory").select("*").eq("email", email).single()
}
export async function createDirectoryEntry(entry: Omit<Database["public"]["Tables"]["Directory"]["Insert"], "id">) {
  return supabase.from("Directory").insert([entry])
}
export async function updateDirectoryEntry(
  id: number,
  updates: Partial<Database["public"]["Tables"]["Directory"]["Update"]>,
) {
  return supabase.from("Directory").update(updates).eq("id", id)
}
export async function deleteDirectoryEntry(id: number) {
  return supabase.from("Directory").delete().eq("id", id)
}
