import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";

export const chatRouter = Router();

const SEEDED_BUYER_NAMES: Record<number, string> = {
  1001: "Nguyen Van A",
  1002: "Tran Thi B",
  1003: "Le Van C"
};

// ============================================================================
// 1. SEND CHAT MESSAGE: POST /api/v2/simulator/chat/send
// ============================================================================
chatRouter.post("/api/v2/simulator/chat/send", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      shop_id,
      buyer_user_id = 1001,
      buyer_username,
      sender_type,
      message,
      order_sn
    } = req.body || {};

    if (!shop_id) {
      res.json(createShopeeErrorResponse("error_param", "shop_id is required"));
      return;
    }

    if (!sender_type || (sender_type !== "BUYER" && sender_type !== "SELLER")) {
      res.json(createShopeeErrorResponse("error_param", "sender_type must be BUYER or SELLER"));
      return;
    }

    const msgText = String(message || "").trim();
    if (!msgText) {
      res.json(createShopeeErrorResponse("error_param", "message must not be empty"));
      return;
    }

    let resolvedBuyerUsername = String(buyer_username || "").trim();
    const buyerIdNum = Number(buyer_user_id);

    // If buyer_username wasn't supplied or is generic default
    if (!resolvedBuyerUsername || resolvedBuyerUsername === "shopee_buyer_test") {
      const prevBuyerMsg = await prisma.chatMessage.findFirst({
        where: {
          shopId: BigInt(shop_id),
          buyerUserId: BigInt(buyer_user_id),
          senderType: "BUYER"
        },
        orderBy: { messageId: "desc" }
      });

      if (prevBuyerMsg && prevBuyerMsg.buyerUsername && prevBuyerMsg.buyerUsername !== "shopee_buyer_test") {
        resolvedBuyerUsername = prevBuyerMsg.buyerUsername;
      } else if (SEEDED_BUYER_NAMES[buyerIdNum]) {
        resolvedBuyerUsername = SEEDED_BUYER_NAMES[buyerIdNum];
      } else {
        resolvedBuyerUsername = "Shopee Buyer";
      }
    }

    const chatMsg = await prisma.chatMessage.create({
      data: {
        shopId: BigInt(shop_id),
        buyerUserId: BigInt(buyer_user_id),
        buyerUsername: resolvedBuyerUsername,
        senderType: sender_type,
        orderSn: order_sn ? String(order_sn) : null,
        message: msgText
      }
    });

    res.json(createShopeeSuccessResponse({
      message_id: Number(chatMsg.messageId),
      shop_id: Number(chatMsg.shopId),
      buyer_user_id: Number(chatMsg.buyerUserId),
      buyer_username: chatMsg.buyerUsername,
      sender_type: chatMsg.senderType,
      order_sn: chatMsg.orderSn,
      message: chatMsg.message,
      created_at: Math.floor(chatMsg.createdAt.getTime() / 1000)
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to send chat message"));
  }
});

// ============================================================================
// 2. GET MESSAGES: GET /api/v2/simulator/chat/messages
// ============================================================================
chatRouter.get("/api/v2/simulator/chat/messages", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    const buyerUserIdStr = (req.query.buyer_user_id as string) || "1001";
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));

    if (!shopIdStr) {
      res.json(createShopeeErrorResponse("error_param", "shop_id is required"));
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(buyerUserIdStr)
      },
      orderBy: { messageId: "asc" },
      take: limit
    });

    res.json(createShopeeSuccessResponse({
      shop_id: Number(shopIdStr),
      buyer_user_id: Number(buyerUserIdStr),
      messages: messages.map(m => ({
        message_id: Number(m.messageId),
        sender_type: m.senderType,
        buyer_username: m.buyerUsername,
        order_sn: m.orderSn,
        message: m.message,
        is_read: m.isRead,
        created_at: Math.floor(m.createdAt.getTime() / 1000)
      }))
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to fetch messages"));
  }
});

// ============================================================================
// 3. GET SHOP CONVERSATIONS: GET /api/v2/simulator/chat/conversations
// ============================================================================
chatRouter.get("/api/v2/simulator/chat/conversations", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    if (!shopIdStr) {
      res.json(createShopeeErrorResponse("error_param", "shop_id is required"));
      return;
    }

    const shopId = BigInt(shopIdStr);
    const messages = await prisma.chatMessage.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" }
    });

    // Group by buyerUserId
    const threadMap = new Map<string, any>();
    for (const msg of messages) {
      const bId = msg.buyerUserId.toString();
      if (!threadMap.has(bId)) {
        threadMap.set(bId, {
          buyer_user_id: Number(msg.buyerUserId),
          buyer_username: msg.buyerUsername,
          last_message: msg.message,
          last_message_sender: msg.senderType,
          last_message_time: Math.floor(msg.createdAt.getTime() / 1000),
          unread_count: 0
        });
      }
      if (msg.senderType === "BUYER" && !msg.isRead) {
        const thread = threadMap.get(bId);
        thread.unread_count += 1;
      }
    }

    res.json(createShopeeSuccessResponse({
      shop_id: Number(shopId),
      conversations: Array.from(threadMap.values())
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to fetch conversations"));
  }
});

// ============================================================================
// 4. MARK READ: POST /api/v2/simulator/chat/mark_read
// ============================================================================
chatRouter.post("/api/v2/simulator/chat/mark_read", async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, buyer_user_id = 1001, reader_type } = req.body || {};

    if (!shop_id) {
      res.json(createShopeeErrorResponse("error_param", "shop_id is required"));
      return;
    }

    const oppositeSender = reader_type === "SELLER" ? "BUYER" : "SELLER";
    const updateResult = await prisma.chatMessage.updateMany({
      where: {
        shopId: BigInt(shop_id),
        buyerUserId: BigInt(buyer_user_id),
        senderType: oppositeSender,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json(createShopeeSuccessResponse({
      marked_count: updateResult.count
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to mark read"));
  }
});
