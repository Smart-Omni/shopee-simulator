# 🚀 Shopee Open API v2 Simulator & Shopiz Client — Next Session Kickoff Prompt

Use this prompt when starting a new coding or pairing session with an AI coding assistant. It establishes the current repository state, completed technical baseline, reference locations, and working protocols.

---

## 📋 Copy-Paste Prompt for New Session

```markdown
We are continuing development on the **Shopee Open API v2 Simulator** (`shopee-simulator/`) and the integrated **Shopiz Marketplace & Seller Center client** (`shopiz/`).

### 1. Current Repository State & Baseline
- **Backend Simulator (`shopee-simulator/`):**
  - Shopee Open API v2 mock server with Layer A signed partner APIs and Layer B simulator/integration APIs.
  - Current baseline: 573 passing assertions across 18 test phases.
  - Docker services: `shopee-mock-server` on port 8080 and `shopee-mock-postgres` on port 5432 (PostgreSQL 16).
  - Branch: `feature/shop-vouchers`.
- **Frontend Client (`shopiz/`):**
  - React 19, Vite 6, React Router 7, monochrome Shopiz design tokens, authentic Vietnamese (`vi-VN`) Seller Center console.
  - Reverse proxy: `/api/*` and `/uploads/*` forwarded to `http://127.0.0.1:8080`.
  - Branch: `backend-integration`.
- **Latest pushed simulator commits:** `65f2fac` (voucher management APIs) and `92f2238` (voucher documentation).
- **Latest pushed Shopiz commits:** `9f7d4e5` (Shop Vouchers management page) and `3ca27b5` (voucher documentation).

### 2. What Has Been Done
- **OAuth 2.0 Kernel & HMAC Auth (Phases 1–2):** 4-hour access tokens, 5-minute dual-token grace periods, HMAC-SHA256 signature enforcement on all signed Layer A endpoints.
- **Product Catalog, Category Trees & Attributes (Phases 3, 9, 15, 16):** 3-level Shopee category hierarchy (42 categories), 77 mandatory/key attributes, 2-tier variation Cartesian grids, unlist/relist lifecycle, product extra info metrics (views, unique likes, completed sales).
- **Orders, Shipping & Logistics (Phases 4, 5, 8, 10):** 7-stage order lifecycle, dynamic SPX carrier rate calculation engine by weight and region, thermal PDF Air Waybill generation with Code128 barcodes, overdue auto-cancellation.
- **Marketing, Reviews & Chat (Phases 7, 11, 17, 18):** Vouchers and discount promotions, buyer-seller chat threads, buyer order reviews, shop review dashboard with rolling 30-day comparisons, official seller replies, and complete **Shop Vouchers Management (Mã Giảm Giá Của Shop)** supporting all 7 Shopee usecases, custom code prefixes (`SMAR`, `HANO`, `SAIG`), product selection modal, order redemption history, and strict Shopee Coins (`Hoàn Xu`) grey-out protection.
- **Escrow Reconciliation & Disputes (Phases 12–13):** Mathematical escrow release ledger, return/refund dispute flow with proof uploads and admin arbitration desk.
- **Seller Center Console (`/seller`):** Authentic 7-group Vietnamese sidebar, multi-shop switcher (`/seller/select-shop`), All Orders management with CSV export and shipment arrangement, All Products with 2-tier variant expansion and creation/edit editor, Returns & Disputes management, Review Management dashboard, and Shop Vouchers console (`?tab=marketing_vouchers` / `?tab=vouchers`).

### 3. Reference Documentation & Specifications
When analyzing requirements, designing features, or updating documentation, consult and maintain these authoritative project files:

- **Protocol & Master API Index:** `SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md` (authoritative protocol blueprint covering 452 APIs, 35 webhooks, data schemas, and error codes).
- **UI Descriptions & Layout Specifications:** `UI-description/` (screen-by-screen specifications, layouts, controls, and workflows for authentic Shopee Vietnam interfaces).
  - *Rule:* Always check `UI-description/` first for the target screen. If a UI description does not exist for an assigned screen, request it before inventing proprietary layouts.
- **Official API Endpoint References:** `api-reference/` (raw crawled Shopee Open API v2 endpoint models, parameters, error codes, and sample payloads).
- **Backend Changelog & Architecture:** `shopee-simulator/CHANGELOG.md` and `shopee-simulator/README.md`.
- **Frontend Architecture & Client Docs:** `shopiz/README.md`.
- **Workspace Engineering Runbook:** `.agents/skills/shopee-simulator/SKILL.md` (protocol rules, BigInt polyfills, localization standards, and container synchronization).

*Documentation Maintenance Invariant:* Whenever implementing or modifying features, always file and update the corresponding documentation in `SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md`, `shopee-simulator/CHANGELOG.md`, and `shopiz/README.md`.

### 4. Architecture & Rules of Engagement
- **Small Commits:** Make atomic, well-scoped commits following Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`, `test(...)`). Do not merge branches unless explicitly requested.
- **Two-Layer Backend Architecture:**
  - **Layer A (`/api/v2/{module}/{action}`):** Official partner endpoints with strict HMAC-SHA256 signature verification (`shopeeAuthGuard`), standard Shopee response envelope (`{ error, message, response, request_id }`), and documented error codes.
  - **Layer B (`/api/v2/simulator/*`):** Public simulator helpers, Buyer actions, and Shopiz integration routes (primarily in `src/modules/simulator/simulator.router.ts`).
- **Localization:** All user-facing UI text, buttons, modals, labels, and toasts in the simulator testbed and Shopiz Seller Center MUST use authentic Vietnamese (`vi-VN`). Assistant responses, commit messages, code comments, and documentation remain in English.
- **Backend Build Hygiene:** When TypeScript under `shopee-simulator/src/` changes, run `npm run build`; synchronize `dist/` and `public/index.html` into the running container (`shopee-mock-server`), then restart the container.

### 5. Verification Commands
- Backend Tests: `cd shopee-simulator && npm test`
- Backend Compile: `cd shopee-simulator && npm run build`
- Frontend Integration: `cd shopiz && npm run check:integration`
- Seller Shop Vouchers: `cd shopiz && npm run check:seller-vouchers`
- Seller Review Management: `cd shopiz && npm run check:reviews`
- Seller All Orders: `cd shopiz && npm run check:all-orders`
- Seller All Products: `cd shopiz && npm run check:products-page`
- Seller Returns & Disputes: `cd shopiz && npm run check:returns-page`
- Seller Pagination: `cd shopiz && npm run check:seller-pagination`
- Seller Multi-Shop Selector: `cd shopiz && npm run check:shop-select`

First inspect both repositories and the relevant UI/API references, confirm the current branch and working tree, then report baseline status and state that you are ready for the next task.
```
```

---

## 🛠 Quick Agent Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Verify Backend Tests** | `cd shopee-simulator && npm test` |
| **Compile Backend TypeScript** | `cd shopee-simulator && npm run build` |
| **Synchronize Live Backend Container** | `cd shopee-simulator && docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker restart shopee-mock-server` |
| **Verify Frontend Integration** | `cd shopiz && npm run check:integration` |
| **Verify Shop Vouchers Suite** | `cd shopiz && npm run check:seller-vouchers` |
| **Verify Review Management** | `cd shopiz && npm run check:reviews` |
| **Verify All Orders Suite** | `cd shopiz && npm run check:all-orders` |
| **Verify Products Page Suite** | `cd shopiz && npm run check:products-page` |
| **Verify Returns & Disputes** | `cd shopiz && npm run check:returns-page` |
| **Verify Seller Pagination** | `cd shopiz && npm run check:seller-pagination` |
| **Verify Multi-Shop Switcher** | `cd shopiz && npm run check:shop-select` |
| **Verify Purchases Suite** | `cd shopiz && npm run check:purchases` |
