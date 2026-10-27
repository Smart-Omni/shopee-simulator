export const simulatorSwaggerPaths: Record<string, any> = {
  "/api/v2/simulator/shops": {
    get: {
      tags: ["Simulator Control"],
      summary: "List Seeded Shops",
      description: "Returns all seeded merchant stores available in the simulator.",
      responses: { "200": { description: "Array of shop objects" } }
    }
  },
  "/api/v2/simulator/buyers": {
    get: {
      tags: ["Simulator Control"],
      summary: "List Seeded Buyers",
      description: "Returns all seeded buyer customer personas with addresses and profile details.",
      responses: { "200": { description: "Array of buyer objects" } }
    }
  },
  "/api/v2/simulator/shop/overview": {
    get: {
      tags: ["Simulator Control"],
      summary: "Shop Overview & Token Remaining Time",
      parameters: [{ name: "shop_id", in: "query", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Shop overview data" } }
    }
  },
  "/api/v2/simulator/shop/vacation": {
    post: {
      tags: ["Simulator Control"],
      summary: "Toggle Vacation Mode",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "is_vacation"],
              properties: {
                shop_id: { type: "integer" },
                is_vacation: { type: "boolean" }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Updated vacation mode state" } }
    }
  },
  "/api/v2/simulator/shop/refresh_token": {
    post: {
      tags: ["Simulator Control"],
      summary: "Fast Refresh Shop Token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id"],
              properties: { shop_id: { type: "integer" } }
            }
          }
        }
      },
      responses: { "200": { description: "Issued fresh access_token with 4h validity" } }
    }
  },
  "/api/v2/simulator/products": {
    get: {
      tags: ["Simulator Control"],
      summary: "Simulator Catalog Query",
      description: "Retrieves products for a shop. Passing view_mode=buyer hides unlisted items.",
      parameters: [
        { name: "shop_id", in: "query", schema: { type: "integer" } },
        { name: "view_mode", in: "query", schema: { type: "string", enum: ["buyer", "seller"] } }
      ],
      responses: { "200": { description: "Catalog product list" } }
    }
  },
  "/api/v2/simulator/product/extra_info": {
    get: {
      tags: ["Simulator Control"],
      summary: "Get Shopiz Product Metrics",
      description: "Shop-safe metrics integration for Shopiz. Accepts 1–50 item IDs and returns the same sales, views, likes, and review metrics as the signed Shopee endpoint.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "item_id_list", in: "query", required: true, description: "Comma-separated IDs; maximum 50", schema: { type: "string" } }
      ],
      responses: { "200": { description: "Returns item_list metrics" } }
    }
  },
  "/api/v2/simulator/product/create": {
    post: {
      tags: ["Simulator Control"],
      summary: "Quick Create Product",
      description: "Creates a product with optional 2-tier variation options (Color + Size).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "item_name", "price"],
              properties: {
                shop_id: { type: "integer" },
                item_name: { type: "string" },
                price: { type: "number" },
                seller_stock: { type: "integer" },
                tier_variation: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Created product" } }
    }
  },
  "/api/v2/simulator/product/quick_update_stock": {
    post: {
      tags: ["Simulator Control"],
      summary: "Quick Update Stock",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["item_id", "seller_stock"],
              properties: {
                item_id: { type: "integer" },
                model_id: { type: "integer" },
                seller_stock: { type: "integer" }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Updated stock response" } }
    }
  },
  "/api/v2/simulator/product/toggle_unlist": {
    post: {
      tags: ["Simulator Control"],
      summary: "Toggle Product Unlist Status",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["item_id"],
              properties: { item_id: { type: "integer" } }
            }
          }
        }
      },
      responses: { "200": { description: "Toggled status response" } }
    }
  },
  "/api/v2/simulator/orders": {
    get: {
      tags: ["Simulator Control"],
      summary: "Query Orders for Simulator UI",
      description: "Returns order history filtered by shop_id, buyer_id, or status.",
      parameters: [
        { name: "shop_id", in: "query", schema: { type: "string" } },
        { name: "buyer_id", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string" } }
      ],
      responses: { "200": { description: "List of orders with items, SLA deadlines, and reviews" } }
    }
  },
  "/api/v2/simulator/order/create": {
    post: {
      tags: ["Simulator Control"],
      summary: "Buyer Order Checkout Engine",
      description: "Places an order, applying promotional item discounts, shop vouchers, carrier rates, and Freeship subsidies.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id"],
              properties: {
                shop_id: { type: "integer" },
                buyer_user_id: { type: "integer" },
                channel_id: { type: "integer" },
                voucher_code: { type: "string" },
                items: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Created order object" } }
    }
  },
  "/api/v2/simulator/order/detail": {
    get: {
      tags: ["Simulator Control"],
      summary: "Get Order Detail Modal Data",
      parameters: [{ name: "order_sn", in: "query", required: true, schema: { type: "string" } }],
      responses: { "200": { description: "Detailed order with timeline" } }
    }
  },
  "/api/v2/simulator/order/pay": {
    post: {
      tags: ["Simulator Control"],
      summary: "Buyer Pay Order",
      description: "Transitions order from UNPAID to READY_TO_SHIP and sets 48h SLA deadline.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Paid order status" } }
    }
  },
  "/api/v2/simulator/order/ship": {
    post: {
      tags: ["Simulator Control"],
      summary: "Seller Arrange Shipment",
      description: "Transitions order from READY_TO_SHIP to PROCESSED and generates tracking number.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Arranged order with tracking number" } }
    }
  },
  "/api/v2/simulator/order/generate_awb": {
    post: {
      tags: ["Simulator Control"],
      summary: "Generate Airway Bill (AWB)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Generated AWB response" } }
    }
  },
  "/api/v2/simulator/order/download_awb": {
    get: {
      tags: ["Simulator Control"],
      summary: "Download AWB Thermal PDF",
      parameters: [{ name: "order_sn", in: "query", required: true, schema: { type: "string" } }],
      responses: { "200": { description: "Thermal PDF binary", content: { "application/pdf": {} } } }
    }
  },
  "/api/v2/simulator/order/carrier_pickup": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulate Courier 3PL Package Pickup",
      description: "Transitions order from PROCESSED to SHIPPED and fires Push Webhook Code 3.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Shipped status confirmation" } }
    }
  },
  "/api/v2/simulator/order/deliver": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulate Courier Delivery / Buyer Confirm Received",
      description: "Transitions order from SHIPPED to COMPLETED.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Delivered status confirmation" } }
    }
  },
  "/api/v2/simulator/order/expire_overdue": {
    post: {
      tags: ["Simulator Control"],
      summary: "Trigger SLA Overdue Auto-Cancellation Worker",
      description: "Scans for READY_TO_SHIP orders past shipByDate and auto-cancels them with cancel_by: SYSTEM.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { shop_id: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Count of cancelled orders" } }
    }
  },
  "/api/v2/simulator/order/buyer_cancel": {
    post: {
      tags: ["Simulator Control"],
      summary: "Buyer Instant Cancellation",
      description: "Instant cancellation allowed during UNPAID or early READY_TO_SHIP before shipment arrangement.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Cancelled order confirmation" } }
    }
  },
  "/api/v2/simulator/order/buyer_request_cancel": {
    post: {
      tags: ["Simulator Control"],
      summary: "Buyer Request Cancellation",
      description: "Sends cancellation request requiring seller approval (order enters IN_CANCEL).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: { order_sn: { type: "string" } }
            }
          }
        }
      },
      responses: { "200": { description: "Cancellation requested confirmation" } }
    }
  },
  "/api/v2/simulator/order/handle_cancellation": {
    post: {
      tags: ["Simulator Control"],
      summary: "Seller Handle Cancellation Request",
      description: "Accepts or rejects buyer cancellation request.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn", "operation"],
              properties: {
                order_sn: { type: "string" },
                operation: { type: "string", enum: ["ACCEPT", "REJECT"] }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Handled cancellation confirmation" } }
    }
  },
  "/api/v2/simulator/logistics/calculate_fee": {
    post: {
      tags: ["Simulator Control"],
      summary: "Public Logistics Fee Calculation Helper",
      description: "Calculates carrier rates and Freeship discounts without HMAC for browser cart checkout.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "recipient_city"],
              properties: {
                shop_id: { type: "integer" },
                recipient_city: { type: "string" },
                items: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Carrier quote options" } }
    }
  },
  "/api/v2/simulator/promotions": {
    get: {
      tags: ["Simulator Control"],
      summary: "Get Active Promotions for Shop",
      parameters: [{ name: "shop_id", in: "query", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Active discounts and vouchers" } }
    }
  },
  "/api/v2/simulator/discount/create": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulator Create Discount Helper",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "discount_name", "start_time", "end_time", "items"],
              properties: {
                shop_id: { type: "integer" },
                discount_name: { type: "string" },
                start_time: { type: "string" },
                end_time: { type: "string" },
                items: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Created discount confirmation" } }
    }
  },
  "/api/v2/simulator/discount/end": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulator End Discount Helper",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["discount_id"],
              properties: { discount_id: { type: "integer" } }
            }
          }
        }
      },
      responses: { "200": { description: "Terminated discount confirmation" } }
    }
  },
  "/api/v2/simulator/discount/delete": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulator Delete Discount Helper",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["discount_id"],
              properties: { discount_id: { type: "integer" } }
            }
          }
        }
      },
      responses: { "200": { description: "Deleted discount confirmation" } }
    }
  },
  "/api/v2/simulator/voucher/create": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulator Create Voucher Helper",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "voucher_name", "voucher_code", "reward_type", "min_basket_price", "start_time", "end_time"],
              properties: {
                shop_id: { type: "integer" },
                voucher_name: { type: "string" },
                voucher_code: { type: "string" },
                reward_type: { type: "integer" },
                discount_amount: { type: "number" },
                percentage: { type: "integer" },
                min_basket_price: { type: "number" },
                usage_quantity: { type: "integer" },
                start_time: { type: "string" },
                end_time: { type: "string" }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Created voucher confirmation" } }
    }
  },
  "/api/v2/simulator/voucher/end": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulator End Voucher Helper",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["voucher_id"],
              properties: { voucher_id: { type: "integer" } }
            }
          }
        }
      },
      responses: { "200": { description: "Terminated voucher confirmation" } }
    }
  },
  "/api/v2/simulator/voucher/delete": {
    post: {
      tags: ["Simulator Control"],
      summary: "Simulator Delete Voucher Helper",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["voucher_id"],
              properties: { voucher_id: { type: "integer" } }
            }
          }
        }
      },
      responses: { "200": { description: "Deleted voucher confirmation" } }
    }
  },
  "/api/v2/simulator/review/create": {
    post: {
      tags: ["Reviews"],
      summary: "Submit Post-Order Product Review",
      description: "Submits customer review with 1-5 star rating on COMPLETED orders. Enforces duplicate review rejection.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn", "item_id"],
              properties: {
                order_sn: { type: "string" },
                item_id: { type: "integer" },
                model_id: { type: "integer" },
                rating_star: { type: "integer", minimum: 1, maximum: 5 },
                comment: { type: "string" },
                buyer_username: { type: "string" },
                buyer_user_id: { type: "integer" }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Created review confirmation with recalculated store rating" } }
    }
  },
  "/api/v2/simulator/reviews": {
    get: {
      tags: ["Reviews"],
      summary: "List Paginated Store Reviews",
      description: "Shop-scoped review list with status, star, search and date filters. Cursor is an offset in this simulator helper.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "page_size", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
        { name: "cursor", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
        { name: "status", in: "query", schema: { type: "string", enum: ["ALL", "NEED_REPLY", "REPLIED"] } },
        { name: "rating_star_list", in: "query", schema: { type: "string", example: "1,2,5" } },
        { name: "keyword", in: "query", schema: { type: "string", description: "Search product name, order SN, or buyer username" } },
        { name: "date_from", in: "query", schema: { type: "string", format: "date-time" } },
        { name: "date_to", in: "query", schema: { type: "string", format: "date-time" } }
      ],
      responses: { "200": { description: "Paginated review list and filtered status/star counts" } }
    }
  },
  "/api/v2/simulator/reviews/summary": {
    get: {
      tags: ["Reviews"],
      summary: "Get Shop Review Dashboard Summary",
      description: "Returns shop rating and 30-day/current-versus-previous review metrics, negative unanswered reviews, and reviews since last visit.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "last_visit_at", in: "query", schema: { type: "integer", description: "Unix timestamp in seconds" } }
      ],
      responses: { "200": { description: "Review dashboard metrics for the selected shop" } }
    }
  },
  "/api/v2/simulator/review/reply": {
    post: {
      tags: ["Reviews"],
      summary: "Simulator Seller Reply to Shop Review",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "comment_id", "reply"],
              properties: {
                shop_id: { type: "integer" },
                comment_id: { type: "integer" },
                reply: { type: "string" }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Reply confirmation" } }
    }
  },
  "/api/v2/simulator/chat/send": {
    post: {
      tags: ["Live Chat"],
      summary: "Send In-App Chat Message",
      description: "Sends a real-time message from Buyer to Seller or vice-versa.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "buyer_user_id", "sender_type", "message"],
              properties: {
                shop_id: { type: "integer" },
                buyer_user_id: { type: "integer" },
                buyer_username: { type: "string" },
                sender_type: { type: "string", enum: ["BUYER", "SELLER"] },
                message: { type: "string" },
                order_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Sent message object" } }
    }
  },
  "/api/v2/simulator/chat/messages": {
    get: {
      tags: ["Live Chat"],
      summary: "Get Chat Conversation History",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "buyer_user_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: { "200": { description: "Chronological message history" } }
    }
  },
  "/api/v2/simulator/chat/conversations": {
    get: {
      tags: ["Live Chat"],
      summary: "Get Shop Conversation Threads",
      parameters: [{ name: "shop_id", in: "query", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Array of conversation threads with unread counts" } }
    }
  },
  "/api/v2/simulator/chat/mark_read": {
    post: {
      tags: ["Live Chat"],
      summary: "Mark Chat Messages as Read",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shop_id", "buyer_user_id"],
              properties: {
                shop_id: { type: "integer" },
                buyer_user_id: { type: "integer" },
                reader_type: { type: "string", enum: ["BUYER", "SELLER"] }
              }
            }
          }
        }
      },
      responses: { "200": { description: "Marked read count" } }
    }
  },
  "/api/v2/simulator/webhook/sink": {
    post: {
      tags: ["Simulator Control"],
      summary: "Local Webhook Sink Receiver",
      description: "Default built-in endpoint that receives and logs dispatched simulator push webhooks.",
      requestBody: {
        content: {
          "application/json": { schema: { type: "object" } }
        }
      },
      responses: { "200": { description: "Webhook received acknowledgment" } }
    }
  }
};
