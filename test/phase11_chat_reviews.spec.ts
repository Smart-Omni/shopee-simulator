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
let testProduct: any;
let testOrderSn: string | null = null;
let testCommentId: number | null = null;

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

async function runPhase11Tests() {
  console.log("\n=======================================================");
  console.log("PHASE 11 TEST SUITE: LIVE CHAT & POST-ORDER REVIEWS");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://127.0.0.1:${addr.port}`;

  try {
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    assert(shop !== null, "Target Shop exists");
    accessToken = shop!.accessToken || "test_access_token";

    // Setup product & completed order
    testProduct = await prisma.product.create({
      data: {
        shopId: BigInt(SHOP_ID),
        categoryId: BigInt(100001),
        itemName: "Wireless Noise Cancelling Earbuds - Phase 11",
        description: "Earbuds for chat and review testing",
        originalPrice: 450000,
        currency: "VND",
        itemSku: `PH11-BUDS-${Date.now()}`,
        imagesJson: { image_id_list: [], image_url_list: [] }
      }
    });

    testOrderSn = `PH11ORD${Date.now()}`;
    await prisma.order.create({
      data: {
        orderSn: testOrderSn,
        shopId: BigInt(SHOP_ID),
        orderStatus: "COMPLETED",
        totalAmount: 450000,
        buyerUserId: BigInt(1001),
        buyerUsername: "audiophile_buyer",
        recipientName: "Tran Van Audio",
        recipientCity: "Ho Chi Minh City",
        payTime: new Date(),
        shipByDate: new Date(Date.now() + 172800000)
      }
    });

    // -------------------------------------------------------------
    // Part 1: Buyer-Seller Live Chat Module
    // -------------------------------------------------------------
    // Ensure standard auto-reply is disabled for pure manual chat test
    await prisma.shopChatSetting.upsert({
      where: { shopId: BigInt(SHOP_ID) },
      update: { standardAutoReplyEnabled: false },
      create: {
        shopId: BigInt(SHOP_ID),
        standardAutoReplyEnabled: false,
        standardAutoReplyMessage: "Cảm ơn bạn đã nhắn tin cho shop.",
        offWorkAutoReplyEnabled: false,
        offWorkAutoReplyMessage: "Cảm ơn bạn đã nhắn tin ngoài giờ.",
        showQuickReplySuggestions: true
      }
    });

    const testChatBuyerId = 9999;
    console.log("\n[Test 1] Send Live Chat Message (Buyer -> Seller)");
    const sendBuyerMsgRes = await request("/api/v2/simulator/chat/send", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        buyer_user_id: testChatBuyerId,
        buyer_username: "audiophile_buyer",
        sender_type: "BUYER",
        message: "Hi seller, is this earbuds waterproof?",
        order_sn: testOrderSn
      }
    });

    assert(sendBuyerMsgRes.json.error === "", "Buyer message sent successfully");
    assert(sendBuyerMsgRes.json.response.message_id > 0, "Returns valid message_id");
    assert(sendBuyerMsgRes.json.response.sender_type === "BUYER", "Sender type is BUYER");

    console.log("\n[Test 2] Query Shop Conversations & Unread Count");
    const convRes = await request(`/api/v2/simulator/chat/conversations?shop_id=${SHOP_ID}`);
    assert(convRes.json.error === "", "Conversations endpoint succeeds");
    const thread = convRes.json.response.conversations.find((c: any) => c.buyer_user_id === testChatBuyerId);
    assert(thread !== undefined, "Found buyer thread in conversations");
    assert(thread.unread_count === 1, "Unread count for seller is 1");
    assert(thread.last_message.includes("waterproof"), "Last message matches buyer inquiry");

    console.log("\n[Test 3] Seller Reads and Replies to Buyer");
    const markReadRes = await request("/api/v2/simulator/chat/mark_read", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        buyer_user_id: testChatBuyerId,
        reader_type: "SELLER"
      }
    });
    assert(markReadRes.json.error === "", "Mark read succeeds");
    assert(markReadRes.json.response.marked_count === 1, "Marked 1 message as read");

    const sendSellerReplyRes = await request("/api/v2/simulator/chat/send", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        buyer_user_id: testChatBuyerId,
        sender_type: "SELLER",
        message: "Yes! It has IPX7 water resistance rating."
      }
    });
    assert(sendSellerReplyRes.json.error === "", "Seller reply sent successfully");
    assert(sendSellerReplyRes.json.response.sender_type === "SELLER", "Sender type is SELLER");

    const chatHistoryRes = await request(`/api/v2/simulator/chat/messages?shop_id=${SHOP_ID}&buyer_user_id=${testChatBuyerId}`);
    assert(chatHistoryRes.json.response.messages.length === 2, "Conversation history has exactly 2 messages");

    // Verify buyer name is preserved in thread listing after seller reply
    const convAfterReplyRes = await request(`/api/v2/simulator/chat/conversations?shop_id=${SHOP_ID}`);
    const threadAfterReply = convAfterReplyRes.json.response.conversations.find((c: any) => c.buyer_user_id === testChatBuyerId);
    assert(threadAfterReply.buyer_username === "audiophile_buyer", "Preserves authentic buyer username in thread list after seller reply");

    // -------------------------------------------------------------
    // Part 2: Post-Order Rating & Reviews
    // -------------------------------------------------------------
    console.log("\n[Test 4] Post-Order Review Submission on COMPLETED Order");
    const reviewRes = await request("/api/v2/simulator/review/create", {
      method: "POST",
      body: {
        order_sn: testOrderSn,
        item_id: Number(testProduct.itemId),
        rating_star: 5,
        comment: "Excellent sound quality, crisp treble and deep bass! 10/10 recommend.",
        buyer_username: "audiophile_buyer",
        buyer_user_id: 1001
      }
    });

    assert(reviewRes.json.error === "", "Review submitted successfully");
    testCommentId = reviewRes.json.response.comment_id;
    assert(testCommentId !== null && testCommentId > 0, "Returns valid comment_id");
    assert(reviewRes.json.response.rating_star === 5, "Rating star is 5");
    assert(reviewRes.json.response.rating_count >= 1, "Shop rating count incremented");

    // Test duplicate review rejection
    const duplicateReviewRes = await request("/api/v2/simulator/review/create", {
      method: "POST",
      body: {
        order_sn: testOrderSn,
        item_id: Number(testProduct.itemId),
        rating_star: 4,
        comment: "Trying to submit second review",
        buyer_username: "audiophile_buyer",
        buyer_user_id: 1001
      }
    });
    assert(duplicateReviewRes.json.error === "product.duplicate_request", "Rejects duplicate review submission with 'product.duplicate_request'");

    // Verify simulator orders query returns SLA ship_by_date and has_reviewed
    const ordersRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}`);
    const targetOrder = ordersRes.json.response.orders.find((o: any) => o.order_sn === testOrderSn);
    assert(typeof targetOrder.ship_by_date === "number", "Order includes numeric ship_by_date timestamp");
    assert(targetOrder.has_reviewed === true, "Order indicates has_reviewed = true after review submission");
    assert(targetOrder.reviewed_item_ids.includes(Number(testProduct.itemId)), "reviewed_item_ids includes reviewed item");

    console.log("\n[Test 5] Query Review via Official v2.product.get_comment (HMAC Guarded)");
    const getCommentPath = makeSignedUrl("/api/v2/product/get_comment", {
      item_id: Number(testProduct.itemId)
    });
    const getCommentRes = await request(getCommentPath);
    assert(getCommentRes.json.error === "", "get_comment succeeds");
    assert(Array.isArray(getCommentRes.json.response.item_comment_list), "item_comment_list is array");
    const foundComment = getCommentRes.json.response.item_comment_list.find((c: any) => c.comment_id === testCommentId);
    assert(foundComment !== undefined, "Found newly created review in get_comment response");
    assert(foundComment.rating_star === 5, "Rating star is 5");
    assert(foundComment.comment.includes("crisp treble"), "Comment text matches");
    assert(foundComment.comment_reply === null, "Comment has no reply yet");

    console.log("\n[Test 6] Seller Replies to Review via Official v2.product.reply_comment");
    const replyPath = makeSignedUrl("/api/v2/product/reply_comment");
    const replyRes = await request(replyPath, {
      method: "POST",
      body: {
        comment_list: [
          {
            comment_id: testCommentId,
            comment: "Thank you for the wonderful review! Enjoy your audio journey!"
          }
        ]
      }
    });

    assert(replyRes.json.error === "", "reply_comment succeeds");
    assert(replyRes.json.response.result_list[0].comment_id === testCommentId, "result_list echoes comment_id");
    assert(replyRes.json.response.result_list[0].fail_error === "", "fail_error is empty string (success)");

    // Test duplicate reply prevention
    const duplicateReplyRes = await request(replyPath, {
      method: "POST",
      body: {
        comment_list: [
          {
            comment_id: testCommentId,
            comment: "Another reply attempt"
          }
        ]
      }
    });
    assert(duplicateReplyRes.json.response.result_list[0].fail_error === "product.duplicate_request", "Rejects duplicate reply with 'product.duplicate_request'");

    // Verify reply in get_comment
    const verifyGetRes = await request(getCommentPath);
    const updatedComment = verifyGetRes.json.response.item_comment_list.find((c: any) => c.comment_id === testCommentId);
    assert(updatedComment.comment_reply !== null, "comment_reply is populated");
    assert(updatedComment.comment_reply.reply.includes("wonderful review"), "Reply text verified");

    console.log("\n✅ ALL 25 PHASE 11 ASSERTIONS PASSED!\n");
  } finally {
    if (testCommentId) {
      await prisma.productComment.deleteMany({ where: { commentId: BigInt(testCommentId) } }).catch(() => {});
    }
    await prisma.chatMessage.deleteMany({ where: { buyerUserId: BigInt(9999) } }).catch(() => {});
    if (testOrderSn) {
      await prisma.orderItem.deleteMany({ where: { orderSn: testOrderSn } }).catch(() => {});
      await prisma.order.delete({ where: { orderSn: testOrderSn } }).catch(() => {});
    }
    if (testProduct) {
      await prisma.productModel.deleteMany({ where: { itemId: testProduct.itemId } }).catch(() => {});
      await prisma.product.delete({ where: { itemId: testProduct.itemId } }).catch(() => {});
    }
    server.close();
  }
}

if (require.main === module) {
  runPhase11Tests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
}

export { runPhase11Tests };
