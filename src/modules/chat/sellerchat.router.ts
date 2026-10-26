import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";

export const sellerchatRouter = Router();

// ============================================================================
// 1. GET CONVERSATION LIST: GET /api/v2/sellerchat/get_conversation_list
// ============================================================================
sellerchatRouter.get("/api/v2/sellerchat/get_conversation_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    const pageSize = Math.min(50, Math.max(1, Number(req.query.page_size || 20)));
    const filterType = Number(req.query.type || 1); // 1 = all, 2 = unread, 3 = pinned

    const shopId = BigInt(shopIdStr);
    const messages = await prisma.chatMessage.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" }
    });

    const threadMap = new Map<string, any>();
    for (const msg of messages) {
      const bId = msg.buyerUserId.toString();
      if (!threadMap.has(bId)) {
        threadMap.set(bId, {
          conversation_id: `${shopIdStr}_${bId}`,
          to_id: Number(msg.buyerUserId),
          to_name: msg.buyerUsername,
          to_avatar: "",
          message_type: "text",
          latest_message_content: { text: msg.message },
          latest_message_from_id: msg.senderType === "BUYER" ? Number(msg.buyerUserId) : Number(shopId),
          latest_message_id: Number(msg.messageId),
          latest_message_time: Math.floor(msg.createdAt.getTime() / 1000),
          unread_count: 0,
          pinned: false
        });
      }
      if (msg.senderType === "BUYER" && !msg.isRead) {
        const thread = threadMap.get(bId);
        thread.unread_count += 1;
      }
    }

    let conversations = Array.from(threadMap.values());
    if (filterType === 2) {
      conversations = conversations.filter(c => c.unread_count > 0);
    } else if (filterType === 3) {
      conversations = conversations.filter(c => c.pinned);
    }

    const totalCount = conversations.length;
    const paginated = conversations.slice(0, pageSize);

    res.json(createShopeeSuccessResponse({
      page_result: {
        page_size: pageSize,
        current_page: 1,
        total_page: Math.ceil(totalCount / pageSize) || 1,
        total_count: totalCount
      },
      conversations: paginated
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to fetch conversations"));
  }
});

// ============================================================================
// 2. GET ONE CONVERSATION: GET /api/v2/sellerchat/get_one_conversation
// ============================================================================
sellerchatRouter.get("/api/v2/sellerchat/get_one_conversation", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    const conversationId = req.query.conversation_id as string;

    if (!conversationId) {
      res.json(createShopeeErrorResponse("error_param", "conversation_id is required"));
      return;
    }

    const parts = conversationId.split("_");
    const buyerUserIdStr = parts.length > 1 ? parts[1] : parts[0];

    const latestMsg = await prisma.chatMessage.findFirst({
      where: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(buyerUserIdStr)
      },
      orderBy: { createdAt: "desc" }
    });

    if (!latestMsg) {
      res.json(createShopeeErrorResponse("error_not_found", "Conversation not found"));
      return;
    }

    const unreadCount = await prisma.chatMessage.count({
      where: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(buyerUserIdStr),
        senderType: "BUYER",
        isRead: false
      }
    });

    res.json(createShopeeSuccessResponse({
      conversation: {
        conversation_id: conversationId,
        to_id: Number(latestMsg.buyerUserId),
        to_name: latestMsg.buyerUsername,
        to_avatar: "",
        message_type: "text",
        latest_message_content: { text: latestMsg.message },
        latest_message_from_id: latestMsg.senderType === "BUYER" ? Number(latestMsg.buyerUserId) : Number(shopIdStr),
        latest_message_id: Number(latestMsg.messageId),
        latest_message_time: Math.floor(latestMsg.createdAt.getTime() / 1000),
        unread_count: unreadCount,
        pinned: false
      }
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to get conversation"));
  }
});

// ============================================================================
// 3. GET MESSAGES: GET /api/v2/sellerchat/get_message
// ============================================================================
sellerchatRouter.get("/api/v2/sellerchat/get_message", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    const conversationId = req.query.conversation_id as string;
    const pageSize = Math.min(100, Math.max(1, Number(req.query.page_size || 50)));
    const offset = Math.max(0, Number(req.query.offset || 0));

    if (!conversationId) {
      res.json(createShopeeErrorResponse("error_param", "conversation_id is required"));
      return;
    }

    const parts = conversationId.split("_");
    const buyerUserIdStr = parts.length > 1 ? parts[1] : parts[0];

    const messages = await prisma.chatMessage.findMany({
      where: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(buyerUserIdStr)
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: pageSize
    });

    res.json(createShopeeSuccessResponse({
      messages: messages.map(m => ({
        message_id: m.messageId.toString(),
        sender_id: m.senderType === "BUYER" ? Number(m.buyerUserId) : Number(shopIdStr),
        to_id: m.senderType === "BUYER" ? Number(shopIdStr) : Number(m.buyerUserId),
        message_type: "text",
        content: { text: m.message },
        created_timestamp: Math.floor(m.createdAt.getTime() / 1000),
        is_read: m.isRead
      }))
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to get messages"));
  }
});

// ============================================================================
// 4. SEND MESSAGE: POST /api/v2/sellerchat/send_message
// ============================================================================
sellerchatRouter.post("/api/v2/sellerchat/send_message", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = (req.query.shop_id || req.body?.shop_id) as string;
    const { to_id, message_type = "text", content } = req.body || {};

    if (!to_id) {
      res.json(createShopeeErrorResponse("error_param", "to_id is required"));
      return;
    }

    const text = typeof content === "object" ? content.text : String(content || "");
    if (!text || !text.trim()) {
      res.json(createShopeeErrorResponse("error_param", "content text must not be empty"));
      return;
    }

    const created = await prisma.chatMessage.create({
      data: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(to_id),
        buyerUsername: `Shopee User ${to_id}`,
        senderType: "SELLER",
        message: text.trim()
      }
    });

    res.json(createShopeeSuccessResponse({
      message_id: created.messageId.toString(),
      to_id: Number(to_id),
      message_type,
      content: { text: created.message },
      create_time: Math.floor(created.createdAt.getTime() / 1000)
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to send message"));
  }
});

// ============================================================================
// 5. SEND AUTOREPLY MESSAGE: POST /api/v2/sellerchat/send_autoreply_message
// ============================================================================
sellerchatRouter.post("/api/v2/sellerchat/send_autoreply_message", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = (req.query.shop_id || req.body?.shop_id) as string;
    const { to_id, message_type = "text", content } = req.body || {};

    if (!to_id) {
      res.json(createShopeeErrorResponse("error_param", "to_id is required"));
      return;
    }

    const text = typeof content === "object" ? content.text : String(content || "");
    if (!text || !text.trim()) {
      res.json(createShopeeErrorResponse("error_param", "content text must not be empty"));
      return;
    }

    const created = await prisma.chatMessage.create({
      data: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(to_id),
        buyerUsername: `Shopee User ${to_id}`,
        senderType: "SELLER",
        message: text.trim()
      }
    });

    res.json(createShopeeSuccessResponse({
      message_id: created.messageId.toString(),
      to_id: Number(to_id),
      message_type,
      content: { text: created.message },
      is_auto_reply: true,
      create_time: Math.floor(created.createdAt.getTime() / 1000)
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to send autoreply message"));
  }
});

// ============================================================================
// 6. READ CONVERSATION: POST /api/v2/sellerchat/read_conversation
// ============================================================================
sellerchatRouter.post("/api/v2/sellerchat/read_conversation", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = (req.query.shop_id || req.body?.shop_id) as string;
    const { conversation_id } = req.body || {};

    if (!conversation_id) {
      res.json(createShopeeErrorResponse("error_param", "conversation_id is required"));
      return;
    }

    const parts = conversation_id.split("_");
    const buyerUserIdStr = parts.length > 1 ? parts[1] : parts[0];

    const result = await prisma.chatMessage.updateMany({
      where: {
        shopId: BigInt(shopIdStr),
        buyerUserId: BigInt(buyerUserIdStr),
        senderType: "BUYER",
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json(createShopeeSuccessResponse({
      conversation_id,
      unread_count: 0,
      marked_count: result.count
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to read conversation"));
  }
});
