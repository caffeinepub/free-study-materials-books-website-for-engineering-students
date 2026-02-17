# Specification

## Summary
**Goal:** Fix admin access so the intended seeded admin Internet Identity principal can access `/admin` after fresh install and across upgrades.

**Planned changes:**
- Seed principal `019c5b4d-8259-74a9-955b-9afe01e4fab7` as an admin in the backend AccessControl state on fresh install.
- Add a backend Candid method `isCallerAdmin()` that returns a boolean consistent with existing admin permission checks.
- Ensure admin assignment persists across canister upgrades with minimal upgrade-safe persistence (adding `backend/migration.mo` only if required).
- Update frontend admin gating so `/admin` renders the Admin Panel for the seeded admin principal, while keeping current behavior for non-admin and unauthenticated users.

**User-visible outcome:** When logged in as `019c5b4d-8259-74a9-955b-9afe01e4fab7`, `/admin` shows the Admin Panel (not “Access Denied”), and admin-gated actions no longer fail as unauthorized; non-admin users still see “Access Denied” and unauthenticated users still see the login prompt.
