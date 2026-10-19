# 🚀 Shopee Open API v2 Simulator — Next Session Kickoff Prompt

Use this prompt when initiating a new coding or pairing session with an AI coding assistant (Antigravity or any LLM agent). It eliminates context decay, establishes the technical baseline, and guarantees immediate productive pairing.

---

## 📋 Copy-Paste Prompt for New Session

```markdown
We are continuing development on the **Shopee Open API v2 Simulator** located in `shopee-simulator/`.

### 1. Context & Baseline
- **Current Version:** v1.7.0 (Phases 1 through 12 complete, Dual-Persona UI, vi-VN localization).
- **Test Baseline:** 387 / 387 test assertions passing (100% pass rate across all 12 phases). Run `npm test` immediately (with network socket access enabled for port 5432) to verify baseline health before making any changes.
- **Git Branch:** Currently on `feature/payment-and-escrow-reconcilation` (or `develop`). Follow the Conventional Commits specification for all commit messages.

### 2. Architecture & Rules of Engagement
- **Two-Layer Architecture:**
  - **Layer A (`/api/v2/{module}/{action}`)**: Official partner endpoints. Strictly enforced `shopeeAuthGuard` (HMAC-SHA256 signature verification), standard envelope `{ error, message, response, request_id }`, and official Shopee error codes.
  - **Layer B (`/api/v2/simulator/*`)**: Developer helpers and browser testbed routes in `src/modules/simulator/simulator.router.ts`.
- **UI Platform & Localization Standards:**
  - Browser testbed is at `public/index.html` (served on port 8080).
  - **Mandatory UI Localization:** All user-facing UI copy in `public/index.html` (buttons, tabs, modals, badges, form labels, toasts) MUST be in authentic **Vietnamese (`vi-VN`)** matching Shopee Vietnam standards.
  - **Developer Communication:** All agent dialogue, explanations, code comments, and git commits MUST remain in **English**.
- **Docker Container Build Hygiene:**
  - The live simulator runs via Docker container `shopee-mock-server` on port 8080 executing `/app/dist`.
  - Whenever modifying TypeScript in `src/` or HTML in `public/`, compile with `npm run build` and synchronize into the container:
    `docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker cp prisma/schema.prisma shopee-mock-server:/app/prisma/schema.prisma && docker restart shopee-mock-server`

### 3. Key Reference Documentation
- **Master Protocol Spec & API Index:** `../SHOPEE_SIMULATOR_SPEC_AND_API_INDEX.md` (452 endpoints, 35 webhooks, 64 developer guides).
- **Phased Implementation Blueprint:** `../SHOPEE_MOCK_IMPLEMENTATION_PLAN.md`.
- **Official Markdown Documentation:** `../api-reference/` and `../push-mechanism/`.
- **Workspace Skill:** `.agents/skills/shopee-simulator/SKILL.md`.
- **Changelog & History:** `CHANGELOG.md` and `README.md`.

Please confirm that you have checked the `develop` branch, verified baseline health via `npm test`, and are ready for the next task.
```

---

## 🛠 Quick Agent Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Verify baseline health** | `npm test` (run across all 12 phases) |
| **Compile TypeScript** | `npm run build` (`tsc` exits 0) |
| **Check git branch status** | `git status` (should be on `develop`) |
| **Synchronize live Docker container** | `docker cp dist/. shopee-mock-server:/app/dist/ && docker cp public/index.html shopee-mock-server:/app/public/index.html && docker cp prisma/schema.prisma shopee-mock-server:/app/prisma/schema.prisma && docker restart shopee-mock-server` |
| **Test single phase** | `npm run test:phase<N>` (e.g. `npm run test:phase12`) |
| **Check database logs** | `docker logs shopee-mock-server --tail 50` |
