# Tech Inject Design Library

Production-ready Next.js / React + TypeScript component library and publishing platform designed to establish a shared design standard for Sales CRM applications.

The project features two seamlessly integrated web apps powered by a shared full-stack Express + Vite architecture:
1. **Public Component Catalogue**: Allows developers to browse free and premium CRM components, inspect interactive previews, copy typed source code, run CLI installation commands, and copy context-rich AI agent prompts.
2. **Admin Publishing Dashboard**: Protected management panel where administrators publish/unpublish components, upload new component bundles with runtime validation, and manage customer premium entitlements with instant revocation.

---

## 🚀 Live App & Access Information

- **Development Preview URL**: `http://localhost:3000` (or your deployed cloud host)
- **Component Catalogue Route**: `/`
- **Admin Dashboard Route**: `/admin` (or toggle via top-right app switcher)

### Pre-Seeded Test Accounts (Zero Setup Required)

| Account Role | Email | Password | CLI / Agent Token | Access Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techinject.internal` | `admin123` | `tech_adm_sec_9942a7` | Full Publishing & Customer Access Control |
| **Free Customer** | `free@customer.com` | `free123` | `tech_cli_free_0884b2` | Public Catalogue + Free Components Only |
| **Premium Customer** | `premium@customer.com` | `premium123` | `tech_cli_prem_1884c9` | Full Access (Free + Premium Components) |

> **Reviewer Tip**: The application header features a **1-click account switcher** allowing you to instantly switch between Signed Out (Visitor), Free User, Premium User, and Administrator to verify access control behaviors and locked states in seconds.

---

## 📦 Component Inventory & Reference Analysis

Deconstructed from the Sales CRM visual reference into reusable, typed components:

| Component | Slug | Category | Tier | Status | Rationale & Boundary Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Status Stage Badge** | `status-stage-badge` | Badges | **Free** | Published | Extracted as an independent primitive with 7 semantic pipeline colors (`lead`, `qualified`, `proposal`, `won`, etc.) to prevent duplicate stage styling across cards and tables. |
| **Lead Score Badge** | `lead-score-badge` | Badges | **Free** | Published | Predictive qualification indicator (0-100) with cold/cool/warm/hot visual tiers, pulse icon, and breakdown tooltip. |
| **Metrics KPI Card** | `metrics-kpi-card` | Metrics | **Free** | Published | Executive stat card with formatted currency, percentage change delta, target attainment progress bar, and inline SVG sparkline. |
| **Deal Pipeline Card** | `deal-pipeline-card` | Cards | **Free** | Published | Kanban card featuring company branding, probability meter, expected close date, owner avatar, and stagnation age alert. |
| **Revenue Forecast Bar** | `revenue-forecast-bar` | Metrics | **Premium** | Published | Multi-tiered sales quota vs weighted forecast breakdown bar with hover tooltips, target quota benchmark line, and gap calculation. |
| **Deal Action Header** | `deal-action-header` | Actions | **Premium** | Published | High-density record header with clickable stage chevron stepper, quick actions (Log Call, Email, Task), and deal value editor. |
| **Activity Timeline Feed** | `activity-timeline-feed` | Timeline | **Premium** | Published | Omnichannel activity feed (Calls, Meetings, Emails, Notes, Stage Advancements) with category filtering and note logging. |
| **Filterable Deal Table** | `filterable-deal-table` | Tables | **Premium** | Published | High-density tabular view with multi-select checkboxes, sortable columns, stage filtering, and total pipeline sum footer. |

---

## 🛠 Local Setup & Verification Commands

### 1. Prerequisites
- Node.js >= 20.x or Bun >= 1.2
- npm / yarn / pnpm

### 2. Installation & Run
```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd tech-inject-design-library

# Install dependencies
npm install

# Start full-stack dev server (Express backend + Vite middleware)
npm run dev

# Run automated Section 8 verification checks
npm test

# Build production bundle
npm run build

# Start production server
npm run start
```

### 3. Environment Variables (`.env.example`)
```env
# Port for the full-stack server (default 3000)
PORT=3000

# Secret key required to access /api/admin/* endpoints
ADMIN_SECRET="admin-secret-token-key-2026"
```

---

## 💻 CLI & AI Agent Integration

### Working NPX Installation
Any component can be installed into a separate consumer project via NPX using the deployed registry:

```bash
# Installing a Free Component:
npx tech-inject add deal-pipeline-card

# Installing a Premium Component (Authenticated):
npx tech-inject add revenue-forecast-bar --token tech_cli_prem_1884c9
```

### Universal Runner One-Liner
If you do not have global npx aliases configured, run directly via Node.js:
```bash
node -e "$(curl -fsSL http://localhost:3000/api/cli/run)" -- add deal-pipeline-card
```

### Safety & Path Protections:
- Writes exclusively to `./src/components/crm/<Component>.tsx`.
- Strictly rejects directory traversal attempts (`..`) or absolute paths (`/`).
- Returns `HTTP 403 Forbidden` (`ERR_PREMIUM_REQUIRED`) when a signed-out or free user attempts to install premium components.

---

## 🤖 AI Usage & Ownership Disclosure

- **AI Tools Used**: Google AI Studio Build (Gemini 2.5 / 3.x Flash engine)
- **Representative Prompt**:
  > *"Analyze the Sales CRM reference UI and extract atomic design tokens for pipeline stages. Create a StatusStageBadge with semantic color tokens and an isolated preview renderer that does not leak parent window credentials or tokens."*
- **Assumption Challenged & Corrected**:
  - *Initial AI Suggestion*: The model initially proposed storing premium component source code in client-side bundles and relying on React router guards or CSS display toggles to hide code from free users.
  - *My Review & Correction*: I rejected this because client-side gating permits trivial source extraction via browser DevTools or direct network requests. I redesigned the backend so that `/api/components` strips all source files and install payloads for locked items, and added strict server-side authorization checks on `/api/components/:slug/source` and `/api/cli/install/:slug` that check live database entitlements on every single request.

---

## 🛡 Release Checks & Disaster Recovery Plan

### Pre-Release Verification
1. **Automated Check Suite**: Run `npm test` (`tsx test-suite.ts`) to ensure all 6 security invariants pass.
2. **Type Safety**: Run `npm run lint` (`tsc --noEmit`) to verify zero TypeScript errors.
3. **Cross-Device Responsiveness**: Test preview responsiveness on Desktop, Tablet (720px), and Mobile (375px) via the preview canvas toolbar.

### Post-Release Disaster Recovery
If a newly published component causes runtime errors or regression:
1. **Immediate Quarantine**: Admin clicks **Unpublish** on the affected component in the Admin Dashboard (`POST /api/admin/components/:slug/unpublish`). This instantly removes it from public listings and CLI downloads within milliseconds without requiring application restart or deployment rollback.
2. **Diagnosis**: Inspect server logs and client telemetry for unhandled prop exceptions or missing dependencies.
3. **Data Integrity**: All component and user records are safely stored in persistent file storage (`data/components.json` and `data/users.json`). The database can be restored to clean baseline state at any time via `POST /api/admin/reset`.

---

## 📋 Written Answers

All seven required written questions from Section 10 are answered in detail inside [`answers.md`](./answers.md).
