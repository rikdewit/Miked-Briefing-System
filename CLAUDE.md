# Claude Code Instructions for Miked-Briefing-System

## Dev Server Management

- **Only kill dev servers started for testing**: Use specific process targeting (e.g., `lsof -ti :5002 | xargs kill` to kill a specific port)
- **Never use `pkill -f "npm run dev"`** without careful verification, as the user may be running a separate dev server
- Verify the port first before killing any process

## Git & Commits

- **Never auto-commit code changes** — user will review and commit manually
- All code changes are for user review only
- Wait for explicit approval before any git operations

## Build & Testing

- Always verify builds succeed: `npm run build`
- Test dev server startup to confirm changes compile
- Report results to user before making further changes
