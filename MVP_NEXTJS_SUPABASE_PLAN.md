# Miked Briefing System - Next.js + Supabase MVP Implementation Plan

**Target**: Migrate from Vite + React + localStorage to Next.js + Supabase + Vercel
**Scope**: Full rewrite with existing features + test account setup
**Timeline**: Ready to implement when you have Supabase project details

---

## Phase 1: Environment Setup

### Step 1.1: Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com) → select your miked.live project
2. In **Settings → API**, copy:
   - **Project URL** (format: `https://[project-id].supabase.co`)
   - **Anon Key** (the public key)
3. Keep these safe—you'll use them in `.env.local`

### Step 1.2: Create Next.js Project
```bash
npx create-next-app@latest miked-briefing --typescript --tailwind --app-router
cd miked-briefing
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Step 1.3: Environment Variables
Create `.env.local` (DO NOT commit):
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

---

## Phase 2: Supabase Database Schema

Run this SQL in Supabase SQL Editor to create tables:

```sql
-- Create ENUM types
CREATE TYPE user_role AS ENUM ('band_leader', 'band_member', 'audio_engineer');
CREATE TYPE brief_status AS ENUM ('PENDING', 'DISCUSSING', 'AGREED');
CREATE TYPE brief_category AS ENUM ('MONITORING', 'MICROPHONES', 'PA', 'BACKLINE', 'LIGHTING', 'STAGE', 'POWER', 'HOSPITALITY');
CREATE TYPE provider AS ENUM ('BAND', 'VENUE', 'ENGINEER');
CREATE TYPE comment_type AS ENUM ('TEXT', 'STATUS_CHANGE', 'ITEM_REVISION');

-- Bands
CREATE TABLE bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Band Members
CREATE TABLE band_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(band_id, user_id)
);

-- Audio Engineers (linked to band)
CREATE TABLE audio_engineers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  band_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, band_id)
);

-- Shows
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES bands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE,
  created_by UUID REFERENCES auth.users(id),
  archived_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Briefs
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category brief_category NOT NULL,
  status brief_status DEFAULT 'PENDING',
  created_by UUID REFERENCES auth.users(id),
  assigned_band_members UUID[] DEFAULT ARRAY[]::UUID[],
  assigned_to UUID REFERENCES audio_engineers(user_id),
  provider provider,
  specs JSONB,
  pending_confirmation_from brief_status,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  text TEXT,
  type comment_type DEFAULT 'TEXT',
  new_status brief_status,
  previous_data JSONB,
  new_data JSONB,
  is_reopen_explanation BOOLEAN DEFAULT FALSE,
  is_current_spec_agreement BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Global Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  type comment_type DEFAULT 'TEXT',
  item_id UUID REFERENCES briefs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_engineers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
```

---

## Phase 3: Create Test Accounts

In Supabase **Authentication → Users**, manually create:

### Account 1: Band Leader
- **Email**: `band-leader@test.com`
- **Password**: (set something temporary)
- **ID**: Copy the UUID

### Account 2: Engineer
- **Email**: `engineer@test.com`
- **Password**: (set something temporary)
- **ID**: Copy the UUID

### Account 3: Band Member
- **Email**: `band-member@test.com`
- **Password**: (set something temporary)
- **ID**: Copy the UUID

Then run this SQL to link them (replace UUIDs with actual IDs):

```sql
-- Create band
INSERT INTO bands (name, created_by)
VALUES ('Test Band', '[BAND_LEADER_UUID]')
RETURNING id;
-- Copy the returned band_id

-- Add band members
INSERT INTO band_members (band_id, user_id, role) VALUES
  ('[BAND_ID]', '[BAND_LEADER_UUID]', 'band_leader'),
  ('[BAND_ID]', '[BAND_MEMBER_UUID]', 'band_member');

-- Add engineer
INSERT INTO audio_engineers (user_id, band_id)
VALUES ('[ENGINEER_UUID]', '[BAND_ID]');

-- Create a test show
INSERT INTO shows (band_id, name, date, created_by)
VALUES ('[BAND_ID]', 'Test Show', '2025-03-15', '[BAND_LEADER_UUID]')
RETURNING id;
-- Copy the returned show_id (you'll need this for briefs)
```

---

## Phase 4: Next.js File Structure

```
app/
├── layout.tsx                    # Root layout + auth provider
├── page.tsx                      # Redirect to /dashboard
├── auth/
│   ├── callback/route.ts         # OAuth callback
│   ├── login/page.tsx            # Login form
│   └── signup/page.tsx           # Signup form
├── dashboard/
│   ├── layout.tsx                # Protected layout
│   ├── page.tsx                  # Redirect to first band/show
│   └── [showId]/
│       ├── page.tsx              # Brief list + global chat
│       └── [briefId]/
│           ├── page.tsx          # Brief detail view
│           └── edit/page.tsx     # Brief edit form
│
lib/
├── supabase/
│   ├── client.ts                 # Browser client
│   ├── server.ts                 # Server/SSR client
│   └── types.ts                  # TypeScript types (generate from schema)
├── hooks/
│   ├── useBriefs.ts             # Fetch briefs for show
│   ├── useComments.ts           # Fetch comments for brief
│   ├── useChatMessages.ts       # Fetch show messages
│   └── useAuth.ts               # Auth state
├── utils/
│   ├── permissions.ts           # Check if user can accept, edit, etc
│   └── statusWorkflow.ts        # Status transition logic
│
components/
├── BriefList.tsx                # Show all briefs
├── BriefDetail.tsx              # Single brief + comments
├── CommentThread.tsx            # Nested comments
├── GlobalChat.tsx               # Show-wide chat
├── NewBriefForm.tsx             # Create brief
├── EditBriefForm.tsx            # Edit brief
├── AuthProvider.tsx             # Supabase context wrapper
└── (other UI components)
```

---

## Phase 5: Key Implementation Steps

### 5.1 Auth Setup (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

### 5.2 Auth Pages (`app/auth/login/page.tsx`)
- Email/password form
- Google OAuth button
- Redirect to `/dashboard` on success

### 5.3 Dashboard (`app/dashboard/page.tsx`)
- Fetch user's band (only one for MVP)
- Fetch latest show or show picker
- Redirect to `/dashboard/[showId]`

### 5.4 Brief List (`app/dashboard/[showId]/page.tsx`)
- Fetch briefs for show
- Display BriefList component
- Show GlobalChat component

### 5.5 Brief Detail (`app/dashboard/[showId]/[briefId]/page.tsx`)
- Fetch brief + comments
- Display BriefDetail with comment thread
- Accept/reopen buttons (based on permissions)

### 5.6 Status Workflow (`lib/utils/statusWorkflow.ts`)
Port your current logic:
- PENDING + both agree → AGREED
- AGREED + reopen → DISCUSSING
- Track `pending_confirmation_from`

### 5.7 Permissions (`lib/utils/permissions.ts`)
```typescript
export function canAcceptBrief(brief, userRole, userId) {
  // Band leader or engineer can always accept
  // Band member can only accept if assigned
  return (
    userRole === 'band_leader' ||
    userRole === 'audio_engineer' ||
    brief.assigned_band_members.includes(userId)
  )
}
```

---

## Phase 6: Testing with Multiple Accounts

### Browser Setup
Install **Firefox Multi-Account Containers** or use separate incognito windows:

1. **Window 1 (Band Leader)**: `localhost:3000` → login as `band-leader@test.com`
2. **Window 2 (Engineer)**: `localhost:3000` → login as `engineer@test.com`
3. Arrange side-by-side, refresh after changes to see real-time updates

### Manual Testing Checklist
- [ ] Band leader creates brief
- [ ] Engineer proposes change (ITEM_REVISION comment)
- [ ] Band leader accepts
- [ ] Engineer accepts → status AGREED
- [ ] Band leader reopens → status DISCUSSING
- [ ] Engineer posts comment → band leader sees it
- [ ] Global chat messages appear for both

---

## Phase 7: Deployment to Vercel

When ready:
```bash
git add .
git commit -m "feat: Next.js + Supabase MVP"
git push origin main

# In Vercel dashboard:
# - Import from GitHub
# - Add env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
# - Deploy
```

---

## References

- [Supabase + Next.js Docs](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Generate TypeScript Types](https://supabase.com/docs/guides/api/rest/generating-types)

---

## Next Steps

When you have your Supabase URL & anon key:
1. Update `.env.local`
2. Run the SQL schema in Supabase
3. Create test accounts
4. Start Phase 5 implementation
5. Run `npm run dev` and test side-by-side

Good luck! 🚀
