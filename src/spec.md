# Specification

## Summary
**Goal:** Add a backend `isCallerAdmin()` canister query so the frontend `AdminGuard` / `useGetAdminStatus()` can reliably check whether the current caller is an admin.

**Planned changes:**
- Implement `isCallerAdmin()` in `backend/main.mo` as a `public query ({ caller })` function that returns `true` when `caller` is an admin and `false` otherwise using the existing access-control state.
- Ensure the method is exposed in the generated Candid/actor interface and is callable as `actor.isCallerAdmin()` from the frontend without trapping for non-admin users.

**User-visible outcome:** Admin users can pass the frontend permission check (and non-admin users are denied normally) without the error that `isCallerAdmin` is missing from the actor.
