import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import * as http from "http";

let server: http.Server;
let baseUrl = "";
let accessToken = "";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

function assert(condition: any, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function request(path: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return response.json() as Promise<any>;
}

function makeSignedUrl(path: string, extraParams: Record<string, string | number> = {}): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const baseString = buildBaseString(PARTNER_ID, path, timestamp, accessToken, SHOP_ID);
  const sign = calculateHmacSha256(PARTNER_KEY, baseString);

  const params = new URLSearchParams({
    partner_id: String(PARTNER_ID),
    timestamp: String(timestamp),
    access_token: accessToken,
    shop_id: String(SHOP_ID),
    sign,
    ...Object.fromEntries(Object.entries(extraParams).map(([k, v]) => [k, String(v)]))
  });

  return `${path}?${params.toString()}`;
}

async function run() {
  const shop = await prisma.shop.findUnique({
    where: { shopId: BigInt(SHOP_ID) }
  });
  if (!shop || !shop.accessToken) {
    throw new Error("Chat management test needs shop 727720655 with active access token");
  }
  accessToken = shop.accessToken;

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });

  try {
    console.log("=======================================================");
    console.log("PHASE 19: CHAT MANAGEMENT, AUTO-REPLY & SELLER CHAT APIS");
    console.log("=======================================================\n");

    // =========================================================
    // 1. LAYER B: CHAT PERFORMANCE METRICS
    // =========================================================
    console.log("▶ TEST GROUP 1: Chat Performance Metrics");
    const perfRes = await request(`/api/v2/simulator/chat/performance?shop_id=${SHOP_ID}`);
    assert(perfRes.error === "", "1.1 Performance endpoint returns HTTP 200 without error");
    assert(typeof perfRes.response.chat_count === "number" && perfRes.response.chat_count >= 1, "1.2 Returns numeric chat_count");
    assert(perfRes.response.chat_count_compare !== undefined, "1.3 Returns chat_count_compare");
    assert(perfRes.response.response_rate !== undefined, "1.4 Returns response_rate");
    assert(perfRes.response.response_time !== undefined, "1.5 Returns response_time");

    // =========================================================
    // 2. LAYER B: AUTO REPLY SETTINGS & PERSISTENCE
    // =========================================================
    console.log("\n▶ TEST GROUP 2: Auto Reply Settings & Dispatch");
    const testBuyerId = 999901;
    await prisma.chatMessage.deleteMany({
      where: {
        shopId: BigInt(SHOP_ID),
        buyerUserId: BigInt(testBuyerId)
      }
    });

    const getAutoReplyRes = await request(`/api/v2/simulator/chat/auto_reply?shop_id=${SHOP_ID}`);
    assert(getAutoReplyRes.error === "", "2.1 Retrieve auto-reply settings succeeds");
    assert(typeof getAutoReplyRes.response.standard_enabled === "boolean", "2.2 standard_enabled is boolean");
    assert(typeof getAutoReplyRes.response.standard_message === "string", "2.3 standard_message is populated");

    // Update auto reply settings
    const testMsg = "Chào bạn! Shop sẽ hỗ trợ bạn ngay lập tức.";
    const updateAutoReplyRes = await request("/api/v2/simulator/chat/auto_reply", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        standard_enabled: true,
        standard_message: testMsg,
        off_work_enabled: false
      }
    });
    assert(updateAutoReplyRes.error === "", "2.4 Update auto-reply settings succeeds");
    assert(updateAutoReplyRes.response.standard_enabled === true, "2.5 standard_enabled set to true");
    assert(updateAutoReplyRes.response.standard_message === testMsg, "2.6 standard_message updated");

    // Send buyer message to trigger auto-reply
    const sendBuyerMsgRes = await request("/api/v2/simulator/chat/send", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        buyer_user_id: testBuyerId,
        buyer_username: "Le Van C",
        sender_type: "BUYER",
        message: "Shop oi con hang khong?"
      }
    });
    assert(sendBuyerMsgRes.error === "", "2.7 Buyer sends message succeeds");
    assert(sendBuyerMsgRes.response.auto_reply !== null, "2.8 Auto reply was triggered");
    assert(sendBuyerMsgRes.response.auto_reply.message === testMsg, "2.9 Auto reply matches shop configured message");

    // Send immediate second message - 24h rate limit should suppress second auto-reply
    const sendSecondMsgRes = await request("/api/v2/simulator/chat/send", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        buyer_user_id: testBuyerId,
        buyer_username: "Le Van C",
        sender_type: "BUYER",
        message: "Mau den co san khong a?"
      }
    });
    assert(sendSecondMsgRes.response.auto_reply === null, "2.10 Rate-limit suppresses second auto-reply within 24 hours");

    // =========================================================
    // 3. LAYER B: QUICK REPLY SETTINGS & 13 PRE-SEEDED MESSAGES
    // =========================================================
    console.log("\n▶ TEST GROUP 3: Quick Reply Settings & Group Quota");
    const quickReplyRes = await request(`/api/v2/simulator/chat/quick_reply?shop_id=${SHOP_ID}`);
    assert(quickReplyRes.error === "", "3.1 Retrieve quick-reply settings succeeds");
    assert(quickReplyRes.response.show_suggestions === true, "3.2 show_suggestions is true by default");
    assert(quickReplyRes.response.max_groups === 25, "3.3 max_groups is exactly 25");
    assert(quickReplyRes.response.groups.length >= 1, "3.4 At least 1 group exists");

    const defaultGroup = quickReplyRes.response.groups[0];
    assert(defaultGroup.name === "Nhóm Tin nhắn chung", "3.5 Default group name is 'Nhóm Tin nhắn chung'");
    assert(defaultGroup.messages.length === 13, "3.6 Default group contains exactly 13 pre-seeded messages");
    assert(defaultGroup.messages[0].content === "Sản phẩm có sẵn", "3.7 First message is 'Sản phẩm có sẵn'");
    assert(defaultGroup.messages[1].content === "Cám ơn bạn!", "3.8 Second message is 'Cám ơn bạn!'");

    // Rejection of > 25 groups
    const excessGroups = Array.from({ length: 26 }, (_, i) => ({
      id: `group-${i}`,
      name: `Group ${i}`,
      enabled: true,
      messages: []
    }));
    const excessRes = await request("/api/v2/simulator/chat/quick_reply", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        groups: excessGroups
      }
    });
    assert(excessRes.error === "error_param", "3.9 Rejects quick reply groups exceeding 25 with error_param");

    // =========================================================
    // 4. LAYER A: OFFICIAL SIGNED SELLER CHAT APIS
    // =========================================================
    console.log("\n▶ TEST GROUP 4: Signed Layer A Seller Chat Partner APIs");

    // 4.1 Invalid signature rejection
    const invalidSignUrl = `/api/v2/sellerchat/get_conversation_list?partner_id=${PARTNER_ID}&timestamp=${Math.floor(Date.now() / 1000)}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=bad_signature`;
    const invalidSignRes = await request(invalidSignUrl);
    assert(invalidSignRes.error === "error_sign", "4.1 Invalid signature rejected with error_sign");

    // 4.2 Valid signature conversation list
    const validConvUrl = makeSignedUrl("/api/v2/sellerchat/get_conversation_list", { page_size: 10 });
    const convListRes = await request(validConvUrl);
    assert(convListRes.error === "", "4.2 Get conversation list succeeds with valid signature");
    assert(convListRes.response.page_result.total_count >= 1, "4.3 Page result reflects active conversations");
    assert(convListRes.response.conversations.length >= 1, "4.4 Returned conversations array is populated");

    const activeConv = convListRes.response.conversations[0];
    const conversationId = activeConv.conversation_id;

    // 4.3 Get one conversation
    const oneConvUrl = makeSignedUrl("/api/v2/sellerchat/get_one_conversation", { conversation_id: conversationId });
    const oneConvRes = await request(oneConvUrl);
    assert(oneConvRes.error === "", "4.5 Get one conversation succeeds");
    assert(oneConvRes.response.conversation.conversation_id === conversationId, "4.6 Returns target conversation details");

    // 4.4 Get messages
    const getMsgUrl = makeSignedUrl("/api/v2/sellerchat/get_message", { conversation_id: conversationId, page_size: 20 });
    const getMsgRes = await request(getMsgUrl);
    assert(getMsgRes.error === "", "4.7 Get message list succeeds");
    assert(Array.isArray(getMsgRes.response.messages) && getMsgRes.response.messages.length >= 1, "4.8 Returned messages list has items");

    // 4.5 Send message via Layer A
    const sendMsgUrl = makeSignedUrl("/api/v2/sellerchat/send_message");
    const sendMsgRes = await request(sendMsgUrl, {
      method: "POST",
      body: {
        to_id: 1001,
        message_type: "text",
        content: { text: "Xin chào từ đối tác ERP qua Layer A!" }
      }
    });
    assert(sendMsgRes.error === "", "4.9 Send message via signed Layer A succeeds");
    assert(sendMsgRes.response.message_id !== undefined, "4.10 Returned message_id");

    // 4.6 Send autoreply message via Layer A
    const sendAutoUrl = makeSignedUrl("/api/v2/sellerchat/send_autoreply_message");
    const sendAutoRes = await request(sendAutoUrl, {
      method: "POST",
      body: {
        to_id: 1001,
        message_type: "text",
        content: { text: "Tin nhắn tự động từ đối tác bot!" }
      }
    });
    assert(sendAutoRes.error === "", "4.11 Send autoreply via signed Layer A succeeds");
    assert(sendAutoRes.response.is_auto_reply === true, "4.12 Returned is_auto_reply === true");

    // 4.7 Read conversation
    const readUrl = makeSignedUrl("/api/v2/sellerchat/read_conversation");
    const readRes = await request(readUrl, {
      method: "POST",
      body: { conversation_id: conversationId }
    });
    assert(readRes.error === "", "4.13 Read conversation succeeds");
    assert(readRes.response.unread_count === 0, "4.14 unread_count cleared to 0");

    console.log("\n=======================================================");
    console.log("🎉 ALL PHASE 19 CHAT MANAGEMENT ASSERTIONS PASSED (100%)!");
    console.log("=======================================================\n");
  } finally {
    server.close();
  }
}

run().catch((err) => {
  console.error("Test failed with error:", err);
  if (server) server.close();
  process.exit(1);
});
