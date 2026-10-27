import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { storageService } from "../src/common/storage/storage.service";
import * as http from "http";

let server: http.Server;
let baseUrl: string;

function assert(condition: any, message: string) {
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
  if (contentType.includes("application/json")) {
    json = await res.json();
  } else {
    const text = await res.text();
    json = { raw: text };
  }

  return { status: res.status, headers: res.headers, json };
}

async function runTests() {
  console.log("================================================================================");
  console.log("🧪 PHASE 14 TEST SUITE: CLOUD MEDIA STORAGE, CI/CD PIPELINE & MARKETPLACE EXTENSIONS");
  console.log("================================================================================\n");

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address() as any;
      baseUrl = `http://127.0.0.1:${addr.port}`;
      console.log(`[TestServer] Ephemeral server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // ============================================================================
    // TEST GROUP 1: BUYER AUTHENTICATION & DEMO ACCOUNTS
    // ============================================================================
    console.log("▶ TEST GROUP 1: Buyer Authentication & Demo Accounts");

    // 1.1 Login with username 'demo'
    const loginUsernameRes = await request("/api/v2/simulator/auth/login", {
      method: "POST",
      body: { identity: "demo", password: "Shopiz@123" }
    });
    assert(loginUsernameRes.json.error === "", "1.1 Login with username 'demo' succeeds");
    assert(loginUsernameRes.json.response.user.username === "demo", "1.1 Returns username 'demo'");
    assert(loginUsernameRes.json.response.user.id === 1001, "1.1 Returns buyer ID 1001");
    assert(loginUsernameRes.json.response.user.role === "buyer", "1.1 Returns role 'buyer'");
    assert(loginUsernameRes.json.response.user.addresses.length >= 1, "1.1 Returns user address book");

    // 1.1b Login with seller account
    const loginSellerRes = await request("/api/v2/simulator/auth/login", {
      method: "POST",
      body: { identity: "seller", password: "Shopiz@123" }
    });
    assert(loginSellerRes.json.error === "", "1.1b Login with username 'seller' succeeds");
    assert(loginSellerRes.json.response.user.role === "seller", "1.1b Returns role 'seller'");
    assert(loginSellerRes.json.response.user.shop_id === 727720655, "1.1b Returns shop_id 727720655");
    assert(loginSellerRes.json.response.user.shop_name === "SmartOmni Official Flagship", "1.1b Returns shop_name");

    // 1.2 Login with email
    const loginEmailRes = await request("/api/v2/simulator/auth/login", {
      method: "POST",
      body: { identity: "demo@shopiz.com", password: "Shopiz@123" }
    });
    assert(loginEmailRes.json.error === "", "1.2 Login with email 'demo@shopiz.com' succeeds");

    // 1.3 Login with phone
    const loginPhoneRes = await request("/api/v2/simulator/auth/login", {
      method: "POST",
      body: { identity: "0901234567", password: "Shopiz@123" }
    });
    assert(loginPhoneRes.json.error === "", "1.3 Login with phone '0901234567' succeeds");

    // 1.4 Login with invalid password
    const loginInvalidPassRes = await request("/api/v2/simulator/auth/login", {
      method: "POST",
      body: { identity: "demo", password: "WrongPassword" }
    });
    assert(loginInvalidPassRes.json.error === "error_auth", "1.4 Login with invalid password rejected");

    // 1.5 Login with nonexistent user
    const loginNonexistentRes = await request("/api/v2/simulator/auth/login", {
      method: "POST",
      body: { identity: "ghost_user", password: "AnyPassword" }
    });
    assert(loginNonexistentRes.json.error === "error_auth", "1.5 Nonexistent user rejected");

    // 1.6 Register new buyer
    const newUsername = `buyer_${Date.now()}`;
    const newPhone = `098${Math.floor(1000000 + Math.random() * 9000000)}`;
    const registerRes = await request("/api/v2/simulator/auth/register", {
      method: "POST",
      body: {
        username: newUsername,
        password: "NewPassword@123",
        name: "Test Register Shopper",
        phone: newPhone,
        email: `${newUsername}@shopiz.com`
      }
    });
    assert(registerRes.json.error === "", "1.6 Register new buyer account succeeds");
    assert(registerRes.json.response.user.username === newUsername, "1.6 Registered user has correct username");

    // 1.7 Prevent duplicate registration
    const duplicateRes = await request("/api/v2/simulator/auth/register", {
      method: "POST",
      body: {
        username: newUsername,
        password: "OtherPassword@123",
        name: "Duplicate User"
      }
    });
    assert(duplicateRes.json.error === "error_param", "1.7 Duplicate username registration rejected");

    // 1.8 Forgot password mock endpoint
    const forgotRes = await request("/api/v2/simulator/auth/forgot_password", {
      method: "POST",
      body: { identity: "demo@shopiz.com" }
    });
    assert(forgotRes.json.error === "", "1.8 Forgot password endpoint responds successfully");
    assert(forgotRes.json.response.otp_preview !== undefined, "1.8 Returns preview OTP code");

    // 1.9 Update buyer profile
    const updateProfileRes = await request("/api/v2/simulator/buyer/profile", {
      method: "PUT",
      body: {
        buyer_id: 1001,
        name: "Demo Shopper Updated"
      }
    });
    assert(updateProfileRes.json.error === "", "1.9 Update buyer profile succeeds");
    assert(updateProfileRes.json.response.user.name === "Demo Shopper Updated", "1.9 Updated name returned");

    // Restore original name for subsequent suites
    await request("/api/v2/simulator/buyer/profile", {
      method: "PUT",
      body: {
        buyer_id: 1001,
        name: "Demo Shopper"
      }
    });

    // ============================================================================
    // TEST GROUP 2: BUYER SHIPPING ADDRESS MANAGEMENT
    // ============================================================================
    console.log("\n▶ TEST GROUP 2: Buyer Shipping Address Management");

    // 2.1 Retrieve buyer addresses
    const getAddrRes = await request("/api/v2/simulator/buyer/addresses?buyer_id=1001");
    assert(getAddrRes.json.error === "", "2.1 Retrieve buyer address list succeeds");
    assert(getAddrRes.json.response.addresses.length >= 1, "2.1 User has saved addresses");

    // 2.2 Create new address
    const addAddrRes = await request("/api/v2/simulator/buyer/addresses", {
      method: "POST",
      body: {
        buyer_id: 1001,
        recipient_name: "Nguyen Van Demo Home",
        recipient_phone: "0901234567",
        address_line: "99 Nguyen Hue Boulevard",
        district: "District 1",
        city: "Ho Chi Minh City",
        is_default: false
      }
    });
    assert(addAddrRes.json.error === "", "2.2 Create new shipping address succeeds");
    const newAddressId = addAddrRes.json.response.address.id;
    assert(newAddressId !== undefined, "2.2 Returns created address ID");

    // 2.3 Set address as default
    const setDefaultRes = await request(`/api/v2/simulator/buyer/addresses/${newAddressId}/set_default`, {
      method: "POST"
    });
    assert(setDefaultRes.json.error === "", "2.3 Set address as default succeeds");
    assert(setDefaultRes.json.response.is_default === true, "2.3 Target address flagged as default");

    // 2.4 Update address
    const updateAddrRes = await request(`/api/v2/simulator/buyer/addresses/${newAddressId}`, {
      method: "PUT",
      body: {
        buyer_id: 1001,
        recipient_name: "Nguyen Van Demo Villa"
      }
    });
    assert(updateAddrRes.json.error === "", "2.4 Update address details succeeds");
    assert(updateAddrRes.json.response.address.recipient_name === "Nguyen Van Demo Villa", "2.4 Updated name saved");

    // 2.5 Delete address
    const deleteAddrRes = await request(`/api/v2/simulator/buyer/addresses/${newAddressId}`, {
      method: "DELETE"
    });
    assert(deleteAddrRes.json.error === "", "2.5 Delete address succeeds");
    assert(deleteAddrRes.json.response.deleted === true, "2.5 Deleted flag confirmed");

    // ============================================================================
    // TEST GROUP 3: PRODUCT SEARCH, CATEGORIES & STOREFRONT
    // ============================================================================
    console.log("\n▶ TEST GROUP 3: Product Search, Categories & Storefront");

    // 3.1 Get categories
    const categoriesRes = await request("/api/v2/simulator/categories");
    assert(categoriesRes.json.error === "", "3.1 Retrieve categories tree succeeds");
    assert(categoriesRes.json.response.categories.length >= 1, "3.1 Returns categories array");

    // 3.2 Search products by keyword
    const searchRes = await request("/api/v2/simulator/products?q=SmartOmni");
    assert(searchRes.json.error === "", "3.2 Search products by keyword 'SmartOmni' succeeds");
    assert(searchRes.json.response.products.length >= 1, "3.2 Found products matching keyword");

    // 3.3 Sort products by price ascending
    const sortAscRes = await request("/api/v2/simulator/products?sort=price_asc");
    assert(sortAscRes.json.error === "", "3.3 Sort products by price ascending succeeds");
    const prodsAsc = sortAscRes.json.response.products;
    if (prodsAsc.length >= 2) {
      assert(prodsAsc[0].original_price <= prodsAsc[1].original_price, "3.3 First product price <= second product price");
    }

    // 3.4 Product details lookup
    const firstItemId = prodsAsc[0].item_id;
    const detailRes = await request(`/api/v2/simulator/product/detail?item_id=${firstItemId}`);
    assert(detailRes.json.error === "", "3.4 Retrieve product details succeeds");
    assert(detailRes.json.response.product.item_id === firstItemId, "3.4 Returned correct product ID");
    assert(detailRes.json.response.product.seller.shop_name !== undefined, "3.4 Includes seller shop snapshot");
    assert(detailRes.json.response.product.reviews !== undefined, "3.4 Includes reviews statistics");

    // 3.5 Shop storefront details lookup
    const shopDetailRes = await request(`/api/v2/simulator/shop/detail?shop_id=${prodsAsc[0].shop_id}`);
    assert(shopDetailRes.json.error === "", "3.5 Retrieve shop storefront details succeeds");
    assert(shopDetailRes.json.response.shop.shop_id === prodsAsc[0].shop_id, "3.5 Matches shop ID");
    assert(shopDetailRes.json.response.shop.products.length >= 1, "3.5 Returns shop active catalog");

    // ============================================================================
    // TEST GROUP 4: LOGISTICS, VOUCHERS & MULTI-SHOP BATCH CHECKOUT
    // ============================================================================
    console.log("\n▶ TEST GROUP 4: Logistics, Vouchers & Multi-Shop Batch Checkout");

    // 4.1 Get logistics channels
    const channelsRes = await request("/api/v2/simulator/logistics/channels");
    assert(channelsRes.json.error === "", "4.1 Retrieve logistics channels succeeds");
    assert(channelsRes.json.response.channels.length >= 1, "4.1 Logistics channels list returned");
    assert(channelsRes.json.response.channels[0].estimated_shipping_fee > 0, "4.1 Estimated shipping fee included");

    // 4.2 Validate active voucher
    const now = new Date();
    const testVoucher = await prisma.voucher.create({
      data: {
        shopId: BigInt(727720655),
        voucherCode: `VCH${Date.now().toString(36).slice(-4).toUpperCase()}`,
        voucherName: "Phase 14 Test Discount",
        voucherType: 1,
        rewardType: 1,
        minBasketPrice: 100000,
        discountAmount: 20000,
        startTime: new Date(now.getTime() - 3600000),
        endTime: new Date(now.getTime() + 86400000),
        status: "ONGOING"
      }
    });

    const validateVoucherRes = await request("/api/v2/simulator/voucher/validate", {
      method: "POST",
      body: {
        voucher_code: testVoucher.voucherCode,
        shop_id: 727720655,
        basket_amount: 150000
      }
    });
    assert(validateVoucherRes.json.error === "", "4.2 Validate voucher with met basket succeeds");
    assert(validateVoucherRes.json.response.valid === true, "4.2 Voucher confirmed valid");
    assert(validateVoucherRes.json.response.discount_amount === 20000, "4.2 Calculated discount matches 20,000 VND");

    // 4.3 Validate voucher with insufficient basket
    const validateUnderRes = await request("/api/v2/simulator/voucher/validate", {
      method: "POST",
      body: {
        voucher_code: testVoucher.voucherCode,
        shop_id: 727720655,
        basket_amount: 50000
      }
    });
    assert(validateUnderRes.json.error === "error_business", "4.3 Insufficient basket rejected with error_business");

    // 4.4 Batch multi-shop checkout
    const prodShop1 = await prisma.product.findFirst({ where: { shopId: BigInt(727720655), itemStatus: "NORMAL" } });
    const prodShop2 = await prisma.product.findFirst({ where: { shopId: BigInt(839910244), itemStatus: "NORMAL" } });

    const batchCheckoutRes = await request("/api/v2/simulator/order/batch_checkout", {
      method: "POST",
      body: {
        buyer_user_id: 1001,
        buyer_username: "demo",
        recipient_name: "Demo Shopper",
        recipient_phone: "0901234567",
        recipient_address: "123 Le Loi Street",
        recipient_district: "District 1",
        recipient_city: "Ho Chi Minh City",
        payment_method: "ShopeePay",
        orders: [
          {
            shop_id: 727720655,
            channel_id: 30001,
            shipping_carrier: "Shopee Xpress",
            message_to_seller: "Deliver to Shop 1",
            items: [
              { item_id: prodShop1 ? Number(prodShop1.itemId) : 10001, quantity: 1 }
            ]
          },
          {
            shop_id: 839910244,
            channel_id: 30001,
            shipping_carrier: "Shopee Xpress",
            message_to_seller: "Deliver to Shop 2",
            items: [
              { item_id: prodShop2 ? Number(prodShop2.itemId) : 10002, quantity: 1 }
            ]
          }
        ]
      }
    });

    assert(batchCheckoutRes.json.error === "", "4.4 Multi-shop batch checkout succeeds");
    assert(batchCheckoutRes.json.response.total_orders === 2, "4.4 Created exactly 2 distinct orders for the 2 shops");
    const createdOrders = batchCheckoutRes.json.response.orders;
    assert(createdOrders[0].order_sn !== createdOrders[1].order_sn, "4.4 Each shop order received a unique order_sn");
    assert(createdOrders[0].package_number !== undefined, "4.4 Package created for first order");
    assert(createdOrders[1].package_number !== undefined, "4.4 Package created for second order");

    // ============================================================================
    // TEST GROUP 5: ORDER COMPLETION & SELLER ANALYTICS
    // ============================================================================
    console.log("\n▶ TEST GROUP 5: Order Completion & Seller Analytics");

    // 5.1 Buyer marks order as delivered (Confirm Delivery)
    const testOrderToComplete = createdOrders[0].order_sn;
    const confirmDeliveryRes = await request("/api/v2/simulator/order/confirm_delivery", {
      method: "POST",
      body: {
        order_sn: testOrderToComplete,
        buyer_user_id: 1001
      }
    });
    assert(confirmDeliveryRes.json.error === "", "5.1 Buyer confirms delivery succeeds");
    assert(confirmDeliveryRes.json.response.order_status === "COMPLETED", "5.1 Order status transitioned to COMPLETED");
    assert(confirmDeliveryRes.json.response.escrow_release_time !== null, "5.1 Escrow release time recorded");

    // 5.2 Confirm delivery again fails (already completed)
    const confirmAgainRes = await request("/api/v2/simulator/order/confirm_delivery", {
      method: "POST",
      body: { order_sn: testOrderToComplete }
    });
    assert(confirmAgainRes.json.error === "error_business", "5.2 Re-completing order rejected");

    // 5.3 Retrieve seller analytics
    const analyticsRes = await request("/api/v2/simulator/seller/analytics?shop_id=727720655&period=today");
    assert(analyticsRes.json.error === "", "5.3 Retrieve seller analytics succeeds");
    assert(analyticsRes.json.response.metrics.revenue >= 0, "5.3 Revenue metric present");
    assert(analyticsRes.json.response.metrics.orders_count >= 1, "5.3 Orders count reflects completed order");
    assert(analyticsRes.json.response.chart.labels.length === 7, "5.3 Chart time-series labels present");
    assert(analyticsRes.json.response.chart.values.length === 7, "5.3 Chart values data array present");

    // ============================================================================
    // TEST GROUP 6: CLOUD MEDIA UPLOAD (GOOGLE DRIVE / LOCAL STORAGE)
    // ============================================================================
    console.log("\n▶ TEST GROUP 6: Cloud Media Upload (Google Drive / Local Storage)");

    // 6.1 Upload without file
    const emptyUploadRes = await request("/api/v2/simulator/media/upload", {
      method: "POST"
    });
    assert(emptyUploadRes.json.error === "error_param", "6.1 Missing file rejected with error_param");

    // 6.2 Multipart file upload
    if (storageService.providerType === "google_drive" && process.env.TEST_DRIVE_UPLOAD !== "true") {
      console.log("  ↷ SKIPPED: 6.2 Google Drive file upload test skipped to prevent folder spam (Set TEST_DRIVE_UPLOAD=true to run live upload)");
    } else {
      const form = new FormData();
      const pngBlob = new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64")], { type: "image/png" });
      form.append("file", pngBlob, "test_evidence.png");

      const uploadRes = await fetch(`${baseUrl}/api/v2/simulator/media/upload`, {
        method: "POST",
        body: form
      });
      const uploadJson: any = await uploadRes.json();
      assert(uploadJson.error === "", "6.2 Multipart media upload endpoint succeeds");
      assert(uploadJson.response.url !== undefined, "6.2 Returned valid media URL");
      assert(uploadJson.response.file_id !== undefined, "6.2 Returned file ID");
      assert(uploadJson.response.provider === "google_drive" || uploadJson.response.provider === "local", "6.2 Provider correctly identified");
    }

    console.log("\n================================================================================");
    console.log("🎉 ALL PHASE 14 TESTS PASSED SUCCESSFULLY! (100% Pass Rate)");
    console.log("================================================================================");
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
