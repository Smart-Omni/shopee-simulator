import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import * as http from "http";

let server: http.Server;
let baseUrl = "";

function assert(condition: any, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function request(path: string, options: { method?: string; body?: any } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return response.json() as Promise<any>;
}

async function run() {
  const shop = await prisma.shop.findFirst({
    include: {
      products: { take: 2 }
    }
  });
  if (!shop || shop.products.length < 2) {
    throw new Error("Voucher test needs a shop with at least 2 seeded products");
  }

  const shopId = Number(shop.shopId);
  const item1 = Number(shop.products[0].itemId);
  const item2 = Number(shop.products[1].itemId);
  const uniqueSuffix = `${Date.now()}`.slice(-4);

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });

  try {
    console.log("=======================================================");
    console.log("PHASE 18: SELLER VOUCHER MANAGEMENT & SIMULATOR APIS");
    console.log("=======================================================\n");

    // 1. Config API
    const configRes = await request(`/api/v2/simulator/voucher/config?shop_id=${shopId}`);
    assert(configRes.error === "", "Config endpoint returns HTTP 200 without error");
    assert(typeof configRes.response.voucher_prefix === "string" && configRes.response.voucher_prefix.length >= 3, "Config returns shop voucher prefix");
    assert(Array.isArray(configRes.response.supported_usecases) && configRes.response.supported_usecases.length >= 7, "Config returns all 7+ supported voucher usecases");

    // 2. Shopee Coins constraint validation: reward_type = 3 must be rejected
    const coinRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Coins Test ${uniqueSuffix}`,
        voucher_code: `C${uniqueSuffix}`,
        reward_type: 3, // coin cashback
        start_time: Math.floor(Date.now() / 1000) + 100,
        end_time: Math.floor(Date.now() / 1000) + 86400
      }
    });
    assert(coinRes.error === "voucher.voucher_coin_error", "Coin cashback voucher is rejected with official voucher.voucher_coin_error");

    // 3. Fixed amount higher than min_basket_price validation
    const minPriceRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `MinPrice Test ${uniqueSuffix}`,
        voucher_code: `M${uniqueSuffix}`,
        reward_type: 1,
        discount_amount: 50000,
        min_basket_price: 30000,
        start_time: Math.floor(Date.now() / 1000) + 100,
        end_time: Math.floor(Date.now() / 1000) + 86400
      }
    });
    assert(minPriceRes.error === "voucher.voucher_min_price_error", "Fixed discount higher than min_basket_price is rejected with voucher.voucher_min_price_error");

    // 4. Invalid time window (end before start)
    const timeRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Time Test ${uniqueSuffix}`,
        voucher_code: `T${uniqueSuffix}`,
        reward_type: 1,
        discount_amount: 10000,
        start_time: Math.floor(Date.now() / 1000) + 86400,
        end_time: Math.floor(Date.now() / 1000) + 100
      }
    });
    assert(timeRes.error === "voucher.voucher_time_period_error", "End time before start time is rejected with voucher.voucher_time_period_error");

    // 5. Create Shop-wide voucher (usecase = 1)
    const shopVoucherCode = `S${uniqueSuffix}`;
    const shopVoucherRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Shop Wide Test ${uniqueSuffix}`,
        voucher_code: shopVoucherCode,
        usecase: 1,
        reward_type: 1,
        discount_amount: 15000,
        min_basket_price: 100000,
        usage_quantity: 50,
        start_time: Math.floor(Date.now() / 1000) - 60, // ongoing
        end_time: Math.floor(Date.now() / 1000) + 86400,
        display_start_time: Math.floor(Date.now() / 1000) - 3600
      }
    });
    assert(shopVoucherRes.error === "", "Create shop-wide voucher succeeds");
    const shopVoucherId = shopVoucherRes.response.voucher_id;
    assert(shopVoucherId > 0, "Returns valid numeric voucher_id");

    // 6. Duplicate code rejection
    const dupRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: "Duplicate Attempt",
        voucher_code: shopVoucherCode,
        reward_type: 1,
        start_time: Math.floor(Date.now() / 1000) - 60,
        end_time: Math.floor(Date.now() / 1000) + 86400
      }
    });
    assert(dupRes.error === "voucher.voucher_code_duplicate_error", "Duplicate voucher code is rejected with voucher.voucher_code_duplicate_error");

    // 7. Create Product voucher (usecase = 2) with item_id_list
    const prodVoucherCode = `P${uniqueSuffix}`;
    const prodVoucherRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Product Voucher Test ${uniqueSuffix}`,
        voucher_code: prodVoucherCode,
        usecase: 2,
        voucher_type: 2,
        reward_type: 2, // percentage
        percentage: 10,
        max_price: 30000,
        min_basket_price: 50000,
        usage_quantity: 100,
        item_id_list: [item1, item2],
        start_time: Math.floor(Date.now() / 1000) + 3600, // upcoming
        end_time: Math.floor(Date.now() / 1000) + 86400 * 5
      }
    });
    assert(prodVoucherRes.error === "", "Create product voucher succeeds");
    const prodVoucherId = prodVoucherRes.response.voucher_id;

    // Verify VoucherItem relations persisted in database
    const linkedItems = await prisma.voucherItem.findMany({ where: { voucherId: BigInt(prodVoucherId) } });
    assert(linkedItems.length === 2, "Product voucher links both items in VoucherItem table");

    // 8. Create Private voucher (usecase = 5)
    const privVoucherRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Private Voucher ${uniqueSuffix}`,
        voucher_code: `V${uniqueSuffix}`,
        usecase: 5,
        reward_type: 1,
        discount_amount: 20000,
        min_basket_price: 150000,
        start_time: Math.floor(Date.now() / 1000) - 60,
        end_time: Math.floor(Date.now() / 1000) + 86400
      }
    });
    assert(privVoucherRes.error === "", "Create private voucher succeeds");

    // 9. Create Live voucher (usecase = 6) with auto-generated code
    const liveVoucherRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Live Stream Voucher ${uniqueSuffix}`,
        usecase: 6,
        reward_type: 1,
        discount_amount: 25000,
        min_basket_price: 120000,
        start_time: Math.floor(Date.now() / 1000) - 60,
        end_time: Math.floor(Date.now() / 1000) + 3600
      }
    });
    assert(liveVoucherRes.error === "", "Create Live voucher without code auto-generates code");
    assert(typeof liveVoucherRes.response.voucher_code === "string" && liveVoucherRes.response.voucher_code.length > 0, "Auto-generated voucher_code is populated");

    // 10. Create New Buyer (usecase = 3) and Returning Buyer (usecase = 4) vouchers
    const newBuyerRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `New Buyer Voucher ${uniqueSuffix}`,
        voucher_code: `N${uniqueSuffix}`,
        usecase: 3,
        reward_type: 1,
        discount_amount: 30000,
        min_basket_price: 200000,
        start_time: Math.floor(Date.now() / 1000) - 60,
        end_time: Math.floor(Date.now() / 1000) + 86400
      }
    });
    assert(newBuyerRes.error === "", "Create New Buyer voucher succeeds");

    const repeatBuyerRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Repeat Buyer Voucher ${uniqueSuffix}`,
        voucher_code: `R${uniqueSuffix}`,
        usecase: 4,
        target_voucher: 2,
        reward_type: 1,
        discount_amount: 35000,
        min_basket_price: 250000,
        start_time: Math.floor(Date.now() / 1000) - 60,
        end_time: Math.floor(Date.now() / 1000) + 86400
      }
    });
    assert(repeatBuyerRes.error === "", "Create Repeat Buyer voucher succeeds");

    const followerVoucherRes = await request("/api/v2/simulator/voucher/create", {
      method: "POST",
      body: {
        shop_id: shopId,
        voucher_name: `Follower Prize ${uniqueSuffix}`,
        usecase: 9,
        reward_type: 1,
        discount_amount: 15000,
        min_basket_price: 100000,
        usage_quantity: 50,
        start_time: Math.floor(Date.now() / 1000) - 60,
        end_time: Math.floor(Date.now() / 1000) + 86400 * 30
      }
    });
    assert(followerVoucherRes.error === "", "Create Follower Prize voucher succeeds");
    assert(typeof followerVoucherRes.response.voucher_code === "string" && followerVoucherRes.response.voucher_code.length > 0, "Follower voucher code auto-generated");

    // 11. Voucher List API & Status Counts
    const listRes = await request(`/api/v2/simulator/voucher/list?shop_id=${shopId}&page_size=20`);
    assert(listRes.error === "", "List vouchers endpoint succeeds");
    assert(listRes.response.total >= 5, "Total vouchers reflects newly created vouchers");
    assert(listRes.response.status_counts.all >= 5, "status_counts.all is accurate");
    assert(listRes.response.status_counts.ongoing >= 4, "status_counts.ongoing counts active vouchers");
    assert(listRes.response.status_counts.upcoming >= 1, "status_counts.upcoming counts future vouchers");

    // 12. Status filtering
    const upcomingList = await request(`/api/v2/simulator/voucher/list?shop_id=${shopId}&status=upcoming`);
    assert(upcomingList.response.vouchers.every((v: any) => v.status === "upcoming"), "Filter by upcoming returns only upcoming vouchers");

    const ongoingList = await request(`/api/v2/simulator/voucher/list?shop_id=${shopId}&status=ongoing`);
    assert(ongoingList.response.vouchers.every((v: any) => v.status === "ongoing"), "Filter by ongoing returns only ongoing vouchers");

    // 13. Search filtering (by name and by code)
    const searchByName = await request(`/api/v2/simulator/voucher/list?shop_id=${shopId}&search_type=name&keyword=Product%20Voucher%20Test%20${uniqueSuffix}`);
    assert(searchByName.response.total === 1 && searchByName.response.vouchers[0].voucher_code === prodVoucherCode, "Search by voucher name successfully matches exact voucher");

    const searchByCode = await request(`/api/v2/simulator/voucher/list?shop_id=${shopId}&search_type=code&keyword=${shopVoucherCode}`);
    assert(searchByCode.response.total === 1 && searchByCode.response.vouchers[0].voucher_id === shopVoucherId, "Search by voucher code successfully matches exact voucher");

    // 14. Voucher Detail API
    const detailRes = await request(`/api/v2/simulator/voucher/detail?voucher_id=${prodVoucherId}`);
    assert(detailRes.error === "", "Get voucher detail succeeds");
    assert(detailRes.response.usecase === 2, "Detail returns correct usecase = 2 (product voucher)");
    assert(detailRes.response.item_count === 2, "Detail includes item_count = 2");
    assert(detailRes.response.items.length === 2, "Detail includes resolved item models and prices");

    // 15. Update Voucher API
    const updateRes = await request("/api/v2/simulator/voucher/update", {
      method: "POST",
      body: {
        voucher_id: prodVoucherId,
        shop_id: shopId,
        voucher_name: `Updated Prod Voucher ${uniqueSuffix}`,
        usage_quantity: 200,
        item_id_list: [item1] // reduce to 1 item
      }
    });
    assert(updateRes.error === "", "Update voucher succeeds");

    const updatedDetail = await request(`/api/v2/simulator/voucher/detail?voucher_id=${prodVoucherId}`);
    assert(updatedDetail.response.voucher_name === `Updated Prod Voucher ${uniqueSuffix}`, "Updated voucher_name persisted");
    assert(updatedDetail.response.usage_quantity === 200, "Updated usage_quantity persisted");
    assert(updatedDetail.response.item_count === 1, "Updated item list reflected");

    // 16. End Voucher early
    const endRes = await request("/api/v2/simulator/voucher/end", {
      method: "POST",
      body: { voucher_id: shopVoucherId }
    });
    assert(endRes.error === "" && endRes.response.status === "expired", "Ending voucher returns status 'expired'");

    // 17. Delete Voucher
    const delRes = await request("/api/v2/simulator/voucher/delete", {
      method: "POST",
      body: { voucher_id: prodVoucherId }
    });
    assert(delRes.error === "" && delRes.response.status === "deleted", "Deleting voucher returns status 'deleted'");

    // 18. Associated Orders API
    const ordersRes = await request(`/api/v2/simulator/voucher/orders?shop_id=${shopId}`);
    assert(ordersRes.error === "", "Voucher orders endpoint succeeds");
    assert(Array.isArray(ordersRes.response.orders), "Voucher orders returns array");

    console.log("\n=======================================================");
    console.log("🎉 ALL 18 PHASE 18 VOUCHER ASSERTIONS PASSED (100%)!");
    console.log("=======================================================\n");
  } finally {
    if (server) server.close();
  }
}

run().catch((err) => {
  console.error("Test failure:", err);
  if (server) server.close();
  process.exit(1);
});
