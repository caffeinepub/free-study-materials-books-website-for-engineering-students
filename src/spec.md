# Specification

## Summary
**Goal:** Allow admins to upload study material files directly into the backend and attach them to resources, while keeping existing external-link resources working as-is.

**Planned changes:**
- Extend the backend resource model to support file-backed materials in addition to external URLs, including admin-only APIs to upload/manage files and a public method to retrieve a download URL (or equivalent info) for students.
- Ensure all admin upload/manage backend methods reject non-admin callers with a clear Unauthorized error, and preserve existing department/semester/subject resource data.
- Add an admin workflow in Admin > Resources to create a resource via either external URL or file upload (file picker + required metadata), with validation, disabled submit during upload, and automatic refetch so the new resource appears immediately.
- Update public resource rendering so external URL resources still open the external link, while file-backed resources open/download via the generated public download URL.
- Update Admin Help text to document both options (upload in PREMJI and external hosting), in English.

**User-visible outcome:** Admins can upload files (e.g., PDFs) and attach them as resources to specific Department/Semester/Subject entries, and students can open/download those uploaded materials from browse/search pages just like external links.
