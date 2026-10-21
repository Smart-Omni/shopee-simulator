import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import { storageService } from "../src/common/storage/storage.service";
import { LocalStorageProvider } from "../src/common/storage/local-storage.provider";
import * as http from "http";

// Use local storage in Phase 2 tests to prevent uploading dummy test images to Google Drive
storageService.setProvider(new LocalStorageProvider(), "local");

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

let server: http.Server;
let baseUrl: string;
let accessToken: string;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function request(path: string, options: { method?: string; body?: any; headers?: Record<string, string>; formData?: FormData } = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: options.formData ? options.headers : {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.formData ? options.formData : (options.body ? JSON.stringify(options.body) : undefined),
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
  console.log("   SHOPEE SIMULATOR: PHASE 2 SHOP & MEDIA TEST SUITE   ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://localhost:${addr.port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // ------------------------------------------------------------------------
    console.log("PREPARATION: Fetch Active Access Token from Database");
    // ------------------------------------------------------------------------
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    if (!shop || !shop.accessToken) {
      throw new Error("No active access token found for shop 727720655. Run seed or Phase 1 tests first.");
    }
    accessToken = shop.accessToken;
    console.log(`Using active accessToken: ${accessToken}\n`);

    // ------------------------------------------------------------------------
    console.log("TEST GROUP 1: Get Shop Info (GET /api/v2/shop/get_shop_info)");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/shop/get_shop_info";
      const now = Math.floor(Date.now() / 1000);
      const baseStr = buildBaseString(PARTNER_ID, path, now, accessToken, SHOP_ID);
      const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${sign}`);

      assert(res.status === 200, "Get shop info returns HTTP 200");
      assert(res.json?.error === "", "Empty error code indicates success");
      assert(res.json?.response?.shop_name === shop.shopName, "Shop name matches database");
      assert(res.json?.response?.region === "VN", "Region matches 'VN'");
      assert(res.json?.response?.status === "NORMAL", "Status is 'NORMAL'");
      assert(typeof res.json?.response?.auth_time === "number", "Returns valid auth_time timestamp");
      assert(typeof res.json?.response?.expire_time === "number", "Returns valid expire_time timestamp");
      assert(res.json?.response?.is_vacation === false, "Vacation mode initially false");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 2: Get Shop Profile (GET /api/v2/shop/get_profile)");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/shop/get_profile";
      const now = Math.floor(Date.now() / 1000);
      const baseStr = buildBaseString(PARTNER_ID, path, now, accessToken, SHOP_ID);
      const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${sign}`);

      assert(res.status === 200, "Get shop profile returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on profile get");
      assert(typeof res.json?.response?.shop_logo === "string", "Returns shop logo URL");
      assert(typeof res.json?.response?.description === "string", "Returns shop description");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 3: Toggle Holiday Mode (POST /api/v2/shop/set_shop_holiday_mode)");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/shop/set_shop_holiday_mode";
      const now = Math.floor(Date.now() / 1000);
      const baseStr = buildBaseString(PARTNER_ID, path, now, accessToken, SHOP_ID);
      const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

      // 3.1 Turn ON holiday mode
      const turnOnRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${sign}`, {
        method: "POST",
        body: { holiday_mode_on: true }
      });
      assert(turnOnRes.json?.error === "", "Turn ON holiday mode succeeded");

      // Verify DB and get_shop_info reflect is_vacation: true
      const infoPath = "/api/v2/shop/get_shop_info";
      const infoBase = buildBaseString(PARTNER_ID, infoPath, now, accessToken, SHOP_ID);
      const infoSign = calculateHmacSha256(PARTNER_KEY, infoBase);
      const verifyOnRes = await request(`${infoPath}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${infoSign}`);
      assert(verifyOnRes.json?.response?.is_vacation === true, "get_shop_info reflects is_vacation === true");

      // 3.2 Turn OFF holiday mode
      const turnOffRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${sign}`, {
        method: "POST",
        body: { holiday_mode_on: false }
      });
      assert(turnOffRes.json?.error === "", "Turn OFF holiday mode succeeded");

      const verifyOffRes = await request(`${infoPath}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${infoSign}`);
      assert(verifyOffRes.json?.response?.is_vacation === false, "get_shop_info reflects is_vacation === false");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 4: Get Warehouse Details (GET /api/v2/shop/get_warehouse_detail)");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/shop/get_warehouse_detail";
      const now = Math.floor(Date.now() / 1000);
      const baseStr = buildBaseString(PARTNER_ID, path, now, accessToken, SHOP_ID);
      const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${sign}`);

      assert(res.status === 200, "Get warehouse detail returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on warehouse get");
      assert(Array.isArray(res.json?.response?.warehouse_list), "Returns warehouse_list array");
      assert(res.json?.response?.warehouse_list.length > 0, "Warehouse list has at least 1 warehouse");
      assert(res.json?.response?.warehouse_list[0].city === "Ho Chi Minh City", "Warehouse city matches seed data");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 5: Upload Image to MediaSpace (POST /api/v2/media_space/upload_image)");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/media_space/upload_image";
      const now = Math.floor(Date.now() / 1000);
      const baseStr = buildBaseString(PARTNER_ID, path, now);
      const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

      // Create a mock image file blob using standard FormData
      const formData = new FormData();
      const mockImageBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
      const blob = new Blob([mockImageBuffer], { type: "image/png" });
      formData.append("image", blob, "test_product.png");

      const res = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${sign}`, {
        method: "POST",
        formData
      });

      assert(res.status === 200, "Upload image returns HTTP 200");
      assert(res.json?.error === "", "Upload image returns empty error code");
      const imageInfo = res.json?.response?.image_info;
      assert(typeof imageInfo?.image_id === "string", "image_id is returned as string");
      assert(imageInfo.image_id.startsWith("vn-11134201-7rd5z-"), "image_id follows Shopee regional format");
      assert(Array.isArray(imageInfo?.image_url_list), "image_url_list is an array");
      assert(imageInfo.image_url_list.length === 2, "Contains CDN URLs for VN and SG");
      assert(imageInfo.image_url_list[0].image_url_region === "VN", "First region is VN");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 6: Error Cases & Parameter Validation");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/shop/get_shop_info";
      const now = Math.floor(Date.now() / 1000);
      
      // 6.1 Invalid shop signature
      const invalidSign = "deadbeef12345678deadbeef12345678";
      const resInvalid = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${invalidSign}`);
      assert(resInvalid.json?.error === "error_sign", "Wrong signature on shop endpoint rejected with error_sign");

      // 6.2 Missing image file on upload
      const uploadPath = "/api/v2/media_space/upload_image";
      const uploadBase = buildBaseString(PARTNER_ID, uploadPath, now);
      const uploadSign = calculateHmacSha256(PARTNER_KEY, uploadBase);
      const emptyForm = new FormData();
      const resNoFile = await request(`${uploadPath}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${uploadSign}`, {
        method: "POST",
        formData: emptyForm
      });
      assert(resNoFile.json?.error === "error_param", "Upload without file returns error_param");
    }

    console.log("\n=======================================================");
    console.log("   🎉 ALL 20 PHASE 2 TEST ASSERTIONS PASSED WITH 100%   ");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("\n❌ PHASE 2 TEST SUITE FAILED:", err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }
}

runTests();
