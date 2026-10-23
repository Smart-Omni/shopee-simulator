# 🛒 Shopee Open API v2 Mock Simulator & Integration Testbed

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Test Suite](https://img.shields.io/badge/Tests-540%2F540%20Passing-brightgreen.svg)]()
[![Shopee Open API](https://img.shields.io/badge/Shopee%20Open%20API-v2%20Standard-orange.svg)]()

> High-fidelity, contractually conforming **Shopee Open API v2 Mock Server** and interactive web testbed built for **SmartOmni Channel** integration, multi-merchant e-commerce synchronization, automated testing, and development without sandbox rate limits or dependency on live Shopee seller accounts.

---

## 📑 Table of Contents

- [Architectural Philosophy](#-architectural-philosophy)
- [Supported Modules & Capabilities](#-supported-modules--capabilities)
- [Official Shopee Documentation & API Index](#-official-shopee-documentation--api-index)
- [Repository & Branching Workflow](#-repository--branching-workflow)
- [Conventional Commits Specification](#-conventional-commits-specification)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Guide for Coding Agents](#-guide-for-coding-agents)
- [Preventing Context Decay across Coding Sessions](#-preventing-context-decay-across-coding-sessions)

---

## 🏛 Architectural Philosophy

The simulator implements a **Two-Layer Dual Architecture**:

```
                       ┌──────────────────────────────────────────────┐
                       │           HTTP Requests to Port 8080         │
                       └──────────────────────┬───────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│                LAYER A                │   │                LAYER B                │
│    Official Shopee OpenAPI Routes     │   │      Simulator Helper Routes & UI     │
│       (/api/v2/{module}/{action})     │   │         (/api/v2/simulator/*)         │
├───────────────────────────────────────┤   ├───────────────────────────────────────┤
│ • Strict HMAC-SHA256 signature guard  │   │ • Public / Developer friendly         │
│ • Validates partner_id, timestamp     │   │ • Browser testbed & state injection   │
│ • Official envelope format:           │   │ • Multi-merchant catalog & checkout   │
│   { error, message, response, req_id }│   │ • SLA trigger, reviews, live chat     │
│ • Exact official error codes          │   │ • Webhook inspection & replay engine  │
└───────────────────┬───────────────────┘   └───────────────────┬───────────────────┘
                    │                                           │
                    └─────────────────────┬─────────────────────┘
                                          ▼
                   ┌─────────────────────────────────────────────┐
                   │    PostgreSQL Database (Prisma ORM)         │
                   │ • 14 relational tables (Shop, Order, etc.)  │
                   └─────────────────────────────────────────────┘
```

1. **Layer A — Official Shopee OpenAPI v2 Standard (`/api/v2/...`)**:
   - Strictly validates `partner_id`, `timestamp`, `access_token`, `shop_id`, and `sign` (HMAC-SHA256).
   - Returns official envelope: `{"error": "", "message": "", "response": { ... }, "request_id": "<uuid>"}`.
   - Exact error codes matching official Shopee specs (e.g. `error_sign`, `error_auth`, `error_param`, `product.duplicate_request`, `voucher.voucher_code_error`).
2. **Layer B — Simulator Controls & Browser UI (`/api/v2/simulator/...` & `public/index.html`)**:
   - Allows instant browser testing without manual cryptographic signing.
   - Tri-persona interface: **Seller Dashboard**, **Buyer Customer Storefront**, and **Shopee Admin Arbitration Desk**.
   - Real-time stock updates, order status advancement, AWB downloading, promotion creation, reviews, live chat, and webhook log inspector.

---

## 🚀 Supported Modules & Capabilities

The simulator has completed **Phases 1 through 14** with **509 automated assertions passing (100%)**:

### 1. Authentication & Dual-Token Grace Period (OAuth 2.0)
- `POST /api/v2/public/get_token_by_resend_code`: Exchange authorization code for initial `access_token` and `refresh_token`.
- `POST /api/v2/public/refresh_token`: Seamless token refresh with **5-Minute Dual-Token Grace Period** where old tokens remain valid to prevent race conditions during distributed refreshes.
- `GET /api/v2/shop/get_shop_info`: Retrieve shop metadata, region, status, and vacation state.

### 2. Outbound Push Webhook Dispatching & Retry Engine
- Dispatches signed outbound HTTP POST webhooks to client URL (e.g. SmartOmni Channel) with HMAC-SHA256 in `Authorization: <hex>` header.
- Implemented Push Webhooks:
  - **Code 1**: `shop_authorization` (Granted)
  - **Code 2**: `shop_authorization_canceled` (Revoked)
  - **Code 3**: `order_status_update` (UNPAID $\rightarrow$ READY_TO_SHIP $\rightarrow$ PROCESSED $\rightarrow$ SHIPPED $\rightarrow$ COMPLETED $\rightarrow$ CANCELLED)
  - **Code 4**: `order_trackingno_update`
  - **Code 7 & 9**: `item_promotion_update` & `marketing_campaign_update`
  - **Code 8**: `reserved_stock_change`
  - **Code 15**: `airwaybill_update`
  - **Code 29**: `return_status_update`
- Background retry worker with exponential backoff for failed webhook deliveries.

### 3. Product Catalog & 2-Tier Variations System (Fashion & Apparel)
- Official Endpoints: `get_item_list`, `get_item_base_info`, `get_model_list`, `add_item`, `init_tier_variation`, `update_stock`, `update_price`, `unlist_item`, `delete_item`.
- **2-Tier Variations (Color + Size)**: Cartesian matrix generator ($N \times M$ models) with automated `tier_index: [i, j]` mapping.
- **Variation Pricing Grid & Batch Apply**: Full interactive matrix UI supporting individual price, stock, and SKU customization per variation model with a one-click bulk apply tool.
- **Shopee 5:1 Price Ratio Rule**: Enforces that highest variation price cannot exceed $5 \times$ the lowest variation price ($\max/\min \le 5.0$), backed by real-time frontend indicators and backend rejection (`error_param`).
- **SKU Status & Stock Lifecycle**:
  - `POST /api/v2/product/unlist_item`: Batch unlisting/relisting (`NORMAL` $\leftrightarrow$ `UNLIST`).
  - `POST /api/v2/product/delete_item`: Soft-deletes listings (`SELLER_DELETE`) for both `NORMAL` and `UNLIST` products with official Shopee 90-day retention query support.
  - Storefront catalog filter: `GET /api/v2/simulator/products?view_mode=buyer` automatically hides unlisted items.
  - `POST /api/v2/simulator/product/quick_update_stock`: Instant stock adjustment per SKU model.

### 4. Order Management, Multi-Shop Cart & SLA Deadlines
- Official Endpoints: `get_order_list`, `get_order_detail`, `cancel_order`, `handle_buyer_cancellation`.
- **Complete 7-Stage State Machine**: `UNPAID` $\rightarrow$ `READY_TO_SHIP` $\rightarrow$ `PROCESSED` $\rightarrow$ `SHIPPED` $\rightarrow$ `COMPLETED` / `CANCELLED` / `IN_CANCEL`.
- **Multi-Shop Order Splitting**: Checkout automatically partitions multi-merchant shopping carts into independent packages per shop.
- **Selective Cart Item Checkout**: Checkbox per cart item + "Select All" toggle; only checked items are purchased; unselected items remain in cart.
- **Order SLA Fulfillment Deadline**:
  - Orders set `payTime = now` and `shipByDate = now + 48h` (2 Days to Ship).
  - SLA overdue auto-cancellation worker (`POST /api/v2/simulator/order/expire_overdue`) cancels overdue orders with `cancel_by: SYSTEM`, `cancel_reason: "Seller did not ship order on time"`, and fires Webhook Code 3.
  - Live deadline countdown badges (`Overdue`, `< 12h left`, or `1d 23h`) in the UI.

### 5. Dynamic Logistics & Shipping Fee Engine (Shopee Vietnam Standards)
- Official Endpoints: `ship_order`, `get_shipping_parameter`, `get_tracking_number`, `create_shipping_document`, `get_shipping_document_result`, `download_shipping_document`, `get_channel_list`, `calculate_shipping_fee`.
- **Chargeable Weight Formulation**: $\text{Chargeable Weight} = \max(\text{Actual Weight}, \frac{L \times W \times H}{5000\text{ cm}^3})$.
- **Geographic Zone Routing**: `INTRA_PROVINCE`, `INTRA_REGION`, `INTER_REGION` with Vietnamese diacritics normalization.
- **3 Carrier Channels**:
  - `SPX Express Standard` (Channel ID 30001)
  - `SPX Instant Hỏa Tốc` (Channel ID 30002 — same-city only, $\le 5$kg)
  - `SPX Economy Tiết Kiệm` (Channel ID 30003)
- **Shopee Freeship Xtra Platform Subsidies**:
  - Subtotal $\ge 150,000$ ₫ $\rightarrow$ offsets up to 15,000 ₫.
  - Subtotal $\ge 300,000$ ₫ $\rightarrow$ offsets up to 30,000 ₫.
- **Standard Thermal Airway Bill PDF**: Generates downloadable AWB with SPX barcode, Code128, and routing labels.

### 6. Frontend Simulation UI & Developer Testbed
- Serves responsive Single Page Application (`public/index.html`) on root `/` and `/ui`.
- Developer helper endpoints (`/api/v2/simulator/*`) for state inspection, token status, stock manipulation, and scenario testing.

### 7. Promotions & Marketing Center (Discounts & Vouchers)
- Official Endpoints: 12 Discount endpoints (`v2.discount.*`) and 6 Voucher endpoints (`v2.voucher.*`).
- Validates date windows, minimum basket spend, fixed/percentage rewards with maximum cap, quota exhaustion, and Holiday Mode rejection (`discount.error_holiday_mode`).

### 8. Customer Reviews & Store Ratings
- Official Endpoints: `GET /api/v2/product/get_comment`, `POST /api/v2/product/reply_comment`.
- Post-order 1–5 star reviews on `COMPLETED` orders with strict duplicate rejection (`product.duplicate_request`).
- Dynamic shop rating recalculation (`Shop.rating` and `Shop.ratingCount`).
- Seller reply management with duplicate reply prevention.

### 9. Live Customer Chat & Inquiries
- Real-time in-app Buyer $\leftrightarrow$ Seller messaging drawer (`POST /api/v2/simulator/chat/send`, `GET /api/v2/simulator/chat/messages`, `GET /api/v2/simulator/chat/conversations`, `POST /api/v2/simulator/chat/mark_read`).
- Unread message indicators, buyer thread switching, authentic username preservation, and instant seller replies.

### 10. Holiday / Vacation Mode
- `POST /api/v2/simulator/shop/vacation`: Blocks new order checkout and promotional campaign creation for shops on vacation.

### 11. Dual-Persona Interface & Vietnamese Localization (`vi-VN`)
- **1-Click Seeded Login**: Welcome screen supporting instant fast login for 3 seeded shops and 3 seeded buyers with strict view isolation.
- **Slide-Out Integration Console**: Developer controls (OAuth, webhooks, fault injection) isolated into a slide-out drawer (`🛠️ Bảng Kiểm Thử`).
- **Authentic Vietnamese Copy**: 100% of simulator UI copy standardized in official Shopee Vietnam terminology (*Kênh Người Bán*, *Sàn Mua Sắm Shopee*, *Chờ lấy hàng*, *Đang giao*, *Đã giao*, *Hủy đơn*, *Đã đánh giá*).

### 12. Payment & Escrow Reconciliation Module (Shopee Vietnam Accounting Standards)
- Official Endpoints:
  - `POST & GET /api/v2/payment/get_escrow_detail`: Detailed accounting breakdown per order (COGS, vouchers, shipping fees, rebates, commission, service, and transaction fees, and net escrow amount).
  - `POST /api/v2/payment/get_escrow_detail_batch`: Batch escrow query for up to 50 orders per request.
  - `POST & GET /api/v2/payment/get_escrow_list`: Filter released orders by escrow release timestamp range (`release_time_from` / `release_time_to`).
  - `GET /api/v2/payment/get_income_overview`: Summary of released payouts, pending escrow funds, and current wallet status.
- **Strict Shopee Vietnam Accounting Formula**:
  $$\text{escrow\_amount} = \text{cost\_of\_goods\_sold} - \text{voucher\_from\_seller} + \text{buyer\_paid\_shipping\_fee} - \text{actual\_shipping\_fee} + \text{shopee\_shipping\_rebate} - \text{commission\_fee} - \text{service\_fee} - \text{seller\_transaction\_fee}$$
- **Automated Settlement & Release Tracking**: Orders transitioning to `COMPLETED` automatically record `escrowReleaseTime = now` and shift from Pending to Released status in real-time.
- **Seller Center Financial UI (`public/index.html`)**:
  - Live Escrow Ledger card with 3 KPI metric cards (Released Payouts, Pending Escrow, Platform Fees Deducted).
  - Itemized settlement ledger table with one-click `[🔍 Chi tiết]` breakdown modal in authentic `vi-VN`.
- **Layer B Developer Helpers**:
  - `GET /api/v2/simulator/payment/overview` & `GET /api/v2/simulator/payment/escrow_detail` for friction-free frontend integration.

### 13. Returns, Refunds & Dispute Management Module (Shopee Open API v2 Standard)
- Official Endpoints:
  - `POST & GET /api/v2/returns/get_return_list`: Paginated query with status filtering (`JUDGING`, `REQUESTED`, `PROCESSING`, `ACCEPTED`, `CANCELLED`, `CLOSED`, `SELLER_DISPUTE`) and dual envelope compatibility (`return` & `return_list`).
  - `POST & GET /api/v2/returns/get_return_detail`: Itemized return and refund accounting, buyer profile, items, tracking number, proof images, and counter-offer status.
  - `POST /api/v2/returns/confirm`: Seller acceptance of return request or counter-offer, transitioning status to `ACCEPTED` and automatically deducting refund from order escrow.
  - `POST /api/v2/returns/dispute`: Seller dispute submission with predefined reason IDs (`47..52`) and evidence images.
  - `POST /api/v2/returns/reject`: Seller rejection of non-eligible return requests.
  - `POST /api/v2/returns/cancel_dispute`: In-flight dispute retraction reverting to previous pending status.
  - `POST /api/v2/returns/get_available_solutions`: Available resolution options (`RETURN_REFUND`, `REFUND_ONLY`).
  - `POST & GET /api/v2/returns/get_return_dispute_reason`: Official Shopee reason IDs: 47 (`ITEM_DAMAGED_BY_BUYER`), 48 (`WEIGHT_MEASUREMENT_MISMATCH`), 49 (`OTHER`), 50 (`INCORRECT_CLAIM`), 51 (`NON_RECEIPT_REJECT`), and 52 (`NOT_RECEIVED_RETURN`).
  - `POST /api/v2/returns/upload_proof` & `POST & GET /api/v2/returns/query_proof`: Dispute photo proof registration and retrieval.
- **Two-Layer Dual Business Flows**:
  - **Flow 1: Shopee-First Warehouse Validation (`warehouse_validation`)**: Buyer submits return $\rightarrow$ Shopee Admin reviews $\rightarrow$ Item shipped to platform warehouse $\rightarrow$ Physical inspection (`warehouse_inbound: PASS`) $\rightarrow$ Escrow refund issued. Post-acceptance seller compensation disputes supported.
  - **Flow 2: Seller-First Direct Validation (`seller_validation`)**: Direct confirmation, partial refund counter-offers, or escalation to Shopee Admin for formal arbitration.
- **Tri-Persona Interface (`public/index.html`)**:
  - Quick-switch between **Kênh Người Bán (Seller)**, **Sàn Mua Sắm Shopee (Buyer)**, and **Bàn Trọng Tài Shopee (Admin)**.
  - Shopee Admin Arbitration view with real-time status tabs and binding ruling controls (*Phê duyệt*, *Yêu cầu Shop bổ sung bằng chứng*, *Bác bỏ*, *Nhập kho Shopee*, *Ban hành phán quyết Trọng tài*).
- **Outbound Webhook Dispatching (Code 29)**: Real-time `RETURN_STATUS_UPDATE` push notifications on all status transitions.

### 11. Cloud Media Storage, CI/CD Pipeline & Marketplace Extensions (Phase 14)
- **Cloud Media Storage Engine (`src/common/storage/`)**:
  - **Google Drive Storage Provider**: OAuth2 User Credentials authorization with zero service-account quota blocks, direct upload to designated folder (`GOOGLE_DRIVE_FOLDER_ID`), and high-speed public CDN URLs (`https://lh3.googleusercontent.com/d/{fileId}`) that embed directly in HTML/React `<img>` and `<video>` tags.
  - **Local Filesystem Fallback**: In-memory and local disk (`public/uploads/`) fallback provider.
  - `POST /api/v2/simulator/media/upload`: Single photo (up to 10MB) or video clip (up to 50MB) upload.
  - `POST /api/v2/simulator/media/upload_multiple`: Multi-file batch upload (up to 10 files).
  - `POST /api/v2/media_space/upload_image`: Layer A official Shopee MediaSpace image upload connected to storage providers.
  - **Test Suite Spam Protection**: Automated skip in `npm test` prevents uploading dummy files to Google Drive while permitting live testing via `TEST_DRIVE_UPLOAD=true`.
- **Automated CI/CD Pipeline (`.github/workflows/ci.yml`)**:
  - Full GitHub Actions workflow with PostgreSQL 16 container service.
  - Automatically verifies `npm ci`, `npx prisma db push`, `npm run prisma:seed`, `npm run build`, and `npm test` across all 14 phases.
  - Automated cloud CD deploy hook dispatch on merges to `main`.
- **Marketplace & Simulator Backend Extensions (Shopiz Layer B)**:
  - **Buyer Auth**: `POST /api/v2/simulator/auth/login`, `register` (salted `crypto.scryptSync` hashing), `forgot_password`, and profile lookup/update.
  - **Shipping Addresses**: Full CRUD + `set_default` primary address selection.
  - **Marketplace Catalog & Search**: `categories` tree, keyword search (`?q=...`), category filtering, price/sales sorting, rich product detail with variations and reviews, and shop storefronts.
  - **Multi-Shop Checkout & Settlement**: `logistics/channels` quotes, voucher validation, `batch_checkout` (creating distinct orders per shop), and `confirm_delivery` (transitioning to `COMPLETED` and releasing escrow).
  - **Seller Analytics**: Order volumes, gross merchandise value, conversion rates, and SVG chart curves.

---

## 📚 Official Shopee Documentation & API Index

The parent directory (`../`) contains the comprehensive crawled Shopee Open API v2 documentation:

| Directory / File | Description |
| :--- | :--- |
| **`../api-reference/`** | 452 markdown files covering all official Shopee Open API v2 endpoints across 31 modules (Product, Order, Logistics, Discount, Voucher, Payment, etc.). |
| **`../push-mechanism/`** | 35 webhook documentation files and JSON schema definitions (Order Push, Product Push, Marketing Push, etc.). |
| **`../developer-guides/`** | 64 developer guides on OAuth 2.0 flows, signature generation, and seller workflows. |
| **`../SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md`** | Master blueprint and complete index of 452 APIs with paths, methods, HMAC scopes, and protocol tables. |
| **`../SHOPEE_MOCK_IMPLEMENTATION_PLAN.md`** | Phased architectural specification and database schema roadmap. |
| **`CHANGELOG.md`** | Semantic versioning log tracking changes, enhancements, and bug fixes across all phases. |

---

## 🌿 Repository & Branching Workflow

This project adheres to the **Gitflow-inspired trunk-and-development branching strategy**:

- **`main`**: The production-ready, stable release branch. Every release on `main` is tagged with a semantic version (e.g. `v1.5.0`). Direct pushes to `main` should only occur for tagged releases.
- **`develop`**: The primary active integration branch. All ongoing feature additions, enhancements, and phase implementations are committed here.
- **`feature/<name>`** or **`fix/<name>`**: Feature and hotfix branches created off `develop`, merged back to `develop` via pull requests or verified commits.

---

## ✍️ Conventional Commits Specification

All commit messages in this repository **must** strictly conform to the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types
- **`feat`**: A new user-facing feature or API endpoint (e.g., `feat(chat): implement buyer-seller live messaging`).
- **`fix`**: A bug fix (e.g., `fix(cart): prevent single order combining multi-shop packages`).
- **`docs`**: Documentation changes only (e.g., `docs(readme): update API index references`).
- **`style`**: Formatting, white-space, CSS polish without logic change.
- **`refactor`**: Code restructuring that neither fixes a bug nor adds a feature.
- **`perf`**: Performance optimizations.
- **`test`**: Adding missing tests or correcting existing tests (e.g., `test(phase11): add test coverage for product reviews`).
- **`chore`**: Maintenance, build configs, dependencies (e.g., `chore(docker): update container restart policy`).

---

## 💻 Getting Started & Local Development

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher
- Docker & Docker Compose (for PostgreSQL and containerized server)

### 1. Environment Setup
```bash
cp .env.example .env
```
Ensure `.env` contains:
```ini
PORT=8080
DATABASE_URL="postgresql://shopee:shopee_mock_password@localhost:5432/shopee_mock_db?schema=public"
NODE_ENV=development
```

### 2. Start PostgreSQL Database
```bash
docker compose up -d postgres
```

### 3. Database Migration & Seeding
```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

### 4. Build TypeScript
```bash
npm run build
```

### 5. Run Locally or with Docker
- **Local Dev Server:**
  ```bash
  npm run dev
  ```
- **Containerized Server:**
  ```bash
  # Option A: Full container build & launch
  docker compose up -d --build shopee-simulator

  # Option B: Hot-sync compiled build without recreating container
  docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker cp prisma/schema.prisma shopee-mock-server:/app/prisma/schema.prisma && docker restart shopee-mock-server
  ```
- Open browser at `http://localhost:8080/` to access the interactive web testbed.

---

## ☁️ Cloud Deployment & Production Hosting (Free Tier)

The simulator is production-ready for deployment on free cloud infrastructure:

```mermaid
flowchart LR
    subgraph Repo["GitHub Repository"]
        src["wishuponsirius/shopee-simulator"]
    end
    subgraph CI["GitHub Actions CI/CD"]
        ci["ci.yml: 14 Phases Test & Build"]
    end
    subgraph Cloud["Free Cloud Infrastructure"]
        neon[("Neon.tech PostgreSQL 16<br/>(0.5 GB Free Serverless DB)")]
        render["Render.com Web Service<br/>(Free Tier, Auto-SSL, Docker)"]
    end
    subgraph Clients["Frontend Clients"]
        shopiz["Shopiz Marketplace / Seller Center"]
        omni["SmartOmni Channel Integration"]
    end

    src -->|Push / PR| ci
    ci -->|On Merge to main| render
    render <-->|DATABASE_URL| neon
    shopiz -->|REST API /api/v2/simulator/*| render
    omni -->|HMAC OpenAPI /api/v2/*| render
```

### Free Stack Recommendation
1. **Database**: [Neon.tech](https://neon.tech) Serverless PostgreSQL 16
   - 0.5 GB permanent storage, zero credit card required, serverless auto-scaling.
2. **Web Service**: [Render.com](https://render.com) Web Service
   - Connects directly to GitHub repo, auto-detects `Dockerfile`, and provisions free SSL (`https://...`).
3. **Environment Variables on Cloud**:
   - `DATABASE_URL`: Connection string from Neon (`postgresql://user:pass@ep-...neon.tech/neondb?sslmode=require`).
   - `NODE_ENV`: `production`
   - *(Optional)* `GOOGLE_DRIVE_*`: For live cloud media uploads.

---

## 🧪 Testing & Quality Assurance

The simulator includes comprehensive automated test suites covering all 14 phases:

```bash
npm test
```

### Test Suite Invariants
- **100% Pass Rate**: All 509 assertions must pass.
- **Zero Regressions**: Any modification to existing modules must not break backward compatibility tests (Phases 1–14).
- **Google Drive Protection**: Automated skip in `npm test` prevents uploading test images to Google Drive. To run live upload verification:
  ```bash
  TEST_DRIVE_UPLOAD=true npm run test:phase14
  ```
- **Network Note**: Because PostgreSQL operates on `localhost:5432`, ensure commands running the test suite have network socket access (`BypassSandbox: true` if using AI sandboxed terminals).

---

## 🤖 Guide for Coding Agents

When an AI coding agent begins a task in this repository:

1. **Check Baseline**: Run `npm test` immediately. Verify that all 509 assertions pass before touching code.
2. **Review Spec & Official Docs**:
   - Locate the target endpoint documentation in `../api-reference/<Module>/v2.<module>.<action>.md`.
   - Check webhook payloads in `../push-mechanism/`.
3. **Follow Architectural Dual-Layer Rule**:
   - Official endpoints (`/api/v2/...`) **must** use `shopeeAuthGuard` and envelope `createShopeeSuccessResponse` / `createShopeeErrorResponse`.
   - Simulator UI helper endpoints (`/api/v2/simulator/...`) belong in `src/modules/simulator/simulator.router.ts`.
4. **Preserve Documentation Integrity**: Do not remove existing comments, docstrings, or test assertions.
5. **Update UI & Vietnamese Localization (`vi-VN`)**: When updating or adding features, update `public/index.html` adhering to the standard Shopee Orange `#ee4d2d` palette. All user-facing UI text, buttons, modals, badges, form labels, and toasts MUST be in **Vietnamese (`vi-VN`)** matching official Shopee Vietnam terminology. All assistant responses, commit messages, and developer communication remain in **English**.
6. **Compile, Hot-Sync & Re-verify**:
   ```bash
   npm run build
   npm test
   # If testing via browser on port 8080:
   docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker cp prisma/schema.prisma shopee-mock-server:/app/prisma/schema.prisma && docker restart shopee-mock-server
   ```
7. **Commit Changes**: Commit using Conventional Commits on the `develop` branch.

---

## 🛡 Preventing Context Decay across Coding Sessions

To safely transition to a new coding session while preserving maximum efficiency:

1. **Commit Current State**: Ensure all working changes are committed to the `develop` branch with Conventional Commit formatting.
2. **Consult CHANGELOG & README**: The `README.md` and `CHANGELOG.md` represent the immutable project state.
3. **Leverage the Workspace Skill**: The simulator has a dedicated skill at `.agents/skills/shopee-simulator/SKILL.md`. In Antigravity, workspace skills persist across conversation sessions and load automatically into any new agent prompt.
4. **Kickoff Prompt for New Sessions**: Use the prompt template in [`PROMPT_NEXT_SESSION.md`](./PROMPT_NEXT_SESSION.md) when starting a fresh session:

> *"We are continuing development on the Shopee Open API v2 Simulator in `shopee-simulator/`. Please activate the `shopee-simulator` skill, check the `develop` or feature branch, review `README.md` and `CHANGELOG.md` (currently at v1.9.0, 509/509 tests passing), run `npm test` to verify baseline health, and proceed with [YOUR NEXT TASK]."*

This ensures zero context decay, zero hallucinated regressions, and immediate productive pairing.
