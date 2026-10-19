---
name: shopee-simulator
description: >-
  Expert guide and runbook for developing, testing, and debugging the Shopee Open API v2 Simulator (mock Shopee server) and SmartOmni Channel integrations. Activate this skill whenever implementing mock Shopee endpoints, HMAC-SHA256 signature verification, OAuth 2.0 token exchanges, product catalog sync, multi-tier variants, order lifecycle transitions, logistics fulfillment, airway bill generation, or outbound push webhook dispatching.
---

# Shopee Simulator Engineering Runbook

This skill equips coding agents with the architecture, protocol rules, and execution runbooks to build the Shopee Open API v2 Mock Server for **SmartOmni Channel**.

---

## 1. Primary Documentation References

Always consult these workspace documents before modifying or adding code:

1. **[`SHOPEE_MOCK_IMPLEMENTATION_PLAN.md`](../../SHOPEE_MOCK_IMPLEMENTATION_PLAN.md)**  
   The authoritative 7-phase implementation plan with the complete PostgreSQL Prisma schema, Swagger configurations, test specifications, and verification gates.
2. **[`SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md`](../../SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md)**  
   The complete protocol blueprint and master index of all 452 APIs, 35 webhooks, and 64 developer guides.
3. **`api-reference/`**  
   Detailed markdown reference for every individual endpoint (request/response models, sample JSONs, error codes).

---

## 2. Core Protocol Rules & Non-Negotiables

### A. HMAC-SHA256 Signature Verification
Never bypass or dummy-return `true` for signature verification. Base strings must be computed strictly as:
- **Public API**: `partner_id + path + timestamp`
- **Shop API**: `partner_id + path + timestamp + access_token + shop_id`
- **Merchant API**: `partner_id + path + timestamp + access_token + merchant_id`

```text
sign = HMAC_SHA256(key=partner_key, message=base_string).hex_digest()
```

### B. Standard Response Envelopes
Every API response (even logical errors) must return HTTP 200 wrapped in the standard Shopee envelope:
- **Success**: `{"error": "", "message": "", "response": { ... }, "request_id": "<uuid>"}`
- **Error**: `{"error": "<error_code>", "message": "<msg>", "request_id": "<uuid>"}`

### C. BigInt JSON Serialization Polyfill
In TypeScript / Node.js, native `BigInt` (from PostgreSQL `BIGINT`) crashes `JSON.stringify()`. Always register this polyfill in `main.ts`:
```typescript
(BigInt.prototype as any).toJSON = function () {
  const intVal = Number(this);
  return Number.isSafeInteger(intVal) ? intVal : this.toString();
};
```

---

## 3. Supported Modules (Phases 1 through 11 Complete)

The simulator currently supports 11 complete modules with 339 automated assertions passing (100%):
- **Phase 1**: OAuth 2.0 Auth Kernel, Token Refresh with 5-Minute Dual-Token Grace Period, HMAC-SHA256 Guard.
- **Phase 2**: Push Webhooks Engine (Codes 1, 2, 3, 4, 7, 8, 9, 15) with HMAC signatures & retry worker.
- **Phase 3**: Product Catalog & Single/Basic Variations, Category trees, Stock/Price updates.
- **Phase 4**: Complete 7-Stage Order Lifecycle (`UNPAID` through `COMPLETED`/`CANCELLED`), Buyer cancellations.
- **Phase 5**: Airway Bill (AWB) Thermal PDF generation with SPX Barcodes and Code128.
- **Phase 6**: Escrow Settlement & Payment Financial Ledger (`get_escrow_detail`, `get_escrow_list`).
- **Phase 7**: Promotions & Marketing Center (12 Discount and 6 Voucher endpoints, Holiday Mode guard).
- **Phase 8**: Dynamic Vietnam Shipping Fee Engine (SPX Express, Instant, Economy, Zone routing, Freeship Xtra).
- **Phase 9**: 2-Tier Variations System (Fashion & Apparel Color + Size) with Cartesian model generator and 5:1 price ratio rule.
- **Phase 10**: SKU Lifecycle & Order SLA Time Window (`v2.product.unlist_item`, cart item checkboxes, `shipByDate = now + 48h`, auto-cancellation engine for overdue orders).
- **Phase 11**: Live Customer Chat (`ChatMessage` model, Buyer-Seller threads) & Post-Order Reviews (`ProductComment`, star ratings, store rating recalculation, official seller replies).
- **UI Platform**: Dual-Persona Interface (1-click fast login for 3 seeded shops & 3 buyers, slide-out integration console drawer, 100% `vi-VN` localization).

---

## 4. Git Branching & Conventional Commits Workflow

- **Repository**: `https://github.com/wishuponsirius/shopee-simulator.git`
- **Branches**:
  - `main`: Production release branch. Releases are tagged (e.g. `v1.6.0`).
  - `develop`: Active development and integration branch. All work branches merge here.
- **Commit Messages**: Must follow **Conventional Commits**:
  - Format: `<type>(<scope>): <short description>`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
  - Examples:
    - `feat(chat): implement live buyer-seller messaging`
    - `fix(order): cancel overdue orders past ship_by_date`
    - `test(phase11): add review and comment reply assertions`

---

## 5. Quality Gate & Session Resumption Invariant

> [!IMPORTANT]
> **Quality Gate:** Before starting any new task, run `npm test` in `shopee-simulator/`. Verify that all 339 assertions pass 100% with 0 regressions.
>
> When starting a new session:
> 1. Check out `develop` branch.
> 2. Read `shopee-simulator/README.md` and `shopee-simulator/CHANGELOG.md`.
> 3. Verify health with `npm test`.
> 4. Ensure commands accessing database port `5432` run with direct network access.
> 5. Commit using Conventional Commits.

---

## 6. UI Language & Localization Standards (Vietnamese `vi-VN`)

> [!IMPORTANT]
> **Mandatory UI Localization Rule:**
> - **Simulator Web UI (`public/index.html`)**: All user-facing text, buttons, modals, badges, form labels, toasts, and status pills MUST be coded in **Vietnamese (`vi-VN`)** using standard Shopee Vietnam terminology (e.g. *Chờ lấy hàng*, *Đang giao*, *Đã giao*, *Hủy đơn*, *Chuẩn bị hàng*, *Phiếu gửi hàng AWB*, *Voucher của Shop*, *Mã giảm giá vận chuyển Shopee*, *Shopee Chat*).
> - **Developer Communication & Assistant Responses**: All pair programming discussions, architectural explanations, git commits, code comments, and chat responses to the user MUST remain in **English**.

---

## 7. Docker Container Synchronization & Build Hygiene

> [!IMPORTANT]
> The running Docker container `shopee-mock-server` executes compiled JavaScript inside `/app/dist`.
> Whenever TypeScript source code under `src/` or HTML in `public/` is modified:
> 1. Run `npm run build` on the host to compile `dist/`.
> 2. Synchronize into the container:
>    ```bash
>    docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker restart shopee-mock-server
>    ```
>    Or recreate the image: `docker compose up -d --build shopee-simulator`.
> 3. Never allow the container's `/app/dist` to drift from `src/`.

