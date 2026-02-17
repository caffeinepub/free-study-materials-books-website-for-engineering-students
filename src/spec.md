# Specification

## Summary
**Goal:** Fix admin access verification and ensure Department filtering/selection state works correctly in the Search/Catalog UI.

**Planned changes:**
- Backend: Add a candid-exposed query method `isCallerAdmin()` in `backend/main.mo` implemented exactly as specified so the frontend can reliably verify admin status.
- Frontend: Update AdminGuard (or the admin route access check) to call `isCallerAdmin()` and stop incorrectly showing “Access Denied” for authenticated admins.
- Frontend: Fix Department dropdown state so selecting a specific department updates the displayed selected value (not stuck on “All Departments”) and filters the shown resources to that department.
- Frontend: Keep current behavior where changing Department resets Semester and Subject, while keeping all dropdowns consistent with the active selection; selecting “All Departments” clears the filter.

**User-visible outcome:** Admin users can access `/admin` without an incorrect “Access Denied” screen, and users can select a Department on the Search page and see both the dropdown and results reflect that selection (with “All Departments” clearing the filter).
