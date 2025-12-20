# Project Structure Guide

## 📁 Directory Overview

### `/app` - Next.js App Router
Contains all pages and API routes following Next.js 13+ App Router conventions.

- **`/admin`** - Admin-only pages (attendance overview, excuse approval)
- **`/api`** - API route handlers
- **`/auth`** - Authentication callback routes
- **`/attendance-form`**, **`/attendance-overview`** - Attendance pages
- **`/login`**, **`/register`** - Public auth pages
- **`/profile`**, **`/settings`** - User pages

### `/components` - React Components

Organized by feature/responsibility:

- **`/ui`** - Shared UI components (shadcn/ui components)
  - Reusable, generic components like Button, Card, Dialog, etc.
  - Should not contain business logic
  
- **`/layout`** - Layout components
  - `page-header.tsx` - Page header component
  - `page-footer.tsx` - Page footer component
  - `dashboard-nav.tsx` - Navigation component

- **`/auth`** - Authentication components
  - `register-form.tsx` - Registration form

- **`/attendance`** - Attendance-related components
  - `absent-form.tsx` - Absence form
  - `late-form.tsx` - Late arrival form
  - `stepping-out-form.tsx` - Stepping out form
  - `excuse-form.tsx` - Main excuse form
  - `excuse-reason-options.tsx` - Excuse reason options

- **`/excuse`** - Excuse management components
  - `excuse-list.tsx` - List of excuses
  - `excuse-approval-content.tsx` - Admin approval interface
  - `history-list.tsx` - Excuse history
  - `voice-filter.tsx` - Voice section filter
  - `decline-reason-dialog.tsx` - Decline reason dialog

- **`/admin`** - Admin-specific components
  - `excuse-detail-view.tsx` - Detailed excuse view

### `/lib` - Library Code

- **`/api`** - API utilities
  - `supabase.ts` - Supabase client instance
  - `controllers.ts` - Database CRUD operations (Users, AttendanceLogs, ExcuseRequests, Directory)

- **`/services`** - Business logic services
  - `notifications.ts` - Email and in-app notification service

- **`utils.ts`** - General utility functions
  - `cn()` - Class name utility (clsx + tailwind-merge)

### `/hooks` - Custom React Hooks

- `use-mobile.tsx` - Hook to detect mobile breakpoint
- `use-toast.ts` - Toast notification hook

### `/types` - TypeScript Type Definitions

- `database.types.ts` - Supabase database schema types
- `excuse.ts` - Excuse-related types

### `/config` - Configuration & Constants

- `constants.ts` - Application-wide constants
  - Supabase configuration
  - API keys
  - Route definitions
  - Breakpoints

### `/public` - Static Assets

- `/images` - Image assets (logos, choir photos, etc.)
- Placeholder images

### Root Level Files

- `middleware.ts` - Next.js middleware for authentication & authorization
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
- `package.json` - Dependencies and scripts

---

## 🔄 Import Path Conventions

### Absolute Imports (using `@/` alias)

```typescript
// Components
import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/layout/dashboard-nav"

// API & Services
import { supabase } from "@/lib/api/supabase"
import { getUserById } from "@/lib/api/controllers"
import { sendNotification } from "@/lib/services/notifications"

// Utilities
import { cn } from "@/lib/utils"

// Hooks
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

// Types
import type { Database } from "@/types/database.types"

// Config
import { MOBILE_BREAKPOINT, PUBLIC_ROUTES } from "@/config/constants"
```

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `DashboardNav.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `use-mobile.tsx`, `utils.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `database.types.ts`)
- **Config**: camelCase (e.g., `constants.ts`)

### Folders
- **Lowercase** with descriptive names
- Use kebab-case for multi-word folders if needed

### Code
- **Components**: PascalCase
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE (in `config/constants.ts`)

---

## 🎯 Adding New Code

### Adding a New Component

1. **Shared UI Component** → `components/ui/[ComponentName].tsx`
2. **Feature Component** → `components/[feature]/[ComponentName].tsx`
3. **Layout Component** → `components/layout/[ComponentName].tsx`

### Adding a New API Function

Add to `lib/api/controllers.ts` or create new file in `lib/api/` if it's a separate concern.

### Adding a New Service

Create new file in `lib/services/[service-name].ts`

### Adding a New Hook

Add to `hooks/[hook-name].tsx`

### Adding Constants

Add to `config/constants.ts`

---

## 🚫 What NOT to Do

- ❌ Don't put business logic in UI components
- ❌ Don't create duplicate files
- ❌ Don't put constants directly in component files
- ❌ Don't mix API code with business logic
- ❌ Don't create deep folder nesting (max 2-3 levels)

---

## ✅ Best Practices

- ✅ Keep components small and focused
- ✅ Use TypeScript for type safety
- ✅ Extract reusable logic to hooks or utilities
- ✅ Group related code together
- ✅ Use absolute imports (`@/`) for clarity
- ✅ Follow the existing naming conventions

