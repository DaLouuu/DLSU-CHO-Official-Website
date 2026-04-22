# CLAUDE.md — DLSU Chorale Advanced Identification System

> This file is the primary instruction set for Claude Code working on this project.
> Read this entire file before touching any code. Cross-reference `CHECKLIST.md` to track task status.

---

## STEP 0 — Read the Database First (Required Before Anything Else)

Before working on any feature, fix, migration, or design task, you **must** first read and
understand the actual Supabase database contents located in `/supabase/exports/`.

These CSV files are the **ground truth** of the current database. Do not trust `database.types.ts`
alone — it may be outdated or incomplete.

### What to do with each CSV file

1. Read the file and list all column names with their inferred data types
2. Identify relationships between tables (look for columns like `member_id`, `event_id`, etc.)
3. Note the naming conventions used (snake_case, abbreviations, etc.)
4. Note what data already exists — do not rebuild what is already there
5. Flag any columns referenced in the codebase that are missing from the CSV

### After reading all CSVs, before writing any code

- Summarize the tables and their columns out loud
- List any mismatches between the CSVs and `database.types.ts`
- Identify which items in `CHECKLIST.md` are already covered by existing data
- Update `database.types.ts` if the schema has drifted from the actual DB
- Only then proceed with the assigned task

### CSV file location

```
/supabase/exports/
  members.csv           ← or users.csv — member profiles, section, role, rfid_uid
  attendance_logs.csv   ← RFID scan records, status, timestamps
  excuses.csv           ← paalam/excuse requests and approval status
  events.csv            ← rehearsals and performances
  performance_signups.csv
  fee_rules.csv
  fee_records.csv
  payments.csv
```

> If a CSV file does not exist yet for a table you need, check if the table exists in Supabase
> before running migrations. Never duplicate tables.

---

## What This Project Is

A web-based attendance and administrative management system for the **De La Salle University Chorale**.
Members tap their RFID-enabled university ID cards to log attendance. The system also manages:
- Excuse/paalam requests (absence and tardiness notices)
- Automatic fee calculations for unexcused absences and lates
- Performance sign-up management
- Admin dashboards for Section Heads, Finance Committee, and Executive Board

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix UI primitives) |
| 3D / Visual FX | **Three.js** via `@react-three/fiber` + `@react-three/drei` |
| Animation | **Framer Motion** (`motion` package) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + custom cookie session |
| Email | Resend API |
| Charts | Recharts (already installed) |
| Forms | React Hook Form + Zod |
| Package manager | pnpm |
| Deployment | Vercel |

---

## Installing New Dependencies

When adding Three.js / Framer Motion for design work:

```bash
pnpm add @react-three/fiber @react-three/drei three framer-motion
pnpm add -D @types/three
```

For any other new dependency, always use `pnpm add`, never `npm install`.

---

## Brand & Design System

### Colors (use these consistently everywhere)
| Name | Hex | Usage |
|---|---|---|
| Chorale Green (primary) | `#09331f` | Primary buttons, headers, active states, nav |
| Chorale Green Light | `#0d4a2c` | Hover states |
| Chorale Gold | `#c9a84c` | Accents, highlights, badges |
| Soprano Pink | `#ec4899` | Soprano section color |
| Alto Purple | `#a855f7` | Alto section color |
| Tenor Blue | `#3b82f6` | Tenor section color |
| Bass Green | `#22c55e` | Bass section color |
| Background | `#f9fafb` | Page backgrounds |
| Surface | `#ffffff` | Cards, modals |
| Text Primary | `#111827` | Main body text |
| Text Muted | `#6b7280` | Secondary text |

### Typography
Replace the current `Arial, Helvetica, sans-serif` font stack in `globals.css` with:
- **Display / Headings:** `Playfair Display` (Google Fonts) — elegant, musical feel
- **Body / UI:** `DM Sans` (Google Fonts) — clean, modern, readable

Add to `app/layout.tsx`:
```tsx
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})
```

Update `globals.css`:
```css
body {
  font-family: var(--font-dm-sans), sans-serif;
}
h1, h2, h3, h4 {
  font-family: var(--font-playfair), serif;
}
```

### Design Principles
- **Refined + institutional** — this is a university chorale, not a startup. Think elegant, not playful.
- **Dark green dominates** — `#09331f` is the identity color. Use it boldly on key surfaces.
- **Gold accents sparingly** — use `#c9a84c` only for highlights, badges, and important callouts.
- **Generous white space** — cards and sections should breathe.
- **Subtle depth** — use soft shadows (`shadow-md`, `shadow-lg`) not harsh borders.
- **Smooth transitions** — all interactive elements should have `transition-all duration-200`.
- **No purple gradients on white** — avoid generic AI-generated aesthetic clichés.

---

## Three.js / R3F Usage Guidelines

Use Three.js (`@react-three/fiber` + `@react-three/drei`) for:
1. **Login page background** — an animated, subtle particle field or floating musical notes in 3D space
2. **Homepage hero section** — a rotating 3D DLSU Chorale logo or abstract geometric scene
3. **Attendance confirmation screen** — a brief celebratory 3D animation when attendance is logged

### How to use R3F in Next.js App Router

Always wrap R3F canvases in a Client Component and use dynamic import with `ssr: false`:

```tsx
// components/three/scene-wrapper.tsx
'use client'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./actual-scene'), { ssr: false })
export default Scene
```

```tsx
// components/three/actual-scene.tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stars } from '@react-three/drei'

export default function ActualScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={3000} factor={4} fade />
      {/* your scene here */}
    </Canvas>
  )
}
```

### Recommended drei helpers to use
- `<Stars />` — starfield background (good for login page)
- `<Float />` — gentle floating animation wrapper
- `<Text3D />` — 3D text (use for logo or hero headings)
- `<Environment />` — lighting environment presets
- `<OrbitControls enableZoom={false} enablePan={false} autoRotate />` — auto-rotating scenes
- `<useFrame />` — for per-frame animation logic
- `<MeshDistortMaterial />` — for organic, pulsing shapes
- `<Sparkles />` — particle effects for celebrations

### Performance rules for Three.js
- Always set `dpr={[1, 2]}` on `<Canvas>` to cap pixel ratio
- Use `frameloop="demand"` for static or low-animation scenes
- Dispose geometries and materials on unmount
- Keep polygon counts low — this is a web app, not a game
- Do NOT use Three.js on every page — limit to login, home hero, and confirmation screens

---

## Framer Motion Usage Guidelines

Use Framer Motion for:
- Page transition animations (fade + slide)
- Card entrance animations (staggered reveal)
- Modal/dialog animations
- Status badge transitions (pending → approved)
- Sidebar and nav animations

### Standard page transition pattern
```tsx
// Wrap page content in:
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
>
  {/* page content */}
</motion.div>
```

### Staggered card list pattern
```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>...</motion.li>
  ))}
</motion.ul>
```

---

## Project File Structure

```
/app/                        → Next.js App Router
  layout.tsx                 → Root layout (add fonts here)
  globals.css                → Global styles + CSS variables
  page.tsx                   → Root/home page
  /login/page.tsx            → Login page
  /register/page.tsx         → Registration page
  /profile/page.tsx          → Member profile + attendance
  /attendance-overview/      → Member attendance view
  /attendance-form/          → Attendance submission
  /settings/page.tsx         → User settings
  /pending-verification/     → Awaiting admin approval
  /unauthorized/             → Access denied
  /performances/             → [TO BUILD] Performance calendar
  /admin/
    /attendance-overview/    → Admin attendance dashboard (needs real data)
    /excuse-approval/        → Admin paalam approval
    /fees/                   → [TO BUILD] Financial management
    /performances/           → [TO BUILD] Performance management
    /analytics/              → [TO BUILD] Analytics dashboard
  /api/
    /admin/excuses/          → Excuse approve/decline API ✅
    /auth/login/             → Email login API ✅
    /auth/logout/            → Logout API ✅
    /profile/                → Profile fetch API ✅
    /admin/fees/             → [TO BUILD] Fee management API
    /performances/           → [TO BUILD] Performances API
    /attendance/             → [TO BUILD] RFID scan API

/components/
  /three/                    → [TO CREATE] Three.js scene components
  /admin/                    → Admin UI components
  /attendance/               → Attendance form components
  /auth/                     → Auth form components
  /excuse/                   → Excuse management components
  /layout/
    dashboard-nav.tsx        → Main navigation
    page-header.tsx          → Page header
    page-footer.tsx          → Page footer
  /ui/                       → shadcn/ui component library (do not modify)

/lib/
  /api/controllers.ts        → Supabase query helpers
  /api/supabase.ts           → Supabase client
  /auth/session.ts           → Session cookie reader
  /services/notifications.ts → Resend email service

/types/
  database.types.ts          → Supabase table types (keep updated)
  excuse.ts                  → Excuse types

/config/constants.ts         → App constants (env vars, routes)
/middleware.ts               → Auth + RBAC middleware
```

---

## Database Schema

### Existing Tables

**`Users`**
```
id: string (matches directory.id as string)
name: string
role: string
committee: string | null
verification: boolean
section: string | null       -- 'Soprano' | 'Alto' | 'Tenor' | 'Bass'
is_admin: boolean
is_performing: boolean
is_executive_board: boolean
admin_role: string | null    -- 'section_head' | 'finance' | 'hr' | 'exec'
```

**`AttendanceLogs`**
```
userID: string
timestamp: string
attendance_log_meta: string | null
synced: boolean
-- MISSING: status field (see migrations below)
-- MISSING: rfid_uid link (see migrations below)
```

**`ExcuseRequests`**
```
userID: string
date: string
reason: string
status: string               -- 'Pending' | 'Approved' | 'Rejected'
notes: string | null
type: string | null          -- 'Absent' | 'Late' | 'SteppingOut'
eta: string | null
etd: string | null
approved_by: string | null
approved_at: string | null
```

**`directory`**
```
id: number                   -- student ID number
email: string                -- DLSU email
```

**`profiles`**
```
id: string | number
email: string
school_id: string
```

### Required Migrations (run these first)

```sql
-- 1. Add RFID UID to Users
ALTER TABLE "Users" ADD COLUMN rfid_uid TEXT UNIQUE;

-- 2. Add status to AttendanceLogs
ALTER TABLE "AttendanceLogs"
ADD COLUMN status TEXT CHECK (status IN ('Present', 'Late', 'Absent', 'Excused')) DEFAULT 'Present';

-- 3. Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('rehearsal', 'performance')) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  call_time TIMESTAMPTZ,
  attire TEXT,
  repertoire TEXT,
  signup_deadline TIMESTAMPTZ,
  cast_size INTEGER,
  created_by TEXT REFERENCES "Users"(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Performance sign-ups
CREATE TABLE performance_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT REFERENCES "Users"(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  signed_up_at TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('pending', 'approved')) DEFAULT 'pending',
  UNIQUE(member_id, event_id)
);

-- 5. Fee rules
CREATE TABLE fee_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('absent', 'late')) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  effective_date DATE NOT NULL
);

-- 6. Fee records
CREATE TABLE fee_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT REFERENCES "Users"(id) NOT NULL,
  attendance_log_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT CHECK (type IN ('absent', 'late')) NOT NULL,
  status TEXT CHECK (status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT REFERENCES "Users"(id) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  reference TEXT,
  receipt_url TEXT,
  recorded_by TEXT REFERENCES "Users"(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Always update `types/database.types.ts` after running any migration.

---

## Authentication System

The app uses **two parallel auth systems** — understand both:

### 1. Custom Cookie Session (currently active)
- Login via email → checked against `directory` table → `auth_session` HTTP-only cookie set
- Session shape: `{ email, directory_id, is_admin, timestamp }`
- Read with: `getAuthSession()` from `lib/auth/session.ts`
- **Problem:** `is_admin` is currently hardcoded to one student ID. Fix this:

```ts
// WRONG (current code in app/api/auth/login/route.ts)
const isAdmin = directoryEntry.id === 12207101 && directoryEntry.email === 'dana_guillarte@dlsu.edu.ph'

// CORRECT — look up Users table
const { data: userRecord } = await supabase
  .from('Users')
  .select('is_admin')
  .eq('id', directoryEntry.id.toString())
  .maybeSingle()
const isAdmin = userRecord?.is_admin ?? false
```

### 2. Supabase OAuth (partially built, not yet active)
- Google OAuth via Supabase Auth
- Callbacks at `/app/auth/callback/` and `/app/auth/callback-login/`
- Currently middleware supports both session types
- Goal: make Google OAuth the primary login method

### Middleware auth flow
- Public routes (no auth needed): `/login`, `/register`, `/unauthorized`, `/pending-verification`
- Auth routes (bypass middleware): `/auth/*`
- All other routes: require either `supabaseSession` or `customSession`
- Admin routes (`/admin/*`): additionally require `is_admin = true`
- TODO: also gate access on `Users.verification = true`

---

## Critical Bugs to Fix First

### Bug 1: Hardcoded Admin Check
**File:** `app/api/auth/login/route.ts`
**Problem:** Admin status is hardcoded to one specific person's student ID and email.
**Fix:** Query `Users.is_admin` from Supabase after directory lookup. See Authentication section above.

### Bug 2: API Keys Committed to Repo
**File:** `config/constants.ts`
**Problem:** Supabase anon key and Resend API key are hardcoded as string fallbacks.
**Fix:** Remove all string fallbacks. Use only `process.env.VAR_NAME`. Throw a clear error if missing.
```ts
// CORRECT
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const RESEND_API_KEY = process.env.RESEND_API_KEY!
```

### Bug 3: Admin Attendance Page Uses Mock Data
**File:** `app/admin/attendance-overview/page.tsx`
**Problem:** `mockExcuses` array is hardcoded. No real Supabase data.
**Fix:** Replace with a `useEffect` that fetches from `/api/admin/excuses` or queries Supabase directly via a server component.

### Bug 4: Verification Not Checked in Middleware
**File:** `middleware.ts`
**Problem:** Authenticated users with `verification = false` can access the dashboard.
**Fix:** After confirming authentication, also check `Users.verification`. If false, redirect to `/pending-verification`.

### Bug 5: `.env` Files in Repository
**Problem:** `.env` and `.env.local` were present in the zip, suggesting they may be tracked by git.
**Fix:**
```bash
git rm --cached .env .env.local
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
git commit -m "chore: remove env files from tracking"
```
Then rotate all exposed keys (Supabase, Resend) immediately.

---

## Features to Build

Refer to `CHECKLIST.md` for the full task-by-task breakdown. Here is the high-level build order:

### Phase 1 — Fix & Stabilize (do this first)
1. Fix hardcoded admin check (Bug 1)
2. Remove hardcoded API keys (Bug 2)
3. Fix `.env` git tracking (Bug 5)
4. Run DB migrations (new columns + new tables)
5. Update `types/database.types.ts` to match new schema
6. Fix middleware to check `verification` (Bug 4)

### Phase 2 — Connect Existing UI to Real Data
1. Admin attendance overview → fetch real `AttendanceLogs` + `Users` from Supabase
2. Member profile/attendance page → fetch member's own `AttendanceLogs`
3. Excuse approval page → confirm it's hitting `/api/admin/excuses` not mock data
4. Member excuse form → wire POST to `ExcuseRequests` table

### Phase 3 — RFID Integration
1. Build `/app/api/attendance/rfid/route.ts` — POST endpoint that receives `rfid_uid`, looks up `Users.rfid_uid`, inserts `AttendanceLogs`
2. Build offline queue using IndexedDB (`lib/rfid/offline-queue.ts`)
3. Build sync mechanism (background sync when connection restored)
4. Build confirmation UI screen

### Phase 4 — Financial Management
1. Build `/app/api/admin/fees/route.ts` — fee calculation and payment endpoints
2. Build `/app/admin/fees/page.tsx` — fee management dashboard
3. Add fee summary to member profile page

### Phase 5 — Performance Calendar
1. Build `/app/api/performances/route.ts` — CRUD for events + sign-ups
2. Build `/app/performances/page.tsx` — member performance calendar
3. Build `/app/admin/performances/page.tsx` — admin management view

### Phase 6 — Analytics
1. Build `/app/admin/analytics/page.tsx` using Recharts (already installed)
2. Chart types: attendance trends by section, paalam frequency, fee collection rate

### Phase 7 — Design Upgrade
See Design section below.

---

## Design Upgrade Instructions

### Global Changes
1. **Replace font** in `app/layout.tsx` and `globals.css` — use Playfair Display + DM Sans
2. **Update CSS variables** in `globals.css` to use Chorale Green as `--primary`:
```css
:root {
  --primary: 155 71% 13%;          /* #09331f */
  --primary-foreground: 0 0% 98%;
  --accent: 42 56% 55%;            /* #c9a84c gold */
  --accent-foreground: 0 0% 9%;
}
```
3. **Add smooth page transitions** — wrap all page content in a Framer Motion `motion.div`

### Login Page (`/app/login/page.tsx`)
- Full-screen layout, split: left panel = Three.js canvas, right panel = login form
- Three.js scene: dark green background (`#09331f`) with floating `<Stars />` or `<Sparkles />`
- Add a subtle `<Float>` animated 3D shape (sphere with `MeshDistortMaterial`) in chorale green
- Login card: dark green background, gold accent border, white text
- "Sign in with Google" button: white with DLSU Chorale logo

### Dashboard Navigation (`/components/layout/dashboard-nav.tsx`)
- Dark green sidebar on desktop, bottom nav bar on mobile
- Active route indicator: gold left border + gold text
- Add smooth Framer Motion slide-in animation on load
- Add member's name and section badge in the nav

### Admin Attendance Page (`/app/admin/attendance-overview/page.tsx`)
- After connecting real data, redesign the day selector as a horizontal scrolling week strip
- Each day tile: show excuse count as a colored dot (section color)
- Excuse cards: add Framer Motion staggered entrance
- Status badge colors: Absent = red, Late = amber, Present = green, Excused = blue

### Member Profile / Attendance Page (`/app/profile/page.tsx`)
- Calendar heatmap style — color-coded cells per day (green = present, red = absent, etc.)
- Fee summary card: gold accent border, clear outstanding amount in large type
- Add Framer Motion count-up animation on fee totals

### Attendance Confirmation Screen
- After RFID tap is logged, show a full-screen confirmation overlay
- Use Three.js `<Sparkles />` or `<Stars />` for a celebratory particle burst
- Show member name, section, and timestamp in large Playfair Display type
- Auto-dismiss after 3 seconds

---

## API Conventions

All API routes live in `/app/api/`. Follow this pattern:

```ts
// GET example
export async function GET(request: Request) {
  const session = await getAuthSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createRouteHandlerClient<Database>({ cookies })
  const { data, error } = await supabase.from('TableName').select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- Always authenticate first before any DB query
- Always check admin role for `/api/admin/*` routes
- Return consistent error shapes: `{ error: string }`
- Return consistent success shapes: `{ data: T }` or just `T` for simplicity

---

## Supabase Client Usage

Use the correct client for the context:

```ts
// In API routes (server-side):
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
const supabase = createRouteHandlerClient<Database>({ cookies })

// In middleware:
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
const supabase = createMiddlewareClient<Database>({ req, res })

// In Client Components (read-only, public data only):
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createClientComponentClient<Database>()
```

---

## Notification Service

Use `lib/services/notifications.ts` for all emails. Extend it with new notification types as needed:

```ts
await sendNotification({
  type: 'excuse_approved',     // or 'excuse_rejected', 'registration_approved', etc.
  recipientEmail: 'user@dlsu.edu.ph',
  recipientName: 'Juan dela Cruz',
  details: { date: '2025-05-08', notes: 'Approved' }
})
```

When adding new notification types, add a new case to the switch statement in `notifications.ts` and write the Resend email template inline.

---

## Commit Message Format

```
<type>: <short description in present tense>

Types:
  feat     → new feature
  fix      → bug fix
  style    → visual/design changes only
  refactor → code restructure, no behavior change
  docs     → documentation only
  test     → adding or fixing tests
  chore    → config, deps, cleanup
  db       → database migration or schema change
```

**Good examples:**
```
fix: replace hardcoded admin check with Users.is_admin lookup
feat: connect admin attendance page to Supabase live data
db: add rfid_uid column and status enum to AttendanceLogs
style: redesign login page with Three.js star background
feat: build fee calculation API and management dashboard
chore: remove hardcoded API keys from constants.ts
```

---

## Environment Variables

Required in `.env.local` (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=DLSU Chorale <noreply@dlsuchorale.com>
NEXTAUTH_SECRET=your_random_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Required in Vercel dashboard for production (same keys, production values).

---

## Things Claude Code Must Never Do

- Never commit `.env` or `.env.local`
- Never hardcode API keys, tokens, or passwords in source files
- Never use `npm install` — always use `pnpm add`
- Never modify files in `/components/ui/` — these are shadcn/ui generated components
- Never add Three.js canvases to pages that don't need them (performance cost)
- Never use `any` type in TypeScript — always type properly or use `unknown`
- Never push a broken build — run `pnpm build` locally before pushing
- Never create a new branch that lives longer than one working day before merging
