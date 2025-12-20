# Codebase Reorganization Summary

## Overview
This document outlines the structural improvements made to the DLSU Chorale Official Website codebase to improve maintainability, clarity, and scalability.

---

## 🗂️ New Folder Structure

```
/
├── app/                          # Next.js app directory (pages & routes)
│   ├── admin/                    # Admin-only pages
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication routes
│   └── [other pages]/            # Public pages
│
├── components/                    # React components
│   ├── ui/                       # Shared UI components (shadcn/ui)
│   ├── layout/                   # Layout components (header, footer, nav)
│   ├── auth/                     # Authentication components
│   ├── attendance/               # Attendance-related components
│   ├── excuse/                   # Excuse-related components
│   └── admin/                    # Admin-specific components
│
├── lib/                          # Library code
│   ├── api/                      # API utilities
│   │   ├── supabase.ts          # Supabase client
│   │   └── controllers.ts       # Database controllers
│   ├── services/                 # Business logic services
│   │   └── notifications.ts     # Notification service
│   └── utils.ts                  # General utilities (cn, etc.)
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx           # Mobile breakpoint hook
│   └── use-toast.ts              # Toast notification hook
│
├── types/                        # TypeScript type definitions
│   ├── database.types.ts        # Database schema types
│   └── excuse.ts                # Excuse-related types
│
├── config/                       # Configuration & constants
│   └── constants.ts             # App-wide constants
│
├── public/                       # Static assets
│   └── images/                  # Image assets
│
└── middleware.ts                 # Next.js middleware (moved from lib/)
```

---

## 📋 Changes Made

### 1. **Removed Duplicate Files**
   - ✅ Deleted `components/ui/use-mobile.tsx` (duplicate of `hooks/use-mobile.tsx`)
   - ✅ Deleted `components/ui/use-toast.ts` (duplicate of `hooks/use-toast.ts`)
   - ✅ Deleted `styles/globals.css` (unused, `app/globals.css` is the active one)
   - ✅ Deleted `types/database.types` (duplicate of `types/database.types.ts`)

### 2. **Reorganized `lib/` Folder**
   - ✅ Created `lib/api/` for API-related utilities:
     - `supabase.ts` - Supabase client configuration
     - `controllers.ts` - Database CRUD operations
   - ✅ Created `lib/services/` for business logic:
     - `notifications.ts` - Email and in-app notification service
   - ✅ Kept `lib/utils.ts` for general utilities

### 3. **Created `config/` Folder**
   - ✅ Added `config/constants.ts` with:
     - Supabase configuration (URL, API key)
     - Resend API key
     - Email configuration
     - Route constants (public routes, auth routes)
     - Mobile breakpoint constant

### 4. **Moved Middleware**
   - ✅ Moved `lib/middleware.ts` → `middleware.ts` (root level)
     - Follows Next.js convention for middleware placement
     - Updated to use constants from `config/constants.ts`

### 5. **Updated Import Paths**
   All import paths have been updated to reflect the new structure:
   - `@/lib/supabase` → `@/lib/api/supabase`
   - `@/lib/notifications` → `@/lib/services/notifications`
   - Hooks now use constants from `@/config/constants`

---

## 📝 File Moves & Renames

| Old Path | New Path | Reason |
|----------|----------|--------|
| `lib/middleware.ts` | `middleware.ts` | Next.js convention |
| `lib/supabase.ts` | `lib/api/supabase.ts` | Better organization |
| `lib/controllers.ts` | `lib/api/controllers.ts` | Grouped with API code |
| `lib/notifications.ts` | `lib/services/notifications.ts` | Business logic separation |
| N/A | `config/constants.ts` | New file for constants |

---

## 🎯 Benefits

1. **Clear Separation of Concerns**
   - API code is separated from business logic
   - Configuration is centralized
   - Components are organized by feature

2. **Better Maintainability**
   - Constants are in one place (easier to update)
   - Related code is grouped together
   - No duplicate files to maintain

3. **Improved Scalability**
   - Easy to add new services in `lib/services/`
   - Easy to add new API utilities in `lib/api/`
   - Clear structure for new contributors

4. **Follows Best Practices**
   - Next.js middleware at root level
   - Feature-based component organization
   - Centralized configuration

---

## ✅ Verification Checklist

- [x] All duplicate files removed
- [x] All import paths updated
- [x] Constants extracted to config folder
- [x] Middleware moved to root level
- [x] lib/ folder reorganized
- [x] No functionality changed (only structure)

---

## 🔄 Import Path Reference

### Before → After

```typescript
// Supabase
import { supabase } from "@/lib/supabase"
→ import { supabase } from "@/lib/api/supabase"

// Notifications
import { sendNotification } from "@/lib/notifications"
→ import { sendNotification } from "@/lib/services/notifications"

// Constants (new)
import { MOBILE_BREAKPOINT, PUBLIC_ROUTES } from "@/config/constants"
```

---

## 📌 Notes for Future Contributors

1. **Adding New Constants**: Add to `config/constants.ts`
2. **Adding New API Functions**: Add to `lib/api/controllers.ts` or create new file in `lib/api/`
3. **Adding New Services**: Create new file in `lib/services/`
4. **Adding New Hooks**: Add to `hooks/` folder
5. **Component Organization**: 
   - Shared UI components → `components/ui/`
   - Feature-specific components → `components/[feature]/`
   - Layout components → `components/layout/`

---

## 🚀 Optional Future Improvements

These are suggestions for future refactoring (not implemented):

1. **Environment Variables**: Move API keys to `.env.local` for better security
2. **Type Organization**: Consider grouping types by domain (e.g., `types/auth.ts`, `types/attendance.ts`)
3. **API Layer**: Consider creating a more structured API layer with request/response types
4. **Error Handling**: Centralize error handling utilities
5. **Validation**: Create shared validation schemas (using Zod)

---

## ✨ Summary

The codebase has been reorganized to follow modern best practices while maintaining 100% functional compatibility. All changes are structural only - no business logic or UI behavior has been altered. The new structure makes the codebase more maintainable and easier for student developers to understand and contribute to.

