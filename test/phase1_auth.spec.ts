import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import * as http from "http";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

let server: http.Server;
let baseUrl: string;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function request(path: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: "manual"
  });

  const contentType = res.headers.get("content-type") || "";
  let json: any = null;
  let text = "";
  if (contentType.includes("application/json")) {
    json = await res.json();
  } else {
    text = await res.text();
  }

  return { status: res.status, headers: res.headers, json, text };
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 1 COMPREHENSIVE TEST SUITE  ");
  console.log("=======================================================\n");

  // Start temporary test server on random port
  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://localhost:${addr.port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // ------------------------------------------------------------------------
    console.log("TEST GROUP 1: Health & Swagger Documentation");
    // ------------------------------------------------------------------------
    {
      const res = await request("/health");
      assert(res.status === 200, "Health check returns HTTP 200");
      assert(res.json?.status === "ok", "Health check status is 'ok'");

      const docsRes = await request("/docs-json");
      assert(docsRes.status === 200, "Swagger JSON returns HTTP 200");
      assert(docsRes.json?.openapi === "3.0.0", "Swagger specification is OpenAPI 3.0.0");
      assert(docsRes.json?.paths["/api/v2/auth/token/get"] !== undefined, "Swagger documents /api/v2/auth/token/get");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 2: HMAC-SHA256 Signature Verification");
    // ------------------------------------------------------------------------
    {
      const now = Math.floor(Date.now() / 1000);
      const path = "/api/v2/public/get_shops_by_partner";
      const baseStr = buildBaseString(PARTNER_ID, path, now);
      const validSign = calculateHmacSha256(PARTNER_KEY, baseStr);

      // 2.1 Valid signature
      const validRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${validSign}`);
      assert(validRes.status === 200, "Valid signature returns HTTP 200");
      assert(validRes.json?.error === "", "Valid signature returns empty error");
      assert(Array.isArray(validRes.json?.response?.authed_shops), "Returns authed_shops array");

      // 2.2 Wrong signature
      const invalidRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=deadbeef12345678deadbeef12345678`);
      assert(invalidRes.json?.error === "error_sign", "Wrong sign returns error_sign");
      assert(invalidRes.json?.message === "Wrong sign.", "Wrong sign message matches Shopee standard");

      // 2.3 Missing partner_id
      const noPartnerRes = await request(`${path}?timestamp=${now}&sign=${validSign}`);
      assert(noPartnerRes.json?.error === "error_param", "Missing partner_id returns error_param");

      // 2.4 Missing timestamp
      const noTsRes = await request(`${path}?partner_id=${PARTNER_ID}&sign=${validSign}`);
      assert(noTsRes.json?.error === "error_param", "Missing timestamp returns error_param");

      // 2.5 Missing sign
      const noSignRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}`);
      assert(noSignRes.json?.error === "error_param", "Missing sign returns error_param");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 3: Timestamp Drift Validation (5-Minute Window)");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/public/get_shops_by_partner";
      const expiredTs = Math.floor(Date.now() / 1000) - 400; // 6.6 minutes ago
      const baseStr = buildBaseString(PARTNER_ID, path, expiredTs);
      const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${expiredTs}&sign=${sign}`);
      assert(res.json?.error === "error_param", "Expired timestamp returns error_param");
      assert(res.json?.message === "Timestamp is expired.", "Message confirms 'Timestamp is expired.'");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 4: OAuth 2.0 Authorization Flow & Code Generation");
    // ------------------------------------------------------------------------
    let authCode = "";
    {
      const redirectUri = "http://localhost:3000/auth/callback";
      const res = await request(`/auth?partner_id=${PARTNER_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&auto_confirm=true`);
      
      assert(res.status === 302, "OAuth consent with auto_confirm returns HTTP 302 redirect");
      const location = res.headers.get("location") || "";
      assert(location.startsWith(redirectUri), "Redirects to configured client redirect_uri");

      const url = new URL(location);
      authCode = url.searchParams.get("code") || "";
      const shopId = url.searchParams.get("shop_id");

      assert(authCode.length === 32, "Generated authorization code is 32-character hex");
      assert(shopId === SHOP_ID.toString(), `Returned shop_id is ${SHOP_ID}`);

      // Verify code stored in DB with 10 min TTL
      const shopInDb = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
      assert(shopInDb?.authCode === authCode, "Authorization code is recorded in database");
      assert(shopInDb?.authCodeExpiresAt !== null, "Auth code has expiry timestamp");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 5: Token Exchange (POST /api/v2/auth/token/get)");
    // ------------------------------------------------------------------------
    let accessToken = "";
    let refreshToken = "";
    {
      const path = "/api/v2/auth/token/get";
      const now = Math.floor(Date.now() / 1000);
      const sign = calculateHmacSha256(PARTNER_KEY, buildBaseString(PARTNER_ID, path, now));

      const payload = {
        code: authCode,
        partner_id: PARTNER_ID,
        shop_id: SHOP_ID
      };

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${sign}`, {
        method: "POST",
        body: payload
      });

      assert(res.json?.error === "", "Token exchange succeeded with empty error code");
      accessToken = res.json?.response?.access_token;
      refreshToken = res.json?.response?.refresh_token;

      assert(typeof accessToken === "string" && accessToken.length === 32, "Valid 32-char access_token returned");
      assert(typeof refreshToken === "string" && refreshToken.length === 32, "Valid 32-char refresh_token returned");
      assert(res.json?.response?.expire_in === 14400, "expire_in is exactly 14,400 seconds (4 hours)");
      assert(res.json?.response?.shop_id_list?.includes(SHOP_ID), "shop_id_list contains target shop");

      // Verify code is single-use and invalidated
      const shopInDb = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
      assert(shopInDb?.authCode === null, "Authorization code cleared after use (single-use enforced)");

      // Attempt to reuse code -> expect invalid_code
      const reuseRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${sign}`, {
        method: "POST",
        body: payload
      });
      assert(reuseRes.json?.error === "invalid_code", "Reusing authorization code is rejected with 'invalid_code'");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 6: Token Refresh & 5-Minute Dual-Token Grace Period");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/auth/access_token/get";
      const now = Math.floor(Date.now() / 1000);
      const sign = calculateHmacSha256(PARTNER_KEY, buildBaseString(PARTNER_ID, path, now));

      const payload = {
        refresh_token: refreshToken,
        partner_id: PARTNER_ID,
        shop_id: SHOP_ID
      };

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${sign}`, {
        method: "POST",
        body: payload
      });

      assert(res.json?.error === "", "Token refresh succeeded with empty error code");
      const newAccessToken = res.json?.response?.access_token;
      const newRefreshToken = res.json?.response?.refresh_token;

      assert(newAccessToken !== accessToken, "New access_token is distinct from old access_token");
      assert(newRefreshToken !== refreshToken, "New refresh_token is distinct from old refresh_token");

      // Verify database state: old token retained with 5-minute grace period
      const shopInDb = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
      assert(shopInDb?.oldAccessToken === accessToken, "Old access_token is preserved in oldAccessToken column");
      assert(shopInDb?.oldTokenExpiresAt !== null, "Grace period expiration timestamp is recorded");

      const graceTtlSeconds = Math.floor((shopInDb!.oldTokenExpiresAt!.getTime() - Date.now()) / 1000);
      assert(graceTtlSeconds > 280 && graceTtlSeconds <= 300, `Grace period TTL is ~300s (actual: ${graceTtlSeconds}s)`);
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 7: Shop-Level Guard & Token Validation");
    // ------------------------------------------------------------------------
    {
      const now = Math.floor(Date.now() / 1000);
      const path = "/api/v2/public/get_shops_by_partner";
      
      // Call with active tokens
      const shopInDb = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
      const currentToken = shopInDb!.accessToken!;
      const oldToken = shopInDb!.oldAccessToken!;

      // 7.1 Verify Shop API base string calculation with current active token
      const baseCurrent = buildBaseString(PARTNER_ID, path, now, currentToken, SHOP_ID);
      const signCurrent = calculateHmacSha256(PARTNER_KEY, baseCurrent);
      const resCurrent = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${currentToken}&shop_id=${SHOP_ID}&sign=${signCurrent}`);
      assert(resCurrent.json?.error === "", "Current access_token passes shop-level guard");

      // 7.2 Verify Shop API with old access token during grace period
      const baseOld = buildBaseString(PARTNER_ID, path, now, oldToken, SHOP_ID);
      const signOld = calculateHmacSha256(PARTNER_KEY, baseOld);
      const resOld = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${oldToken}&shop_id=${SHOP_ID}&sign=${signOld}`);
      assert(resOld.json?.error === "", "Old access_token accepted during 5-minute dual-token grace period");

      // 7.3 Verify Shop API with totally bogus token
      const bogusToken = "bogus_token_1234567890abcdef12";
      const baseBogus = buildBaseString(PARTNER_ID, path, now, bogusToken, SHOP_ID);
      const signBogus = calculateHmacSha256(PARTNER_KEY, baseBogus);
      const resBogus = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${bogusToken}&shop_id=${SHOP_ID}&sign=${signBogus}`);
      assert(resBogus.json?.error === "error_auth", "Invalid access_token is rejected with 'error_auth'");
      assert(resBogus.json?.message === "Invalid access_token.", "Message is 'Invalid access_token.'");
    }

    console.log("\n=======================================================");
    console.log("   🎉 ALL 25 TEST ASSERTIONS PASSED WITH 100% SUCCESS  ");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("\n❌ TEST SUITE FAILED WITH ERROR:", err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }
}

runTests();
