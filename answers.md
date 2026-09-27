# Required Written Answers (Section 10)

This document contains written answers to the mandatory evaluation questions specified in Section 10 of the Tech Inject Design Library assignment.

---

### 1. Reference Analysis: Identifying Reusable Components, Variants, and Shared Tokens

I analyzed the Sales CRM reference interface by cataloguing high-frequency interaction patterns and isolating visual primitives (such as the 7 semantic stage colors: `#64748B` for lead up to `#10B981` for closed won) from compound containers. For component boundaries, I explicitly decoupled `StatusStageBadge` as an independent primitive from `DealPipelineCard` and `DealActionHeader`, rather than embedding stage badge markup inside deal cards, allowing any list or modal across the CRM to render stages consistently. Differences in stage state (lead, qualified, won) and sizing (`sm`, `md`, `lg`) were modeled as typed props on a single component contract rather than creating seven distinct components. I verified the recreation by rendering side-by-side comparative views in the catalogue (`ReferenceComparison.tsx`), matching font sizes, border radii (`rounded-xl` / `rounded-full`), and probability progress bar thresholds against the reference archetype.

---

### 2. Architecture and Clean Code: Stack Selection, SOLID/DRY, and KISS/YAGNI

I implemented a full-stack architecture combining a React 19 + TypeScript SPA with an Express backend using Vite middleware, providing true server-verified authentication, real file-backed JSON persistence in `data/`, and direct CLI endpoints. For practical SOLID/DRY design, the single-responsibility storage manager (`src/server/storage.ts`) encapsulates all file I/O and runtime sanitization, while client and server share unified TypeScript contracts (`src/types/registry.ts`) preventing schema divergence. Under KISS and YAGNI, I rejected building a multi-tenant role-permission engine and an in-browser Monaco code editor, choosing instead a clean environment-variable-backed admin secret token and structured JSON upload payloads with live preview rendering, fulfilling the exact assignment requirements without speculative complexity.

---

### 3. Publishing Consistency: Single Source of Truth, Update Failures, and Unpublishing

All four artifacts—the live preview, copied TSX source, CLI installer payload (`/api/cli/install/:slug`), and AI agent integration prompt (`/api/components/:slug/prompt`)—are derived directly from the exact same component definition stored in the persistent registry (`storage.getComponent(slug)`). When an update is submitted, server-side atomic validation verifies slug format, file paths, and AST safety before persisting changes; if validation fails, the transaction aborts with an HTTP 400 error and the existing published version remains untouched. When a component is unpublished via `/api/admin/components/:slug/unpublish`, its status changes to `unpublished`, which immediately triggers a 404 response on public detail routes, strips it from catalogue queries, and blocks CLI install downloads without requiring a frontend redeploy.

---

### 4. Security: Safe Previews, Admin Verification, and Consumer Installation

When accepting component uploads and executing consumer installs, risks include cross-site scripting (XSS), path traversal attacks writing to arbitrary system directories, and unauthorized administrative writes. To defend against these, admin routes require server-verified tokens (`x-admin-token` or Bearer auth) matched against server environment secrets, and upload payloads are scanned for dangerous execution patterns (`child_process`, `execSync`). For consumer installation, the CLI runner and `/api/cli/install/:slug` endpoint strictly reject any file path containing relative directory traversal (`..`) or absolute paths (`/`), constraining writes exclusively to the consumer project's `src/components/crm/` folder. The current limitation is that dynamically uploaded untyped components run within client sandboxes without full server-side VM isolation, which in an enterprise production environment would be supplemented by isolated web worker sandboxes or iframe isolation with restricted CSP policies.

---

### 5. AI Ownership: Challenging Assumptions and Verifying Consumer Integrations

During initial scaffolding, an AI suggestion recommended storing premium access status solely inside frontend client state and local storage, assuming client-side route hiding would be sufficient. I challenged this assumption because client-side gating permits trivial source leakage via direct `curl` requests or network inspection; I redesigned the backend so that every protected endpoint (`/api/components/:slug`, `/api/components/:slug/source`, `/api/cli/install/:slug`, and `/api/components/:slug/prompt`) re-verifies customer premium entitlement against the persistent database on every request. I tested consumer compatibility by extracting the copied code, the npx CLI script (`/api/cli/run`), and the AI agent prompt into a clean consumer application, verifying that `StatusStageBadge` and `MetricsKpiCard` compiled cleanly with standard React 19 and Tailwind CSS without missing theme dependencies.

---

### 6. Production Ownership: Release Checks, Incident Response, and Recovery

I verified release readiness through a combination of automated checks (`tsx test-suite.ts` verifying unauthorized write rejection, path traversal blocks, and draft isolation) and browser verification of responsiveness across desktop, tablet, and mobile breakpoints. If a newly published component breaks after release, I would first inspect server logs and client console errors to identify whether the regression is a missing dependency or rendering exception, unpublish the affected component via the admin endpoint `/api/admin/components/:slug/unpublish` to immediately shield users without taking down the platform, and rollback to the last verified commit or restore `data/components.json` from backup. I would communicate the incident clearly to the team with the root cause, immediate mitigation taken, and ETA for the permanent fix.

---

### 7. Premium Access: Privilege Modeling, Revocation, and Limits

Account access is strictly separated into three independent dimensions: identity (authenticated user ID), customer entitlement (`isPremium: boolean`), and platform administrative authorization (`role: 'admin'`), preventing customer accounts from elevating their own privileges. Unauthenticated visitors and free customers (`free@customer.com`) receive stripped metadata and static SVG thumbnails; direct GET requests to `/api/components/:slug/source` and CLI installs return HTTP 403 Forbidden with `ERR_PREMIUM_REQUIRED`. When an administrator revokes premium access via `/api/admin/users/:id/toggle-premium`, the user's database record is updated immediately, causing their very next API or CLI request to be denied even if their browser session is still active. As documented in Section 5, revocation prevents all future downloads, source views, and updates, but fundamentally cannot delete or un-copy files that a developer has already downloaded to their local disk or committed to their private Git repository.
