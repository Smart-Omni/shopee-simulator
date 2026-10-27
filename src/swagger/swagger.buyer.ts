export const buyerSwaggerPaths: Record<string, any> = {
  // =========================================================================
  // Buyer Authentication & Profile
  // =========================================================================
  "/api/v2/simulator/auth/login": {
    post: {
      tags: ["Public & Auth"],
      summary: "Buyer & Seller Fast Login",
      description: "Authenticates buyer or seller credentials and returns user profile with JWT/session token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "demo" },
                password: { type: "string", example: "Shopiz@123" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "User session and role info" }
      }
    }
  },
  "/api/v2/simulator/auth/register": {
    post: {
      tags: ["Public & Auth"],
      summary: "Register New Customer Account",
      description: "Registers a new buyer account with encrypted password storage.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "newuser123" },
                password: { type: "string", example: "SecurePass@123" },
                name: { type: "string", example: "New Customer" },
                email: { type: "string", example: "user@example.com" },
                phone: { type: "string", example: "0901234567" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Registered account details" }
      }
    }
  },
  "/api/v2/simulator/auth/forgot_password": {
    post: {
      tags: ["Public & Auth"],
      summary: "Reset Account Password",
      description: "Simulates password reset flow with new credential update.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "new_password"],
              properties: {
                username: { type: "string" },
                new_password: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Password reset confirmation" }
      }
    }
  },
  "/api/v2/simulator/buyer/profile": {
    get: {
      tags: ["Shop"],
      summary: "Get Buyer Profile",
      description: "Retrieves buyer user details, phone, addresses, and avatar.",
      parameters: [
        { name: "buyer_user_id", in: "query", schema: { type: "integer", default: 1001 } }
      ],
      responses: {
        "200": { description: "Buyer user profile object" }
      }
    },
    put: {
      tags: ["Shop"],
      summary: "Update Buyer Profile",
      description: "Updates buyer profile name, email, phone, or avatar.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                buyer_user_id: { type: "integer", default: 1001 },
                name: { type: "string" },
                phone: { type: "string" },
                avatar_url: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated profile object" }
      }
    }
  },

  // =========================================================================
  // Shipping Address Management
  // =========================================================================
  "/api/v2/simulator/buyer/addresses": {
    get: {
      tags: ["Shop"],
      summary: "List Buyer Shipping Addresses",
      description: "Retrieves all saved shipping addresses for the buyer.",
      parameters: [
        { name: "buyer_user_id", in: "query", schema: { type: "integer", default: 1001 } }
      ],
      responses: {
        "200": { description: "Array of saved delivery addresses" }
      }
    },
    post: {
      tags: ["Shop"],
      summary: "Add New Shipping Address",
      description: "Adds a new address to the buyer address book.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["recipient_name", "phone", "full_address", "province"],
              properties: {
                buyer_user_id: { type: "integer", default: 1001 },
                recipient_name: { type: "string" },
                phone: { type: "string" },
                province: { type: "string" },
                district: { type: "string" },
                ward: { type: "string" },
                street_address: { type: "string" },
                full_address: { type: "string" },
                is_default: { type: "boolean" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Created address object" }
      }
    }
  },
  "/api/v2/simulator/buyer/addresses/{id}": {
    put: {
      tags: ["Shop"],
      summary: "Update Shipping Address",
      description: "Updates an existing shipping address.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                recipient_name: { type: "string" },
                phone: { type: "string" },
                full_address: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated address object" }
      }
    },
    delete: {
      tags: ["Shop"],
      summary: "Delete Shipping Address",
      description: "Removes an address from the buyer address book.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Address deletion confirmation" }
      }
    }
  },
  "/api/v2/simulator/buyer/addresses/{id}/set_default": {
    post: {
      tags: ["Shop"],
      summary: "Set Default Shipping Address",
      description: "Marks the target address as the primary default shipping address.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Updated default address confirmation" }
      }
    }
  },

  // =========================================================================
  // Catalog & Product Storefront
  // =========================================================================
  "/api/v2/simulator/categories": {
    get: {
      tags: ["Product"],
      summary: "Category Hierarchy Tree",
      description: "Returns the 3-level Shopee category hierarchy (Level 1 Root, Level 2 Subcategory, Level 3 Leaf).",
      responses: {
        "200": { description: "Structured category tree array" }
      }
    }
  },
  "/api/v2/simulator/product-creation/config": {
    get: {
      tags: ["Product"],
      summary: "Product Creation Form Configuration",
      description: "Returns metadata for category selection, attribute requirements, and logistics channels.",
      parameters: [
        { name: "shop_id", in: "query", schema: { type: "integer", default: 727720655 } }
      ],
      responses: {
        "200": { description: "Configuration metadata for creating products" }
      }
    }
  },
  "/api/v2/simulator/product/detail": {
    get: {
      tags: ["Product"],
      summary: "Public Product Details with Variations",
      description: "Returns detailed product information, models, tier variations, and pricing.",
      parameters: [
        { name: "item_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Product detail object" }
      }
    }
  },
  "/api/v2/simulator/product/update": {
    post: {
      tags: ["Product"],
      summary: "Update Product Details",
      description: "Updates an existing product item, description, images, or variation prices.",
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
                description: { type: "string" },
                price: { type: "number" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated product object" }
      }
    }
  },
  "/api/v2/simulator/product/delete": {
    post: {
      tags: ["Product"],
      summary: "Soft Delete Product Item",
      description: "Marks a product item as SELLER_DELETE.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["item_id"],
              properties: {
                item_id: { type: "integer" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Product deletion confirmation" }
      }
    }
  },
  "/api/v2/simulator/product/view": {
    post: {
      tags: ["Product"],
      summary: "Increment Product Page View",
      description: "Increments the view count for a product item.",
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
      responses: {
        "200": { description: "Incremented view count" }
      }
    }
  },
  "/api/v2/simulator/product/like": {
    get: {
      tags: ["Product"],
      summary: "Check Product Like Status",
      description: "Checks if a buyer has liked a product item.",
      parameters: [
        { name: "item_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "buyer_user_id", in: "query", schema: { type: "integer", default: 1001 } }
      ],
      responses: {
        "200": { description: "Like status boolean" }
      }
    },
    post: {
      tags: ["Product"],
      summary: "Toggle Product Like",
      description: "Likes or unlikes a product item for the buyer.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["item_id"],
              properties: {
                item_id: { type: "integer" },
                buyer_user_id: { type: "integer", default: 1001 }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated like state and count" }
      }
    }
  },

  // =========================================================================
  // Logistics Channels & Multi-Shop Checkout
  // =========================================================================
  "/api/v2/simulator/logistics/channels": {
    get: {
      tags: ["Logistics"],
      summary: "Available Shipping Channels",
      description: "Returns available delivery channels (SPX Express, SPX Instant, SPX Economy) with calculated fees.",
      parameters: [
        { name: "shop_id", in: "query", schema: { type: "integer" } },
        { name: "weight", in: "query", schema: { type: "number", default: 500 } },
        { name: "destination_province", in: "query", schema: { type: "string" } }
      ],
      responses: {
        "200": { description: "List of shipping channels with estimated fees" }
      }
    }
  },
  "/api/v2/simulator/order/batch_checkout": {
    post: {
      tags: ["Order"],
      summary: "Atomic Multi-Shop Cart Batch Checkout",
      description: "Checks out a basket containing items from one or multiple shops, auto-splitting into distinct orders.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["buyer_user_id", "items", "shipping_address"],
              properties: {
                buyer_user_id: { type: "integer", default: 1001 },
                payment_method: { type: "string", default: "ShopeePay" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item_id", "quantity", "shop_id"],
                    properties: {
                      item_id: { type: "integer" },
                      model_id: { type: "integer" },
                      quantity: { type: "integer" },
                      shop_id: { type: "integer" }
                    }
                  }
                },
                shipping_address: { type: "object" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Created order records per shop with order_sn list" }
      }
    }
  },
  "/api/v2/simulator/order/confirm_delivery": {
    post: {
      tags: ["Order"],
      summary: "Buyer Confirms Delivery (Releases Escrow)",
      description: "Buyer marks order as received. Transitions status to COMPLETED and releases escrow to seller balance.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_sn"],
              properties: {
                order_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Order completion confirmation and released escrow amount" }
      }
    }
  },

  // =========================================================================
  // Shop & Seller Analytics
  // =========================================================================
  "/api/v2/simulator/shop/detail": {
    get: {
      tags: ["Shop"],
      summary: "Public Shop Storefront Profile",
      description: "Retrieves public shop profile, rating, products count, and active banners.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Public storefront details" }
      }
    }
  },
  "/api/v2/simulator/seller/analytics": {
    get: {
      tags: ["Simulator Control"],
      summary: "Seller Center Live Business Analytics",
      description: "Returns GMV, conversion rates, order counts, and trend metrics for Seller Center dashboard.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Analytics KPIs and SVG chart series data" }
      }
    }
  },
  "/api/v2/simulator/payment/overview": {
    get: {
      tags: ["Payment & Escrow"],
      summary: "Simulator Financial Escrow Overview",
      description: "Simplified escrow ledger query for UI displaying released payouts, pending funds, and platform fees.",
      parameters: [
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Financial breakdown and itemized escrow ledger" }
      }
    }
  },
  "/api/v2/simulator/payment/escrow_detail": {
    get: {
      tags: ["Payment & Escrow"],
      summary: "Simulator Order Settlement Detail",
      description: "Returns line-item accounting breakdown for a specific order without requiring HMAC signature.",
      parameters: [
        { name: "order_sn", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": { description: "Order settlement accounting details" }
      }
    }
  },

  // =========================================================================
  // Media Storage Uploads
  // =========================================================================
  "/api/v2/simulator/media/upload": {
    post: {
      tags: ["Simulator Control"],
      summary: "Upload Photo or Video to Storage Provider",
      description: "Uploads a photo (up to 10MB) or video (up to 50MB) to Google Drive or local storage.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Uploaded file URL, file_id, and mime_type" }
      }
    }
  },
  "/api/v2/simulator/media/upload_multiple": {
    post: {
      tags: ["Simulator Control"],
      summary: "Batch Upload Multiple Files",
      description: "Uploads up to 10 photos/videos simultaneously.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["files"],
              properties: {
                files: { type: "array", items: { type: "string", format: "binary" } }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Array of uploaded file objects" }
      }
    }
  }
};
