# Email + School ID Login Implementation

## Overview
This document describes the temporary replacement of Google OAuth with email + school ID authentication using the `profiles` table.

---

## 🔐 Authentication Method

### How It Works

1. **User submits credentials:**
   - Email address
   - School ID

2. **Validation:**
   - Query `profiles` table with BOTH email AND school_id
   - Both must match the SAME row
   - Partial matches are rejected

3. **Session Creation:**
   - If valid, create HTTP-only session cookie
   - Cookie contains: email, school_id, profile_id, timestamp
   - Cookie expires after 7 days

4. **Authorization:**
   - Middleware checks for session cookie
   - Links profile to Users table for role checking
   - Redirects based on verification status and role

---

## 📋 Files Modified

### 1. **`app/api/auth/login/route.ts`** (NEW)
- Validates email + school_id against `profiles` table
- Creates session cookie on successful validation
- Returns redirect path based on user role

### 2. **`app/api/auth/logout/route.ts`** (NEW)
- Clears authentication session cookie

### 3. **`app/login/page.tsx`**
- ❌ Removed: Google OAuth button
- ✅ Added: Email and School ID input fields
- ✅ Added: Form submission handler
- ✅ Added: Error handling and validation

### 4. **`middleware.ts`**
- ✅ Updated: Checks for both Supabase Auth session AND custom session cookie
- ✅ Updated: Links profiles to Users table for role checking
- ✅ Preserved: All existing route protection logic

### 5. **`lib/auth/session.ts`** (NEW)
- Session management utilities
- `getAuthSession()` - Get current session from cookie
- `getUserFromSession()` - Get user data from Users table
- `clearAuthSession()` - Clear session

### 6. **`components/layout/dashboard-nav.tsx`**
- ✅ Updated: Logout handler to clear both Supabase and custom sessions

### 7. **`types/database.types.ts`**
- ✅ Added: `profiles` table type definition

### 8. **`app/register/page.tsx`**
- ✅ Updated: Disabled registration message (Google OAuth removed)

---

## 🔒 Authentication Rules

### ✅ Valid Login
```sql
SELECT * FROM profiles
WHERE email = 'user@example.com'
  AND school_id = '12345'
LIMIT 1
```
**Result:** Row exists → User authenticated ✅

### ❌ Invalid Login Examples

1. **Email exists, school_id doesn't match:**
   ```sql
   -- profiles table has: email='user@example.com', school_id='99999'
   -- User enters: email='user@example.com', school_id='12345'
   -- Result: No match → Login fails ❌
   ```

2. **School ID exists, email doesn't match:**
   ```sql
   -- profiles table has: email='other@example.com', school_id='12345'
   -- User enters: email='user@example.com', school_id='12345'
   -- Result: No match → Login fails ❌
   ```

3. **Both exist but in different rows:**
   ```sql
   -- Row 1: email='user@example.com', school_id='11111'
   -- Row 2: email='other@example.com', school_id='12345'
   -- User enters: email='user@example.com', school_id='12345'
   -- Result: No match → Login fails ❌
   ```

**Security:** Generic error message "Invalid email or ID number." prevents credential enumeration.

---

## 🗄️ Database Schema

### Required Table: `profiles`

```sql
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,  -- or UUID
  email TEXT NOT NULL UNIQUE,
  school_id TEXT NOT NULL,
  -- Add other fields as needed
);
```

**Important:** Both `email` and `school_id` must exist in the same row for authentication to succeed.

### Linking to Users Table

The middleware attempts to link `profiles` to `Users` table:
1. First tries: `Users.id = profiles.id`
2. If not found, user will be redirected to pending verification

**Note:** You may need to adjust the linking logic based on your actual schema relationship.

---

## 🔄 Session Management

### Session Cookie Structure
```json
{
  "email": "user@example.com",
  "school_id": "12345",
  "profile_id": "1",
  "timestamp": 1234567890
}
```

### Cookie Settings
- **httpOnly:** true (prevents JavaScript access)
- **secure:** true in production (HTTPS only)
- **sameSite:** "lax" (CSRF protection)
- **maxAge:** 7 days
- **path:** "/" (available site-wide)

---

## 🛡️ Middleware Behavior

### Authentication Check
1. Checks for Supabase Auth session (OAuth - currently disabled)
2. Checks for custom auth session cookie (email + school ID - currently active)
3. User is authenticated if EITHER exists

### Authorization Flow
```
Authenticated → Check Users table
  ├─ User not found → /pending-verification
  ├─ User not verified → /pending-verification
  ├─ Admin (verified) → Allow access to /admin/*
  └─ Member (verified) → Allow access to member routes
```

### Route Protection
- ✅ Public routes: `/login`, `/register`, `/unauthorized`, `/pending-verification`
- ✅ Protected routes: All others require authentication
- ✅ Admin routes: `/admin/*` requires `is_admin = true`

---

## 🔄 Reverting to Google OAuth

To restore Google OAuth authentication:

### 1. Restore Login Page
- Re-add Google OAuth button
- Remove email/school ID form
- Restore `handleGoogleSignIn` function

### 2. Restore Register Page
- Re-enable Google OAuth in `RegisterForm`
- Update registration message

### 3. Update Middleware (Optional)
- Remove custom session cookie check
- Rely only on Supabase Auth session

### 4. Remove Files (Optional)
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `lib/auth/session.ts`

### 5. Keep OAuth Callbacks
- `/app/auth/callback/route.ts` - Already exists
- `/app/auth/callback-login/route.ts` - Already exists
- These will work once Google OAuth is re-enabled

---

## 🧪 Validation Checklist

- [x] Login form accepts email and school ID
- [x] Validation query checks BOTH fields in SAME row
- [x] Session cookie is set on successful login
- [x] Middleware recognizes custom session
- [x] Protected routes require authentication
- [x] Role-based redirects work correctly
- [x] Logout clears session
- [x] Google OAuth buttons removed
- [x] Registration disabled

---

## ⚠️ Important Notes

1. **Profiles Table Required:**
   - The `profiles` table must exist in Supabase
   - Must have `email` and `school_id` columns
   - Both fields should be indexed for performance

2. **Users Table Linking:**
   - Currently tries to link by `profiles.id = Users.id`
   - Adjust if your schema uses a different relationship
   - Consider adding a foreign key or join table if needed

3. **Security Considerations:**
   - Session cookies are HTTP-only (XSS protection)
   - Generic error messages (prevents enumeration)
   - 7-day session expiration
   - Secure flag in production (HTTPS only)

4. **Temporary Solution:**
   - This is designed to be easily reversible
   - Google OAuth code is preserved in git history
   - All OAuth callbacks remain functional

---

## 🐛 Troubleshooting

**"Invalid email or ID number" error:**
- Verify email and school_id exist in `profiles` table
- Check that both match the SAME row
- Verify email is lowercase (trimmed and lowercased in query)

**Session not persisting:**
- Check browser allows cookies
- Verify cookie is set (DevTools → Application → Cookies)
- Check cookie expiration hasn't passed

**Redirect loops:**
- Verify middleware excludes `/api/auth/login`
- Check that session cookie is being read correctly
- Ensure middleware matcher is correct

**User not found in Users table:**
- User will be redirected to `/pending-verification`
- Admin must add user to Users table and verify
- Consider creating Users record automatically from profile

---

## 📝 Next Steps (Optional Improvements)

1. **Auto-create Users record:**
   - When profile is validated, automatically create Users record
   - Set default values (verification: false, etc.)

2. **Better profile-Users linking:**
   - Add `profile_id` column to Users table
   - Or use email as the linking field

3. **Session refresh:**
   - Implement token refresh before expiration
   - Extend session on activity

4. **Password support:**
   - Add optional password field to profiles
   - Use Supabase Auth password hashing
   - Support both email+ID and email+password login

