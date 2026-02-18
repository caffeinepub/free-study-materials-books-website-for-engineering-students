# Specification

## Summary
**Goal:** Fix the Search page build/deployment error and make the Department dropdown and loading/error flow reliable once catalog data is fetched.

**Planned changes:**
- Identify and resolve the frontend production build error originating from `frontend/src/pages/SearchPage.tsx` and its dependent catalog hooks/components used by the Department filter flow.
- Adjust Search page state/data flow so the Department dropdown is populated from `useGetAllDepartments()` results (showing “All Departments” plus one option per returned department), and stays correct across refetches.
- Ensure selecting a Department enables the Semester dropdown, and switching back to “All Departments” clears the Department filter and disables Semester until a Department is selected again.
- Update Search page loading/error handling to block filter rendering (or show loading/skeleton) until the actor is ready and the departments query has either succeeded or failed; keep the existing error card with a working Retry that calls `refetch()`, and treat an empty array only as “loaded” after a successful fetch.

**User-visible outcome:** The Search page builds and loads without errors, shows a correctly populated Department dropdown once data is available, and displays consistent loading/error states with a functional Retry.
