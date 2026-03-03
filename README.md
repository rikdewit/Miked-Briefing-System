# Miked Briefing System

A collaborative negotiation platform for bands and audio engineers to discuss, negotiate, and finalize gear requirements and show-day agreements through a structured discussion interface.

## Overview

The Miked Briefing System provides a dedicated workspace for managing the negotiation between a band and an audio engineer. Create items to discuss specific gear, setup, or logistical needs, then use the discussion log to work through each item until both parties agree. Track which items have been settled and which still need discussion, maintaining a complete record of all agreements made.

### Key Features

- **Item Management**: Create, edit, and organize discussion items about gear, setup, and agreements
- **Status Workflow**: Track items through stages (In Progress → Agreed → Reopened for revision)
- **Role-Based Interface**: Switch between Band and Engineer perspectives to see discussions from each viewpoint
- **Discussion Log**: Maintain a complete history of negotiation comments and decisions on each item
- **Global Chat**: Team-wide communication channel for general discussion and announcements
- **Agreement Tracking**: See at a glance which items have been agreed upon vs. still need discussion
- **Local Persistence**: All items and messages are automatically saved to browser storage
- **Real-Time Updates**: Instant reflection of status changes and new comments across the interface

## Project Structure

```
src/
├── components/
│   ├── BriefList.tsx              # Main item list showing negotiation status
│   ├── ItemDetailView.tsx         # Detail view with discussion log for selected item
│   ├── GlobalChat.tsx             # Team chat and new item creation
│   ├── DiscussionLog.tsx          # Comment rendering and negotiation history
│   ├── NewItemForm.tsx            # Form for creating new discussion items
│   ├── EditItemForm.tsx           # Form for editing existing items
│   ├── Badges.tsx                 # Status and role indicators
│   └── ...
├── hooks/
│   ├── useBriefItems.ts           # State management for items and negotiation handlers
│   └── useGlobalMessages.ts       # State management for global chat
├── types.ts                        # TypeScript type definitions
├── App.tsx                         # Main app layout and state coordination
└── main.tsx                        # React entry point
```

## Running Locally

### Prerequisites
- Node.js 18+ and npm

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

3. **Optional: Build for production**
   ```bash
   npm run build
   ```

## Usage

### Creating a Discussion Item

1. Click the **"+ New Item"** button in the Global Chat panel (right side)
2. Write a clear description of the item you want to discuss (e.g., "PA system requirements," "Monitor setup," "Parking arrangements")
3. Submit to add it to the negotiation list

### Managing Items

- **Edit**: Select an item and use the edit pencil icon to refine the description
- **Status Changes**:
  - Mark as "Agreed" when both parties have reached consensus on the item
  - Reopen an agreed item if additional discussion is needed (automatically notes when it was reopened)
- **Delete**: Remove items using the trash icon if they're no longer relevant

### Discussing Items

1. Select an item from the list to open its detail view
2. Add comments in the **Discussion Log** section to negotiate, suggest, or respond
3. Comments show your role (Band/Engineer) and timestamp
4. All negotiation history is preserved in the item's comment thread, creating a complete record of the agreement process

### Switching Roles

Use the **User Cog** icon in the top navigation to switch between Band and Engineer roles. This changes:
- How you appear in comments and chat ("You (Band)" vs "You (Eng)")
- Your perspective when viewing items and discussions
- Useful for simulating both sides of the negotiation

### Global Chat

The right panel provides a general discussion channel for announcements and conversations not tied to specific items. Messages include:
- Sender role and timestamp
- Full message history with local persistence

## Technology Stack

- **React** 19 - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling and responsive design
- **Vite** - Fast build tool and dev server
- **Lucide React** - Icon library
- **Motion** - Smooth animations and transitions
- **Express.js** - Optional backend capabilities

## Data Persistence

All items and messages are automatically saved to the browser's localStorage:
- `briefItems` - Stores all negotiation items, discussion comments, and agreement status
- `globalMessages` - Stores all global chat messages

**Reset Data**: Click the **Refresh** icon in the top navigation to clear all items and messages, restoring the app to its initial state.

## Browser Compatibility

The app works in all modern browsers that support:
- ES2020+ JavaScript
- localStorage API
- CSS Grid and Flexbox

Recommended browsers:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server on port 5000 |
| `npm run build` | Build for production to `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove build artifacts |
| `npm run lint` | Type-check code without emitting |

## Architecture Highlights

### State Management
- **useBriefItems**: Centralized hook managing item CRUD operations, agreement status, and comment negotiation
- **useGlobalMessages**: Dedicated hook for global chat messages

### Component Design
- **Single Responsibility**: Each component focuses on a specific UI concern
- **Prop Drilling Minimized**: Core state lifted to App.tsx with handlers passed down
- **Reusable Forms**: NewItemForm and EditItemForm share a common pattern
- **Discussion Clarity**: DiscussionLog clearly shows negotiation history with visual indicators for agreements

### Styling
- Tailwind CSS for responsive, utility-first design
- Color-coded status indicators (orange for in-progress, green for agreed)
- Clear visual hierarchy for agreement vs. open items
- Motion animations for smooth user experience

## Future Enhancements

Potential improvements for consideration:
- Zustand store for managing currentUserRole and UI state (if prop drilling becomes problematic)
- Backend persistence with database integration
- Real-time collaboration with WebSocket support
- PDF export of final agreements
- Email notifications when items are marked as agreed
- Timestamps on agreements for record-keeping

## Troubleshooting

### Data Not Persisting?
- Check browser localStorage is enabled
- Verify browser isn't in private/incognito mode
- Clear cache and reload if experiencing unexpected behavior

### Performance Issues?
- localStorage has ~5-10MB limit; consider archiving or exporting old negotiations if data grows significantly
- Build size can be optimized with production build

### Dev Server Not Starting?
- Ensure port 5000 is available
- Try `npm run clean && npm install` to reset dependencies
- Check that Node.js version is 18+

### Items Not Saving?
- Check browser localStorage is enabled (not disabled by privacy settings)
- Verify browser isn't in private/incognito mode
- Try refreshing the page to verify items were persisted

## Common Use Cases

### Pre-Show Negotiation
1. Create items for each area that needs agreement (sound system, stage setup, load-in time, etc.)
2. Both parties discuss each item in its comment thread
3. Engineer marks items as "Agreed" once consensus is reached
4. Band reopens items if additional clarification is needed
5. Final agreed list serves as binding agreement for show day

### Multi-Show Planning
- Create one negotiation per show/venue
- Reference previous agreed items when creating new ones
- Track what was agreed in past shows for continuity

## License

This project is a work in progress and proprietary to the Miked system.
