# 🚀 Shopee Open API v2 Simulator & Shopiz Client — Next Session Kickoff Prompt

Use this prompt when initiating a new coding or pairing session with an AI coding assistant (Antigravity or any LLM agent). It eliminates context decay, establishes the technical baseline, and guarantees immediate productive pairing.

---

## 📋 Copy-Paste Prompt for New Session

```markdown
We are continuing development on the **Shopee Open API v2 Simulator** (`shopee-simulator/`) and the integrated **Shopiz Marketplace & Seller Center client** (`shopiz/`).

### 1. Context & Technical Baseline
- **Backend Simulator (`shopee-simulator/`):**
  - **Current Version:** v1.12.0 (Phases 1 through 14 complete, Cloud Media Storage via Google Drive/Local, Automated CI/CD, Tri-Persona vi-VN Testbed on port 8080, Dynamic Logistics Carrier Calculation Engine, Multi-Shop Storefront & Fulfillment APIs, Shopee 3-Level Category Tree Hierarchy with 39 Categories and 77 Mandatory/Key Attributes).
  - **Docker Containers:** `shopee-mock-server` on port 8080, `shopee-mock-postgres` on port 5432 (PostgreSQL 16).
  - **Test Baseline:** 540 / 540 passing assertions (100% pass rate). Run `cd shopee-simulator && npm test` to verify backend health.
  - **Git Branch:** `feature/category-tree-and-attributes`.
- **Frontend Client (`shopiz/`):**
  - **Framework:** React 19, Vite 6, React Router 7, CSS Modules, Lucide React, Axios.
  - **Git Branch:** `backend-integration` (commit in small chunks per project conventions).
  - **Key Pages & Capabilities:**
    - Marketplace Storefront (`/`, `/search`, `/product/:id`, `/collection/mall`, `/collection/flash-deals`).
    - Dynamic Carrier Rate Calculation (`POST /api/v2/simulator/logistics/calculate_fee`) on Product and Checkout pages based on recipient city (`SPX Express`, `SPX Instant`, `SPX Economy`).
    - Live Interactive Chat (`ChatDialog.jsx`, `chatService.js`) with shop/product/order context pinning.
    - Multi-Shop Storefronts (`/shop/727720655`, `/shop/839910244`, `/shop/910283751`) with live ratings, followers, joined duration, and dynamic campaign vouchers.
    - Buyer Purchases (`/account/purchases`) with Contact Seller live chat, Delivery Confirmation (escrow release), and 5-star reviews.
    - Multi-Address Checkout with PostgreSQL synchronization (`addressService.js`).
    - Multi-Shop Seller Center Portal (`/seller/select-shop` and `ShopSelectPage.jsx`) with instant "Switch Shop" shortcuts.
    - Seller Center Control Console (`/seller`) with live backend orders, "Arrange Shipment" (`POST /simulator/order/ship`), printable Air Waybill PDFs (`GET /simulator/order/download_awb`), catalog inventory toggle unlist (`POST /simulator/product/toggle_unlist`), and marketing campaign vouchers.
  - **Test Baseline:** 100% pass across all Playwright suites:
    - `npm run check:shop-select`
    - `npm run check:seller`
    - `npm run check:checkout`
    - `npm run check:purchases`
    - `npm run check:shipping-chat`
    - `npm run check:integration`

### 2. Architecture & Rules of Engagement
- **Small Commits Rule:** Always commit code in small, well-scoped atomic chunks following the Conventional Commits specification.
- **Two-Layer Backend Architecture:**
  - **Layer A (`/api/v2/{module}/{action}`)**: Official partner endpoints with strict HMAC-SHA256 signature verification (`shopeeAuthGuard`), standard Shopee envelope `{ error, message, response, request_id }`, and official error codes.
  - **Layer B (`/api/v2/simulator/*`)**: Public simulator helpers, Buyer actions, and Shopiz integration routes in `src/modules/simulator/simulator.router.ts`.
- **UI Platform & Localization Standards:**
  - Browser testbed is at `shopee-simulator/public/index.html` (port 8080) with authentic Vietnamese copy (`vi-VN`).
  - Shopiz marketplace and Seller Center are in `shopiz/` (port 5173) with clean monochrome styling.
  - All developer explanations, code comments, and git commits MUST remain in **English**.
- **Docker Container Build Hygiene:**
  - Whenever updating TypeScript in `shopee-simulator/src/`, compile with `npm run build` and synchronize into the container:
    `docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker restart shopee-mock-server`

### 3. Key Reference Documentation
- **Master Protocol Spec & API Index:** `SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md`
- **Backend Changelog:** `shopee-simulator/CHANGELOG.md`
- **Frontend Documentation:** `shopiz/README.md`
- **Workspace Skill:** `.agents/skills/shopee-simulator/SKILL.md`

Please confirm that you have checked the repositories, verified baseline health via `npm test` and `npm run check:integration`, and are ready for the next task.
```

---

## 🛠 Quick Agent Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Verify Backend Tests** | `cd shopee-simulator && npm test` |
| **Compile Backend TypeScript** | `cd shopee-simulator && npm run build` |
| **Synchronize Live Backend Container** | `docker cp shopee-simulator/dist/. shopee-mock-server:/app/dist/ && docker restart shopee-mock-server` |
| **Verify Frontend Integration** | `cd shopiz && npm run check:integration` |
| **Verify Multi-Shop Selector** | `cd shopiz && npm run check:shop-select` |
| **Verify Seller Center Suite** | `cd shopiz && SHOPIZ_URL="http://127.0.0.1:5173" node scripts/verify-seller.mjs` |
| **Verify Dynamic Shipping & Live Chat** | `cd shopiz && npm run check:shipping-chat` |
| **Verify Checkout Suite** | `cd shopiz && npm run check:checkout` |
| **Verify Purchases Suite** | `cd shopiz && npm run check:purchases` |

