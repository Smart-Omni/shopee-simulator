export const chatSwaggerPaths: Record<string, any> = {
  // =========================================================================
  // Official Shopee Seller Chat Partner APIs (Layer A - HMAC Guarded)
  // =========================================================================
  "/api/v2/sellerchat/get_conversation_list": {
    get: {
      tags: ["Live Chat"],
      summary: "Get Conversation List (Official)",
      description: "Retrieves a paginated list of conversations for the shop. Requires HMAC signature.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 20 } },
        { name: "type", in: "query", schema: { type: "integer", enum: [1, 2, 3], default: 1 }, description: "1: all, 2: unread, 3: pinned" }
      ],
      responses: {
        "200": {
          description: "Paginated conversation summaries with unread counts and latest message"
        }
      }
    }
  },
  "/api/v2/sellerchat/get_one_conversation": {
    get: {
      tags: ["Live Chat"],
      summary: "Get One Conversation (Official)",
      description: "Retrieves metadata and latest status for a single conversation thread.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "conversation_id", in: "query", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": { description: "Conversation metadata and unread count" }
      }
    }
  },
  "/api/v2/sellerchat/get_message": {
    get: {
      tags: ["Live Chat"],
      summary: "Get Message List (Official)",
      description: "Retrieves message history for a specific conversation thread.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "conversation_id", in: "query", required: true, schema: { type: "string" } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 50 } },
        { name: "offset", in: "query", schema: { type: "integer", default: 0 } }
      ],
      responses: {
        "200": { description: "List of messages in the conversation" }
      }
    }
  },
  "/api/v2/sellerchat/send_message": {
    post: {
      tags: ["Live Chat"],
      summary: "Send Message (Official)",
      description: "Sends a live message from the seller to the buyer.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["to_id", "content"],
              properties: {
                to_id: { type: "integer", description: "Buyer user ID", example: 1001 },
                message_type: { type: "string", default: "text", example: "text" },
                content: {
                  type: "object",
                  properties: {
                    text: { type: "string", example: "Chào bạn, sản phẩm này hiện đang có sẵn ạ!" }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Message sent confirmation with message_id" }
      }
    }
  },
  "/api/v2/sellerchat/send_autoreply_message": {
    post: {
      tags: ["Live Chat"],
      summary: "Send Auto-Reply Message (Official)",
      description: "Sends an automated reply from the seller flagged with is_auto_reply: true.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["to_id", "content"],
              properties: {
                to_id: { type: "integer", example: 1001 },
                message_type: { type: "string", default: "text" },
                content: {
                  type: "object",
                  properties: {
                    text: { type: "string", example: "Cảm ơn bạn đã nhắn tin cho Shop. Chúng mình sẽ phản hồi sớm nhất nhé!" }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Automated message sent confirmation" }
      }
    }
  },
  "/api/v2/sellerchat/read_conversation": {
    post: {
      tags: ["Live Chat"],
      summary: "Read Conversation (Official)",
      description: "Marks all buyer messages in the conversation as read and resets unread count.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["conversation_id"],
              properties: {
                conversation_id: { type: "string", example: "727720655_1001" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Conversation read confirmation" }
      }
    }
  },

  // =========================================================================
  // Simulator Chat Management & Automation (Layer B)
  // =========================================================================
  "/api/v2/simulator/chat/performance": {
    get: {
      tags: ["Live Chat"],
      summary: "Chat Operational Performance Metrics",
      description: "Retrieves 30-day chat performance metrics: total chats, period comparison, response rate %, and response time.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" }, example: 727720655 }
      ],
      responses: {
        "200": { description: "Chat performance metrics object" }
      }
    }
  },
  "/api/v2/simulator/chat/auto_reply": {
    get: {
      tags: ["Live Chat"],
      summary: "Get Auto-Reply Settings",
      description: "Returns shop standard greeting and off-work auto-reply configurations.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" }, example: 727720655 }
      ],
      responses: {
        "200": { description: "Auto-reply toggle and message templates" }
      }
    },
    post: {
      tags: ["Live Chat"],
      summary: "Update Auto-Reply Settings",
      description: "Updates standard auto-reply message and enabled state with 24-hour rate limit.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id"],
              properties: {
                shop_id: { type: "integer", example: 727720655 },
                standard_enabled: { type: "boolean" },
                standard_message: { type: "string" },
                off_work_enabled: { type: "boolean" },
                off_work_message: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated auto-reply settings" }
      }
    }
  },
  "/api/v2/simulator/chat/quick_reply": {
    get: {
      tags: ["Live Chat"],
      summary: "Get Quick Reply Settings & Message Groups",
      description: "Returns quick message visibility settings and up to 25 message groups.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" }, example: 727720655 }
      ],
      responses: {
        "200": { description: "Quick reply groups with seeded message lists" }
      }
    },
    post: {
      tags: ["Live Chat"],
      summary: "Update Quick Reply Settings & Groups",
      description: "Updates quick reply visibility toggle and message group collections (up to 25 groups).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id"],
              properties: {
                shop_id: { type: "integer", example: 727720655 },
                show_suggestions: { type: "boolean" },
                groups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      messages: { type: "array", items: { type: "string" } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated quick reply groups" }
      }
    }
  }
};
