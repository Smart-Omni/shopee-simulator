export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Shopee Open API v2 Simulator",
    version: "2.0.0",
    description: "High-fidelity mock server for Shopee Open API v2.0 supporting SmartOmni Channel integrations."
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Local Mock Server"
    }
  ],
  tags: [
    { name: "Public & Auth", description: "OAuth 2.0 authorization, token exchange, and refresh" },
    { name: "Shop", description: "Shop profile, settings, and vacation mode" },
    { name: "Product", description: "Product catalog, categories, attributes, and stock/price" },
    { name: "Order", description: "Order queries, cancellations, and package splitting" },
    { name: "Logistics", description: "Shipping channels, parameters, airway bills, and tracking" },
    { name: "Webhook & Push", description: "Outbound push webhooks, event delivery logs, and retry" },
    { name: "Simulator Control", description: "Direct endpoints for tests to trigger buyer actions and inject faults" }
  ],
  paths: {
    "/auth": {
      get: {
        tags: ["Public & Auth"],
        summary: "Mock Seller OAuth Consent Screen",
        description: "Renders mock Shopee seller consent page and redirects to redirect_uri with code and shop_id.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "redirect_uri", in: "query", required: true, schema: { type: "string" } },
          { name: "state", in: "query", schema: { type: "string" } },
          { name: "auto_confirm", in: "query", schema: { type: "boolean" }, description: "If true, bypasses HTML and redirects immediately" }
        ],
        responses: {
          "302": { description: "Redirect to client redirect_uri with code and shop_id" },
          "200": { description: "HTML consent screen" }
        }
      }
    },
    "/api/v2/auth/token/get": {
      post: {
        tags: ["Public & Auth"],
        summary: "Get Access Token",
        description: "Exchanges one-time authorization code for access_token and refresh_token.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code", "partner_id"],
                properties: {
                  code: { type: "string", example: "5a5477794a55537954697169514f4653" },
                  partner_id: { type: "integer", example: 1001141 },
                  shop_id: { type: "integer", example: 727720655 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Standard Shopee response envelope with access and refresh tokens",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ShopeeTokenResponse" }
              }
            }
          }
        }
      }
    },
    "/api/v2/auth/access_token/get": {
      post: {
        tags: ["Public & Auth"],
        summary: "Refresh Access Token",
        description: "Renews access_token using refresh_token with a 5-minute dual-token grace period.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refresh_token", "partner_id"],
                properties: {
                  refresh_token: { type: "string" },
                  partner_id: { type: "integer", example: 1001141 },
                  shop_id: { type: "integer", example: 727720655 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Refreshed tokens returned in standard Shopee envelope",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ShopeeTokenResponse" }
              }
            }
          }
        }
      }
    },
    "/api/v2/public/get_shops_by_partner": {
      get: {
        tags: ["Public & Auth"],
        summary: "Get Shops By Partner",
        description: "Retrieves list of all shops authorized to the given partner ID.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "page_size", in: "query", schema: { type: "integer", default: 50 } },
          { name: "page_no", in: "query", schema: { type: "integer", default: 1 } }
        ],
        responses: {
          "200": {
            description: "List of authorized shops",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ShopeeShopListResponse" }
              }
            }
          }
        }
      }
    },
    "/api/v2/shop/get_shop_info": {
      get: {
        tags: ["Shop"],
        summary: "Get Shop Information",
        description: "Fetch shop profile, regional location, vacation status, and fulfillment types.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Shop information details" }
        }
      }
    },
    "/api/v2/shop/get_profile": {
      get: {
        tags: ["Shop"],
        summary: "Get Shop Profile",
        description: "Fetch shop logo, name, and description.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Shop profile details" }
        }
      }
    },
    "/api/v2/shop/set_shop_holiday_mode": {
      post: {
        tags: ["Shop"],
        summary: "Set Shop Holiday Mode",
        description: "Toggle shop vacation / holiday mode on or off.",
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
                required: ["holiday_mode_on"],
                properties: {
                  holiday_mode_on: { type: "boolean", example: true }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Success response envelope" }
        }
      }
    },
    "/api/v2/shop/get_warehouse_detail": {
      get: {
        tags: ["Shop"],
        summary: "Get Warehouse Details",
        description: "Fetch warehouse locations and pickup addresses configured for this shop.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "List of warehouse addresses" }
        }
      }
    },
    "/api/v2/media_space/upload_image": {
      post: {
        tags: ["MediaSpace"],
        summary: "Upload Image",
        description: "Upload an image file (JPEG, PNG, max 10MB) to Shopee MediaSpace to obtain image_id and CDN URLs.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns image_id and regional CDN image URLs" }
        }
      }
    },
    "/api/v2/product/get_category": {
      get: {
        tags: ["Product"],
        summary: "Get Category Tree",
        description: "Retrieve standard Shopee category hierarchy.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "language", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns category_list" }
        }
      }
    },
    "/api/v2/product/get_attribute_tree": {
      get: {
        tags: ["Product"],
        summary: "Get Category Attribute Tree",
        description: "Retrieve mandatory and optional product attributes for specified categories.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "category_id_list", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns category attribute tree list" }
        }
      }
    },
    "/api/v2/product/get_brand_list": {
      get: {
        tags: ["Product"],
        summary: "Get Brand List",
        description: "Retrieve brand list available for a category.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "category_id", in: "query", required: true, schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "Returns brand_list" }
        }
      }
    },
    "/api/v2/product/get_item_list": {
      get: {
        tags: ["Product"],
        summary: "Get Product List",
        description: "Paginated product list filtered by status and update range.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          { name: "page_size", in: "query", schema: { type: "integer", default: 10 } },
          { name: "item_status", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns paginated item list" }
        }
      }
    },
    "/api/v2/product/get_item_base_info": {
      get: {
        tags: ["Product"],
        summary: "Get Product Base Info",
        description: "Detailed information for a list of item IDs.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "item_id_list", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns item_list array" }
        }
      }
    },
    "/api/v2/product/get_model_list": {
      get: {
        tags: ["Product"],
        summary: "Get Product Model / Variation List",
        description: "Retrieve multi-tier variations and models for an item.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "item_id", in: "query", required: true, schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "Returns tier_variation and model list" }
        }
      }
    },
    "/api/v2/product/add_item": {
      post: {
        tags: ["Product"],
        summary: "Add Item",
        description: "Create a new product listing with category and attribute validation.",
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
                required: ["item_name", "description", "category_id", "original_price", "weight", "image"],
                properties: {
                  item_name: { type: "string" },
                  description: { type: "string" },
                  category_id: { type: "integer" },
                  original_price: { type: "number" },
                  weight: { type: "number" },
                  image: { type: "object" },
                  attribute_list: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns created item details" }
        }
      }
    },
    "/api/v2/product/init_tier_variation": {
      post: {
        tags: ["Product"],
        summary: "Initialize Tier Variation Grid",
        description: "Create multi-tier variants (e.g. Color x Size) with price ratio guard.",
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
                required: ["item_id", "tier_variation", "model"],
                properties: {
                  item_id: { type: "integer" },
                  tier_variation: { type: "array" },
                  model: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns generated models and variation tiers" }
        }
      }
    },
    "/api/v2/product/update_item": {
      post: {
        tags: ["Product"],
        summary: "Update Item",
        description: "Update product attributes, title, or status.",
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
                required: ["item_id"],
                properties: {
                  item_id: { type: "integer" },
                  item_name: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns updated item_id" }
        }
      }
    },
    "/api/v2/product/update_stock": {
      post: {
        tags: ["Product"],
        summary: "Update Stock",
        description: "Atomically update seller stock per model or item.",
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
                required: ["item_id", "stock_list"],
                properties: {
                  item_id: { type: "integer" },
                  stock_list: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns success_list and failure_list" }
        }
      }
    },
    "/api/v2/product/update_price": {
      post: {
        tags: ["Product"],
        summary: "Update Price",
        description: "Update model or item prices with variation price ratio enforcement.",
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
                required: ["item_id", "price_list"],
                properties: {
                  item_id: { type: "integer" },
                  price_list: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns success_list and failure_list" }
        }
      }
    },
    "/api/v2/order/get_order_list": {
      get: {
        tags: ["Order"],
        summary: "Get Order List",
        description: "Retrieve paginated order list filtered by status and time range.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "time_range_field", in: "query", schema: { type: "string", default: "create_time" } },
          { name: "time_from", in: "query", schema: { type: "integer" } },
          { name: "time_to", in: "query", schema: { type: "integer" } },
          { name: "page_size", in: "query", schema: { type: "integer", default: 20 } },
          { name: "cursor", in: "query", schema: { type: "string", default: "0" } },
          { name: "order_status", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns order_list, more, and next_cursor" }
        }
      }
    },
    "/api/v2/order/get_order_detail": {
      get: {
        tags: ["Order"],
        summary: "Get Order Details",
        description: "Fetch comprehensive order details including line items, recipient address, and package tracking.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "order_sn_list", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns array of order details" }
        }
      }
    },
    "/api/v2/order/split_order": {
      post: {
        tags: ["Order"],
        summary: "Split Multi-Item Order",
        description: "Divide an order into multiple fulfillment packages.",
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
                required: ["order_sn", "package_list"],
                properties: {
                  order_sn: { type: "string" },
                  package_list: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns divided packages and items" }
        }
      }
    },
    "/api/v2/order/cancel_order": {
      post: {
        tags: ["Order"],
        summary: "Cancel Order (Seller)",
        description: "Seller cancels an order before shipment.",
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
                required: ["order_sn", "cancel_reason"],
                properties: {
                  order_sn: { type: "string" },
                  cancel_reason: { type: "string", example: "OUT_OF_STOCK" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns cancellation update_time" }
        }
      }
    },
    "/api/v2/order/handle_buyer_cancellation": {
      post: {
        tags: ["Order"],
        summary: "Handle Buyer Cancellation Application",
        description: "Seller approves or rejects a buyer cancellation request.",
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
                required: ["order_sn", "operation"],
                properties: {
                  order_sn: { type: "string" },
                  operation: { type: "string", enum: ["ACCEPT", "REJECT"] }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns operation result update_time" }
        }
      }
    },
    "/api/v2/logistics/get_channel_list": {
      get: {
        tags: ["Logistics"],
        summary: "Get Supported Logistics Channels",
        description: "List 3PL couriers enabled for this shop (Shopee Xpress, GHTK, Viettel Post).",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns logistics_channel_list" }
        }
      }
    },
    "/api/v2/logistics/get_shipping_parameter": {
      get: {
        tags: ["Logistics"],
        summary: "Get Shipping Parameter",
        description: "Fetch courier pickup addresses, timeslots, and dropoff branch locations.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "order_sn", in: "query", required: true, schema: { type: "string" } },
          { name: "package_number", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns pickup and dropoff options" }
        }
      }
    },
    "/api/v2/logistics/ship_order": {
      post: {
        tags: ["Logistics"],
        summary: "Ship Order (Init Logistics Booking)",
        description: "Arrange shipment, assigns tracking number, and transitions order status to PROCESSED.",
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
                required: ["order_sn"],
                properties: {
                  order_sn: { type: "string" },
                  package_number: { type: "string" },
                  pickup: { type: "object" },
                  dropoff: { type: "object" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Success response envelope" }
        }
      }
    },
    "/api/v2/logistics/get_tracking_number": {
      get: {
        tags: ["Logistics"],
        summary: "Get Tracking Number",
        description: "Retrieve assigned 3PL tracking number for a shipped order/package.",
        parameters: [
          { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
          { name: "access_token", in: "query", required: true, schema: { type: "string" } },
          { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "sign", in: "query", required: true, schema: { type: "string" } },
          { name: "order_sn", in: "query", required: true, schema: { type: "string" } },
          { name: "package_number", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returns tracking_number" }
        }
      }
    },
    "/api/v2/logistics/create_shipping_document": {
      post: {
        tags: ["Logistics"],
        summary: "Create Airway Bill (AWB) Document Job",
        description: "Triggers shipping document generation task.",
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
                required: ["order_list"],
                properties: {
                  order_list: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns generation result_list" }
        }
      }
    },
    "/api/v2/logistics/get_shipping_document_result": {
      post: {
        tags: ["Logistics"],
        summary: "Get Shipping Document Generation Status",
        description: "Poll AWB document task status (READY, PROCESSING, FAILED).",
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
                required: ["order_list"],
                properties: {
                  order_list: { type: "array" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Returns document ready statuses" }
        }
      }
    },
    "/api/v2/logistics/download_shipping_document": {
      post: {
        tags: ["Logistics"],
        summary: "Download Printable Airway Bill (AWB) PDF",
        description: "Download binary standard printable PDF Airway Bill containing barcode and addresses.",
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
                required: ["order_list"],
                properties: {
                  order_list: { type: "array" },
                  shipping_document_type: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Binary PDF stream (application/pdf)",
            content: {
              "application/pdf": {
                schema: { type: "string", format: "binary" }
              }
            }
          }
        }
      }
    },
    "/api/v2/public/set_webhook_url": {
      post: {
        tags: ["Webhook & Push"],
        summary: "Set Push Webhook URL",
        description: "Registers the partner's callback URL for outbound push notifications.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["webhook_url"],
                properties: {
                  partner_id: { type: "integer", example: 1001141 },
                  webhook_url: { type: "string", example: "http://localhost:3000/api/shopee/webhook" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Success envelope with registered webhook URL" }
        }
      }
    },
    "/api/v2/webhook/logs": {
      get: {
        tags: ["Webhook & Push"],
        summary: "Query Outbound Webhook Logs",
        description: "Retrieves sent push notifications, delivery statuses, response codes, and signatures.",
        parameters: [
          { name: "push_code", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "SUCCESS", "FAILED"] } },
          { name: "ordersn", in: "query", schema: { type: "string" } },
          { name: "shop_id", in: "query", schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "List of webhook dispatch logs" }
        }
      }
    },
    "/api/v2/webhook/retry": {
      post: {
        tags: ["Webhook & Push"],
        summary: "Trigger Webhook Retry",
        description: "Manually retries failed outbound webhook notifications.",
        responses: {
          "200": { description: "Number of successfully retried webhooks" }
        }
      }
    },
    "/api/v2/simulator/webhook/trigger": {
      post: {
        tags: ["Simulator Control"],
        summary: "Manually Trigger Webhook Event",
        description: "Simulates firing any Shopee push notification (code 1, 3, 4, 8, 15) with custom payload.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  partner_id: { type: "integer", example: 1001141 },
                  push_code: { type: "integer", example: 3 },
                  shop_id: { type: "integer", example: 727720655 },
                  ordersn: { type: "string", example: "261019A1B2C3D4" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Push dispatch status" }
        }
      }
    },
    "/api/v2/simulator/config": {
      get: {
        tags: ["Simulator Control"],
        summary: "Get Fault Injection Configuration",
        description: "Returns the active fault injection configuration.",
        responses: {
          "200": { description: "Current simulator fault injection config" }
        }
      },
      post: {
        tags: ["Simulator Control"],
        summary: "Update Fault Injection Configuration",
        description: "Updates simulator behavior: rate limits, artificial delays, and forced token/signature errors.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rateLimitEnabled: { type: "boolean" },
                  rateLimitPerMin: { type: "integer" },
                  forceExpiredToken: { type: "boolean" },
                  forceInvalidSign: { type: "boolean" },
                  artificialDelayMs: { type: "integer" },
                  strictTimestamp: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Updated simulator configuration" }
        }
      }
    }
  },
  components: {
    schemas: {
      ShopeeTokenResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "" },
          message: { type: "string", example: "" },
          request_id: { type: "string", example: "f2a678875e669fdbdb4cbc6a9a18b895" },
          response: {
            type: "object",
            properties: {
              access_token: { type: "string", example: "6b5a46716e474d6f6e59777659459849" },
              refresh_token: { type: "string", example: "4c7259534969484e71734d695a6e0d55" },
              expire_in: { type: "integer", example: 14400 },
              shop_id_list: { type: "array", items: { type: "integer" } }
            }
          }
        }
      },
      ShopeeShopListResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "" },
          message: { type: "string", example: "" },
          request_id: { type: "string", example: "e932b1f8d48a47ca8cf982b6b0" },
          response: {
            type: "object",
            properties: {
              authed_shops: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    shop_id: { type: "integer" },
                    shop_name: { type: "string" },
                    region: { type: "string" },
                    status: { type: "string" },
                    auth_time: { type: "integer" },
                    expire_time: { type: "integer" }
                  }
                }
              },
              more: { type: "boolean" },
              page_no: { type: "integer" },
              page_size: { type: "integer" }
            }
          }
        }
      }
    }
  }
};
