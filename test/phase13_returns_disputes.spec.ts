import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import * as http from "http";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

let server: http.Server;
let baseUrl: string;
let accessToken: string;

const testOrderSn1 = "ORD261020RET01";
const testOrderSn2 = "ORD261020RET02";
const testOrderSn3 = "ORD261020RET03";
const testOrderSn4 = "ORD261020RET04";
const testOrderSn5 = "ORD261020RET05";

let retSn1 = "";
let retSn2 = "";
let retSn3 = "";
let retSnOffer = "";

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
  let text = "";

  if (contentType.includes("application/json")) {
    json = await res.json();
  } else {
    text = await res.text();
  }

  return { status: res.status, headers: res.headers, json, text };
}

function makeSignedUrl(path: string, additionalParams: Record<string, any> = {}): string {
  const now = Math.floor(Date.now() / 1000);
  const baseStr = buildBaseString(PARTNER_ID, path, now, accessToken, SHOP_ID);
  const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

  const query = new URLSearchParams();
  query.set("partner_id", String(PARTNER_ID));
  query.set("timestamp", String(now));
  query.set("access_token", accessToken);
  query.set("shop_id", String(SHOP_ID));
  query.set("sign", sign);

  for (const [k, v] of Object.entries(additionalParams)) {
    query.set(k, String(v));
  }

  return `${path}?${query.toString()}`;
}

async function runPhase13Tests() {
  console.log("=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 13 RETURNS & DISPUTES SUITE ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const port = (server.address() as any).port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // -------------------------------------------------------------------------
    // PREPARATION: Fetch Access Token & Clean Up Old Test Data
    // -------------------------------------------------------------------------
    console.log("PREPARATION: Setting up active token and test orders...");
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    if (!shop || !shop.accessToken) {
      throw new Error("Target shop or access token not found");
    }
    accessToken = shop.accessToken;

    const testOrders = [testOrderSn1, testOrderSn2, testOrderSn3, testOrderSn4, testOrderSn5];

    // Purge previous test returns and orders
    await prisma.returnProof.deleteMany({
      where: { return: { orderSn: { in: testOrders } } }
    });
    await prisma.returnItem.deleteMany({
      where: { return: { orderSn: { in: testOrders } } }
    });
    await prisma.return.deleteMany({
      where: { orderSn: { in: testOrders } }
    });
    await prisma.packageItem.deleteMany({
      where: { package: { orderSn: { in: testOrders } } }
    });
    await prisma.orderPackage.deleteMany({
      where: { orderSn: { in: testOrders } }
    });
    await prisma.orderItem.deleteMany({
      where: { orderSn: { in: testOrders } }
    });
    await prisma.order.deleteMany({
      where: { orderSn: { in: testOrders } }
    });

    const testProduct = await prisma.product.findFirst({
      where: { shopId: BigInt(SHOP_ID) },
      include: { models: true }
    });
    if (!testProduct) throw new Error("No products found in shop");

    // Helper to create & deliver an order
    async function createTestOrder(orderSn: string, deliver: boolean = true) {
      const res = await request("/api/v2/simulator/order/create", {
        method: "POST",
        body: {
          order_sn: orderSn,
          shop_id: SHOP_ID,
          order_status: "READY_TO_SHIP",
          recipient_name: "Buyer Test",
          recipient_phone: "+84912345678",
          recipient_address: "123 Vo Van Tan, Q3, HCMC",
          recipient_city: "Ho Chi Minh City",
          channel_id: 30001,
          items: [
            {
              item_id: Number(testProduct!.itemId),
              quantity: 2
            }
          ]
        }
      });
      if (!res.json?.response?.order_sn) {
        throw new Error(`Failed to create order ${orderSn}: ${JSON.stringify(res.json)}`);
      }

      if (deliver) {
        const delRes = await request("/api/v2/simulator/order/deliver", {
          method: "POST",
          body: { order_sn: orderSn }
        });
        if (delRes.json?.response?.order_status !== "COMPLETED") {
          throw new Error(`Failed to deliver order ${orderSn}`);
        }
      }
    }

    await createTestOrder(testOrderSn1, true);
    await createTestOrder(testOrderSn2, true);
    await createTestOrder(testOrderSn3, true);
    await createTestOrder(testOrderSn4, false); // NOT delivered (READY_TO_SHIP)
    await createTestOrder(testOrderSn5, true);

    console.log("  ✓ Test orders prepared (4 delivered, 1 ready-to-ship)\n");

    // -------------------------------------------------------------------------
    // TEST GROUP 1: Buyer Return Creation (Layer B) & Edge Cases
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 1: Buyer Return Creation & Validation Edge Cases");

    // 1.1 Return on non-delivered order (READY_TO_SHIP) rejected
    const rejNonDelivered = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn4,
        reason: "SP_DAMAGE",
        refund_amount: 100000
      }
    });
    assert(rejNonDelivered.json?.error === "order.invalid_status", "Return on non-delivered order rejected with order.invalid_status");
    assert(rejNonDelivered.json?.message?.includes("SHIPPED or COMPLETED"), "Rejection message notes order must be delivered");

    // 1.2 Excessive refund amount rejected
    const rejExcessive = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn1,
        reason: "SP_DAMAGE",
        refund_amount: 999999999
      }
    });
    assert(rejExcessive.json?.error === "error_param", "Excessive refund amount rejected with error_param");

    // 1.3 Create valid return request (Shopee-First / warehouse_validation)
    const req1 = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn1,
        reason: "SP_DAMAGE",
        text_reason: "Hàng bị vỡ khi nhận",
        refund_amount: 150000,
        solution: "RETURN_REFUND",
        validation_type: "warehouse_validation",
        proof_images: ["https://img.shopee.vn/test_damage1.jpg"]
      }
    });
    assert(req1.status === 200 && req1.json?.error === "", "Valid return request (warehouse_validation) returns HTTP 200");
    assert(req1.json?.response?.return_sn?.startsWith("RET"), "Returns generated return_sn starting with RET");
    assert(req1.json?.response?.status === "JUDGING", "Shopee-first flow starts in JUDGING status");
    assert(req1.json?.response?.validation_type === "warehouse_validation", "validation_type is warehouse_validation");
    retSn1 = req1.json?.response?.return_sn;

    // 1.4 Duplicate return on same order rejected
    const dupRes = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn1,
        reason: "SP_WRONG_ITEM"
      }
    });
    assert(dupRes.json?.error === "return.duplicate_request", "Duplicate active return on same order rejected with return.duplicate_request");

    // 1.5 Create valid return request (Seller-First / seller_validation)
    const req2 = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn2,
        reason: "SP_WRONG_ITEM",
        text_reason: "Giao nhầm size",
        refund_amount: 100000,
        solution: "RETURN_REFUND",
        validation_type: "seller_validation"
      }
    });
    assert(req2.status === 200 && req2.json?.error === "", "Valid return request (seller_validation) returns HTTP 200");
    assert(req2.json?.response?.status === "REQUESTED", "Seller-first flow starts in REQUESTED status");
    assert(req2.json?.response?.due_date > Math.floor(Date.now() / 1000), "due_date is set in future");
    retSn2 = req2.json?.response?.return_sn;

    // 1.6 Create valid return request for Order 3 (for dispute flow)
    const req3 = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn3,
        reason: "SP_CHANGE_MIND",
        text_reason: "Đổi ý không muốn mua",
        refund_amount: 200000,
        solution: "REFUND_ONLY",
        validation_type: "seller_validation"
      }
    });
    assert(req3.status === 200 && req3.json?.error === "", "Valid return request 3 created");
    retSn3 = req3.json?.response?.return_sn;

    // -------------------------------------------------------------------------
    // TEST GROUP 2: Official Layer A Query Endpoints
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 2: Official Layer A Query Endpoints");

    // 2.1 get_return_list with valid HMAC
    const listUrl = makeSignedUrl("/api/v2/returns/get_return_list");
    const listRes = await request(listUrl, {
      method: "POST",
      body: { page_no: 1, page_size: 10 }
    });
    assert(listRes.status === 200, "get_return_list returns HTTP 200");
    assert(listRes.json?.error === "", "get_return_list error code is empty");
    assert(Array.isArray(listRes.json?.response?.return_list), "return_list is an array");
    assert(listRes.json?.response?.return_list.length >= 3, "return_list has at least 3 returns");
    assert(listRes.json?.response?.total >= 3, "total return count matches");

    // 2.2 Filter by status
    const filterRes = await request(listUrl, {
      method: "POST",
      body: { page_no: 1, page_size: 10, status: "JUDGING" }
    });
    assert(filterRes.status === 200, "Filtered get_return_list returns HTTP 200");
    const judgingList = filterRes.json?.response?.return_list;
    assert(judgingList.every((r: any) => r.status === "JUDGING"), "All returned items have status JUDGING");

    // 2.3 Pagination test
    const pageRes = await request(listUrl, {
      method: "POST",
      body: { page_no: 1, page_size: 1 }
    });
    assert(pageRes.json?.response?.return_list.length === 1, "Page size 1 returns exactly 1 item");
    assert(pageRes.json?.response?.more === true, "more flag is true when more items exist");

    // 2.4 get_return_detail
    const detailUrl = makeSignedUrl("/api/v2/returns/get_return_detail");
    const detailRes = await request(detailUrl, {
      method: "POST",
      body: { return_sn: retSn1 }
    });
    assert(detailRes.status === 200, "get_return_detail returns HTTP 200");
    assert(detailRes.json?.error === "", "get_return_detail error is empty");
    assert(detailRes.json?.response?.return_sn === retSn1, "Echoes requested return_sn");
    assert(detailRes.json?.response?.order_sn === testOrderSn1, "order_sn matches");
    assert(Array.isArray(detailRes.json?.response?.item), "item is an array");
    assert(detailRes.json?.response?.item.length > 0, "item array is populated with order items");
    assert(detailRes.json?.response?.user?.username === "Buyer Test", "buyer user details populated");
    assert(detailRes.json?.response?.proof_images?.length === 1, "proof_images array contains buyer image");

    // 2.5 get_available_solutions
    const solUrl = makeSignedUrl("/api/v2/returns/get_available_solutions");
    const solRes = await request(solUrl, {
      method: "POST",
      body: { return_sn: retSn1 }
    });
    assert(solRes.status === 200, "get_available_solutions returns HTTP 200");
    assert(Array.isArray(solRes.json?.response?.solutions), "solutions is an array");
    assert(solRes.json?.response?.solutions.length === 2, "solutions contains RETURN_REFUND and REFUND_ONLY");

    // -------------------------------------------------------------------------
    // TEST GROUP 3: Shopee-First Flow (Approval, Warehouse, Dispute, Compensation)
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 3: Shopee-First Flow (Warehouse Validation & Dispute)");

    // 3.1 Shopee CS approves buyer return -> moves from JUDGING to PROCESSING
    const csApprove = await request("/api/v2/simulator/admin/returns/review", {
      method: "POST",
      body: {
        return_sn: retSn1,
        action: "APPROVE_RETURN",
        notes: "Shopee CS approved buyer return request"
      }
    });
    assert(csApprove.status === 200, "Shopee Admin APPROVE_RETURN returns HTTP 200");
    assert(csApprove.json?.response?.status === "PROCESSING", "Status transitioned to PROCESSING");

    // 3.2 Shopee Warehouse Check-in -> moves to ACCEPTED & settles refund deduction
    const whCheckin = await request("/api/v2/simulator/admin/returns/warehouse_inbound", {
      method: "POST",
      body: {
        return_sn: retSn1,
        inspection_result: "PASS"
      }
    });
    assert(whCheckin.status === 200, "Warehouse check-in returns HTTP 200");
    assert(whCheckin.json?.response?.status === "ACCEPTED", "Status transitioned to ACCEPTED");

    // 3.3 Verify Escrow deduction & return_order_sn_list
    const escrowUrl = makeSignedUrl("/api/v2/payment/get_escrow_detail");
    const escrowRes = await request(escrowUrl, {
      method: "POST",
      body: { order_sn: testOrderSn1 }
    });
    assert(escrowRes.status === 200, "get_escrow_detail returns HTTP 200");
    assert(escrowRes.json?.response?.return_order_sn_list?.includes(retSn1), "return_sn included in return_order_sn_list");

    // 3.4 Query dispute reasons (POST /api/v2/returns/get_return_dispute_reason)
    const reasonUrl = makeSignedUrl("/api/v2/returns/get_return_dispute_reason");
    const reasonRes = await request(reasonUrl, {
      method: "POST",
      body: { return_sn: retSn1 }
    });
    assert(reasonRes.status === 200, "get_return_dispute_reason returns HTTP 200");
    const disputeReasons = reasonRes.json?.response?.dispute_reason;
    assert(Array.isArray(disputeReasons), "dispute_reason is an array");
    const hasOtherReason = disputeReasons.some((r: any) => r.dispute_reason_id === 49 && r.dispute_reason_name === "OTHER");
    assert(hasOtherReason, "Predefined dispute reasons include ID 49 (OTHER)");

    // 3.5 Invalid dispute reason ID rejected
    const disputeUrl = makeSignedUrl("/api/v2/returns/dispute");
    const invDispute = await request(disputeUrl, {
      method: "POST",
      body: {
        return_sn: retSn1,
        dispute_reason_id: 99999, // INVALID
        dispute_text_reason: "Invalid reason test",
        email: "seller@test.com"
      }
    });
    assert(invDispute.status === 200 && invDispute.json?.error === "return.invalid_dispute_reason", "Invalid dispute_reason_id rejected with return.invalid_dispute_reason");

    // 3.6 Valid seller dispute for compensation (Shopee-First post-accepted)
    const validDispute = await request(disputeUrl, {
      method: "POST",
      body: {
        return_sn: retSn1,
        dispute_reason_id: 47, // ITEM_DAMAGED_BY_BUYER
        dispute_text_reason: "Hàng bị người mua làm hỏng trước khi gửi về kho",
        email: "seller@shop.vn",
        image: ["https://img.shopee.vn/seller_evidence.jpg"]
      }
    });
    assert(validDispute.status === 200 && validDispute.json?.error === "", "Seller dispute registered successfully");

    // Verify compensation status updated
    const detAfterDispute = await request(detailUrl, {
      method: "POST",
      body: { return_sn: retSn1 }
    });
    assert(detAfterDispute.json?.response?.seller_compensation_status === "COMPENSATION_REQUESTED", "compensation_status is COMPENSATION_REQUESTED");
    assert(detAfterDispute.json?.response?.seller_proof_images?.length === 1, "seller_proof_images populated");

    // 3.7 Shopee Admin approves seller compensation
    const compApprove = await request("/api/v2/simulator/admin/returns/arbitrate_dispute", {
      method: "POST",
      body: {
        return_sn: retSn1,
        ruling: "PLATFORM_COMPENSATE",
        notes: "Shopee reimbursed seller for buyer damages"
      }
    });
    assert(compApprove.status === 200, "APPROVE_COMPENSATION returns HTTP 200");
    assert(compApprove.json?.response?.compensation_status === "COMPENSATION_APPROVED", "compensation_status updated to COMPENSATION_APPROVED");

    // -------------------------------------------------------------------------
    // TEST GROUP 4: Seller-First Flow - Direct Seller Confirm & Refund (Scenario 2A)
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 4: Seller-First Flow - Direct Confirm & Escrow Refund");

    // 4.1 Seller confirms return directly (POST /api/v2/returns/confirm)
    const confirmUrl = makeSignedUrl("/api/v2/returns/confirm");
    const confirmRes = await request(confirmUrl, {
      method: "POST",
      body: { return_sn: retSn2 }
    });
    assert(confirmRes.status === 200 && confirmRes.json?.error === "", "Seller confirm returns HTTP 200");
    assert(confirmRes.json?.response?.return_sn === retSn2, "Echoes return_sn");

    // Verify status is ACCEPTED
    const det2 = await request(detailUrl, {
      method: "POST",
      body: { return_sn: retSn2 }
    });
    assert(det2.json?.response?.status === "ACCEPTED", "Return 2 transitioned to ACCEPTED");

    // 4.2 Re-confirming an already ACCEPTED return rejected
    const reconfirmRes = await request(confirmUrl, {
      method: "POST",
      body: { return_sn: retSn2 }
    });
    assert(reconfirmRes.json?.error === "return.invalid_status", "Re-confirming ACCEPTED return rejected with return.invalid_status");

    // -------------------------------------------------------------------------
    // TEST GROUP 5: Counter-Offer & Offer Acceptance (Scenario 2B)
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 5: Seller Counter-Offer & Offer Acceptance");

    // Create a return on Order 5 for testing counter-offer
    const req5 = await request("/api/v2/simulator/returns/buyer_request", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn5,
        reason: "SP_DAMAGE",
        refund_amount: 120000,
        solution: "RETURN_REFUND",
        validation_type: "seller_validation"
      }
    });
    retSnOffer = req5.json?.response?.return_sn;

    // 5.1 Excessive counter-offer amount rejected
    const offerUrl = makeSignedUrl("/api/v2/returns/offer");
    const rejOffer = await request(offerUrl, {
      method: "POST",
      body: {
        return_sn: retSnOffer,
        offer_amount: 200000 // Greater than original 120,000
      }
    });
    assert(rejOffer.json?.error === "error_param", "Counter-offer exceeding original refund rejected with error_param");

    // 5.2 Valid counter-offer
    const validOffer = await request(offerUrl, {
      method: "POST",
      body: {
        return_sn: retSnOffer,
        offer_amount: 60000
      }
    });
    assert(validOffer.status === 200 && validOffer.json?.error === "", "Counter-offer registered successfully");

    // 5.3 Accept counter-offer (POST /api/v2/returns/accept_offer)
    const acceptOfferUrl = makeSignedUrl("/api/v2/returns/accept_offer");
    const acceptOfferRes = await request(acceptOfferUrl, {
      method: "POST",
      body: { return_sn: retSnOffer }
    });
    assert(acceptOfferRes.status === 200 && acceptOfferRes.json?.error === "", "accept_offer returns HTTP 200");

    // Verify refund amount updated to counter-offer amount and status is ACCEPTED
    const detOffer = await request(detailUrl, {
      method: "POST",
      body: { return_sn: retSnOffer }
    });
    assert(detOffer.json?.response?.status === "ACCEPTED", "Offer accepted return transitioned to ACCEPTED");
    assert(detOffer.json?.response?.refund_amount === 60000, "refund_amount updated to counter-offer amount 60,000");

    // -------------------------------------------------------------------------
    // TEST GROUP 6: Seller Dispute & Rejection of Buyer Request (Scenario 2C)
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 6: Seller Dispute, Cancellation & Shopee Admin Reject Buyer");

    // 6.1 Seller disputes Buyer request on Return 3 (seller_validation)
    const dispute3 = await request(disputeUrl, {
      method: "POST",
      body: {
        return_sn: retSn3,
        dispute_reason_id: 49, // OTHER
        dispute_text_reason: "Sản phẩm đã bị bóc tem niêm phong và qua sử dụng",
        email: "seller@shop.vn"
      }
    });
    assert(dispute3.status === 200 && dispute3.json?.error === "", "Dispute on REQUESTED return escalated to Shopee Admin");

    const det3Dispute = await request(detailUrl, {
      method: "POST",
      body: { return_sn: retSn3 }
    });
    assert(det3Dispute.json?.response?.status === "SELLER_DISPUTE", "Status moved to SELLER_DISPUTE");

    // 6.2 Cancel dispute before arbitration (POST /api/v2/returns/cancel_dispute)
    const cancelDisputeUrl = makeSignedUrl("/api/v2/returns/cancel_dispute");
    const cancelRes = await request(cancelDisputeUrl, {
      method: "POST",
      body: { return_sn: retSn3 }
    });
    assert(cancelRes.status === 200 && cancelRes.json?.error === "", "cancel_dispute returns HTTP 200");

    const det3Cancelled = await request(detailUrl, {
      method: "POST",
      body: { return_sn: retSn3 }
    });
    assert(det3Cancelled.json?.response?.status === "REQUESTED", "Status reverted to REQUESTED after dispute cancel");

    // 6.3 Re-dispute to test Shopee Admin SELLER_WIN (reject buyer claim)
    await request(disputeUrl, {
      method: "POST",
      body: {
        return_sn: retSn3,
        dispute_reason_id: 49,
        dispute_text_reason: "Sản phẩm bị bóc tem",
        email: "seller@shop.vn"
      }
    });

    // 6.4 Shopee Admin rejects buyer request -> CLOSED
    const rejectBuyer = await request("/api/v2/simulator/admin/returns/arbitrate_dispute", {
      method: "POST",
      body: {
        return_sn: retSn3,
        ruling: "SELLER_WIN",
        notes: "Bác bỏ yêu cầu của người mua do hàng đã mở tem"
      }
    });
    assert(rejectBuyer.status === 200, "SELLER_WIN returns HTTP 200");
    assert(rejectBuyer.json?.response?.status === "CLOSED", "Return status closed as CLOSED");

    // -------------------------------------------------------------------------
    // TEST GROUP 7: Proof Upload & Query Endpoints
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 7: Proof Upload & Query Endpoints");

    // 7.1 Upload Proof (POST /api/v2/returns/upload_proof)
    const uploadProofUrl = makeSignedUrl("/api/v2/returns/upload_proof");
    const uploadRes = await request(uploadProofUrl, {
      method: "POST",
      body: {
        return_sn: retSn1,
        url: "https://mock-s3.shopee.vn/proof_inspection_01.jpg",
        description: "Ảnh chụp thực tế bưu phẩm"
      }
    });
    assert(uploadRes.status === 200 && uploadRes.json?.error === "", "upload_proof returns HTTP 200");
    assert(typeof uploadRes.json?.response?.proof_id === "number", "proof_id is returned");

    // 7.2 Query Proofs (POST /api/v2/returns/query_proof)
    const queryProofUrl = makeSignedUrl("/api/v2/returns/query_proof");
    const queryProofRes = await request(queryProofUrl, {
      method: "POST",
      body: { return_sn: retSn1 }
    });
    assert(queryProofRes.status === 200 && queryProofRes.json?.error === "", "query_proof returns HTTP 200");
    const proofList = queryProofRes.json?.response?.proof_list;
    assert(Array.isArray(proofList), "proof_list is an array");
    assert(proofList.some((p: any) => p.image_url === "https://mock-s3.shopee.vn/proof_inspection_01.jpg"), "Uploaded proof found in query_proof");

    // -------------------------------------------------------------------------
    // TEST GROUP 8: Webhook & Protocol Security Edge Cases
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 8: Webhook Verification & Protocol Security");

    // 8.1 Verify Webhook code 29 dispatched
    const webhookEvents = await prisma.webhookLog.findMany({
      where: {
        shopId: BigInt(SHOP_ID),
        pushCode: 29
      },
      orderBy: { id: "desc" },
      take: 5
    });
    assert(webhookEvents.length > 0, "Push code 29 (RETURN_STATUS_UPDATE) dispatched to webhook queue");
    const latestPayload: any = typeof webhookEvents[0].payloadJson === "string"
      ? JSON.parse(webhookEvents[0].payloadJson)
      : webhookEvents[0].payloadJson;
    assert(latestPayload.data?.return_sn !== undefined, "Webhook payload contains return_sn");
    assert(latestPayload.code === 29, "Webhook code is 29");

    // 8.2 Escrow Floor Clamping to 0
    const order1Db = await prisma.order.findUnique({ where: { orderSn: testOrderSn1 } });
    assert(order1Db !== null && Number(order1Db.escrowAmount || 0) >= 0, "Escrow amount clamped to >= 0 after refund");

    // 8.3 Wrong HMAC signature rejected
    const badSignUrl = `/api/v2/returns/get_return_list?partner_id=${PARTNER_ID}&timestamp=${Math.floor(Date.now() / 1000)}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=invalid_hmac_hex`;
    const badSignRes = await request(badSignUrl, { method: "POST", body: {} });
    assert(badSignRes.json?.error === "error_sign", "Wrong HMAC rejected with error_sign");

    // 8.4 Expired timestamp rejected
    const expiredTimestamp = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago (> 5 mins)
    const expBase = buildBaseString(PARTNER_ID, "/api/v2/returns/get_return_list", expiredTimestamp, accessToken, SHOP_ID);
    const expSign = calculateHmacSha256(PARTNER_KEY, expBase);
    const expUrl = `/api/v2/returns/get_return_list?partner_id=${PARTNER_ID}&timestamp=${expiredTimestamp}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${expSign}`;
    const expRes = await request(expUrl, { method: "POST", body: {} });
    assert(expRes.json?.error === "error_param", "Expired timestamp rejected with error_param");

    // 8.5 Simulator Returns List Endpoint (Public Layer B)
    const simListRes = await request(`/api/v2/simulator/returns?shop_id=${SHOP_ID}`);
    assert(simListRes.status === 200, "Simulator public return list returns HTTP 200");
    assert(Array.isArray(simListRes.json?.response?.returns), "Simulator returns is an array");
    assert(typeof simListRes.json?.response?.summary?.total === "number", "Simulator returns total count provided");

    console.log("\n=======================================================");
    console.log("   🎉 ALL PHASE 13 RETURNS & DISPUTES TESTS PASSED!   ");
    console.log("=======================================================\n");

  } finally {
    if (server) {
      server.close();
    }
  }
}

runPhase13Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
