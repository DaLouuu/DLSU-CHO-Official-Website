/**
 * Application-wide constants
 * 
 * Environment variables take precedence over hardcoded values.
 * For local development, create a .env.local file with these variables.
 * 
 * Supports both NEXT_PUBLIC_ prefixed (Next.js client-side) and non-prefixed variables.
 */

// Supabase Configuration
// Support both NEXT_PUBLIC_ (for client-side) and regular env vars (for server-side)
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://sstmwvnstzwaopqjkurm.supabase.co"
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG13dm5zdHp3YW9wcWprdXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjM2ODcsImV4cCI6MjA2MjA5OTY4N30.owoNICStx_2uejWtHjHvcZmq-5i5vn_62SSQLtQBKMA"

// Resend API Key
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_VGFWxY7Z_BtYWLnAcjMywb2NVkGXou3fj"

// Email Configuration
export const EMAIL_FROM = process.env.EMAIL_FROM || "DLSU Chorale <noreply@dlsuchorale.com>"

// Route Configuration
export const PUBLIC_ROUTES = ["/login", "/register", "/unauthorized", "/pending-verification"]
export const AUTH_ROUTES = ["/auth"]

// Mobile Breakpoint
export const MOBILE_BREAKPOINT = 768

