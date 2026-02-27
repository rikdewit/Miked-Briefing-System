# Miked Briefing System — Context for Claude

## What This App Is

A **technical rider collaboration tool** for live music events. It facilitates negotiation between two roles:

- **BAND** — musicians requesting gear/services
- **ENGINEER** — venue technician coordinating equipment

The app lets both parties create, discuss, and agree on technical requirements item-by-item. Once all items reach AGREED status, a printable "Show Specification" document can be generated.

**Fictional context in mock data**: "Afke Flaviana: The Spoken Quintet Tour"

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Animation | Motion (framer-motion v12) |
| Icons | Lucide React |
| AI (partial) | Google Gemini (`@google/genai`) |
| Runtime | Node/Vite dev server, port 5000 |
| Persistence | `localStorage` (no backend currently active) |

Express and `better-sqlite3` are in `package.json` but not yet wired up.

---

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root component — all state lives here
├── types.ts                  # All TypeScript types/interfaces
├── index.css                 # Tailwind + custom theme vars
└── components/
    ├── BriefList.tsx         # Category-grouped list (collapsible sections)
    ├── BriefItemDetail.tsx   # Right-side detail/discussion panel
    ├── NewItemPanel.tsx      # Slide-in panel: create new item
    ├── EditItemPanel.tsx     # Slide-in panel: edit existing item
    ├── FormFields.tsx        # Reusable inputs: TextInput, CategorySelect, ProviderSelect, SpecsSection
    ├── Badges.tsx            # StatusBadge, StatusCircle, TypeBadge
    ├── ProviderBadge.tsx     # BAND / VENUE / ENGINEER colored badges
    └── ShowSpec.tsx          # Print-ready specification document
```

---

## Core Data Model

```typescript
type Role = 'BAND' | 'ENGINEER'
type ItemStatus = 'PENDING' | 'DISCUSSING' | 'AGREED' | 'REJECTED'
type Category = 'MONITORING' | 'MICROPHONES' | 'PA' | 'BACKLINE' | 'LIGHTING' | 'STAGE' | 'POWER' | 'HOSPITALITY'

interface BriefItem {
  id: string
  category: Category
  title: string
  description: string
  provider?: 'BAND' | 'VENUE' | 'ENGINEER'
  status: ItemStatus
  requestedBy: string              // Band member name
  createdBy?: Role
  pendingConfirmationFrom?: Role   // Who needs to confirm the current state
  assignedTo: string               // Engineer name
  comments: Comment[]
  specs?: { make?: string; model?: string; quantity?: number; notes?: string }
}

interface Comment {
  id: string
  author: string
  role: Role
  text: string
  timestamp: string
  type?: 'TEXT' | 'STATUS_CHANGE' | 'PROVIDER_CHANGE' | 'ITEM_REVISION'
  newStatus?: ItemStatus
  newProvider?: 'BAND' | 'VENUE' | 'ENGINEER'
  previousData?: Partial<BriefItem>
  newData?: Partial<BriefItem>
}
```

---

## State Management

All state lives in `App.tsx` using `useState` + `useEffect`. No Redux or Context API.

Key state:
- `items` — array of `BriefItem`, persisted to `localStorage`
- `selectedItem` — currently active item (drives detail panel)
- `currentUserRole` — `'BAND'` or `'ENGINEER'` (simulates switching perspectives)
- `isNewItemPanelOpen`, `editingItem`, `isResetDialogOpen` — panel/modal flags

**Persistence**: `useEffect` syncs `items` to `localStorage` on every change.

---

## Status Flow

```
PENDING ↔ DISCUSSING ↔ AGREED
```

- Status changes are role-aware (uses `pendingConfirmationFrom`)
- Provider changes auto-revert item to DISCUSSING
- All changes (status, provider, edits) are auto-logged as system `Comment` entries in the discussion thread

---

## Design System

Defined in `index.css` via Tailwind `@theme`:

```css
--font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif
--font-mono: "Courier New", Courier, monospace
--font-serif: "Georgia", serif
--color-tech-bg: #E4E3E0   /* warm off-white background */
--color-tech-ink: #141414   /* near-black text */
```

Aesthetic: minimalist, technical, monochrome with industrial typography.

---

## Key Conventions

- **Slide-in panels** for detail view, edit, and create — animated with Motion
- **Controlled inputs** — all form state managed locally in each panel component
- **System comments** — state changes are recorded as typed comments, not just mutations
- **Role-based UI** — buttons and actions differ based on `currentUserRole`
- **Collapsible categories** — `BriefList` groups items by category with toggle
- **`FormFields.tsx`** — reusable form primitives shared by `NewItemPanel` and `EditItemPanel`

---

## Deployment

- Vite base path: `/Miked-Briefing-System/` (configured for GitHub Pages)
- Dev command: `vite --port=5000 --host=0.0.0.0`
- HMR can be disabled via `DISABLE_HMR=true` env var (for AI Studio compat)

---

## Not Yet Implemented

- Gemini AI integration (API key configured, import present, not used)
- Express backend / SQLite database (dependencies installed but inactive)
- Multi-user real-time sync (currently simulated by role toggle)
