# Specification

## Summary
**Goal:** Build a public, mobile-friendly study resources website for engineering students with structured browsing, fast search/filtering, and an admin-only interface to manage the catalog.

**Planned changes:**
- Create responsive public pages: Home and a browse flow organized as Department/Branch → Semester → Subject → Resource list with open/download links.
- Add a searchable, filterable catalog UI (keyword search + filters for department/semester/subject/resource type) with clear empty states.
- Implement a single Motoko-canister backend data model and API to persist and query departments/semesters/subjects/resources (stable storage across upgrades).
- Add an admin-only management page using Internet Identity to create/update/delete catalog entries (at least resources), with backend authorization and basic form validation.
- Apply a consistent academic visual theme (not a blue+purple primary palette) across all pages, with clear navigation.
- Add and display generated static assets (logo in header, hero illustration on Home) and an English description of the site’s purpose.

**User-visible outcome:** Students can browse and search engineering study materials and books by academic structure and open/download resources without signing in, while authenticated admins can securely manage the resource catalog.
