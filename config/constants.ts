/**
 * Application-wide constants
 *
 * All values must come from environment variables.
 * For local development, set these in .env.local (never commit that file).
 */

// Supabase Configuration
// export const SUPABASE_URL =
//   process.env.NEXT_PUBLIC_SUPABASE_URL ||
//   process.env.SUPABASE_URL ||
//   "https://sstmwvnstzwaopqjkurm.supabase.co"  // OLD — hardcoded fallback removed
// export const SUPABASE_ANON_KEY =
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
//   process.env.SUPABASE_ANON_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // OLD — hardcoded fallback removed
// export const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_VGFWxY7Z_..."  // OLD — hardcoded fallback removed

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const RESEND_API_KEY = process.env.RESEND_API_KEY!

// Email Configuration
// export const EMAIL_FROM = process.env.EMAIL_FROM || "DLSU Chorale <noreply@dlsuchorale.com>"  // OLD
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "DLSU Chorale <noreply@dlsuchorale.com>"

// Route Configuration
export const PUBLIC_ROUTES = ["/login", "/register", "/unauthorized", "/pending-verification"]
export const AUTH_ROUTES = ["/auth"]

// Mobile Breakpoint
export const MOBILE_BREAKPOINT = 768

