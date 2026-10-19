export const reviewAndLogisticsSwaggerPaths: Record<string, any> = {
  "/api/v2/logistics/calculate_shipping_fee": {
    post: {
      tags: ["Logistics"],
      summary: "Calculate Shipping Fee",
      description: "Calculates shipping fee quotes across SPX Express Standard, SPX Instant, and SPX Economy using chargeable weight formulas, Vietnam geographic routing zones, and Freeship Xtra subsidy thresholds.",
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
              required: ["recipient_city"],
              properties: {
                recipient_city: { type: "string", example: "Hà Nội" },
                recipient_district: { type: "string", example: "Ba Đình" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item_id"],
                    properties: {
                      item_id: { type: "integer", example: 14 },
                      model_id: { type: "integer", example: 101 },
                      quantity: { type: "integer", example: 2 }
                    }
                  }
                },
                total_weight_kg: { type: "number", example: 1.2 },
                dimensions: {
                  type: "object",
                  properties: {
                    length: { type: "number", example: 20 },
                    width: { type: "number", example: 15 },
                    height: { type: "number", example: 10 }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Carrier rate options and Freeship subsidy breakdown",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  response: {
                    type: "object",
                    properties: {
                      chargeable_weight_gram: { type: "integer", example: 1200 },
                      zone: { type: "string", example: "INTER_REGION" },
                      channels: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            channel_id: { type: "integer" },
                            channel_name: { type: "string" },
                            enabled: { type: "boolean" },
                            estimated_shipping_fee: { type: "number" },
                            shopee_shipping_rebate: { type: "number" },
                            buyer_paid_shipping_fee: { type: "number" },
                            disabled_reason: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/v2/product/unlist_item": {
    post: {
      tags: ["Product"],
      summary: "Unlist or Relist Item",
      description: "Batch updates product listing status between NORMAL and UNLIST. Unlisted items are hidden from buyers but visible to sellers.",
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
              required: ["item_list"],
              properties: {
                item_list: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item_id", "unlist"],
                    properties: {
                      item_id: { type: "integer", example: 14 },
                      unlist: { type: "boolean", example: true }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Batch unlist operation results",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  response: {
                    type: "object",
                    properties: {
                      success_list: { type: "array", items: { type: "object" } },
                      failure_list: { type: "array", items: { type: "object" } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/v2/product/get_comment": {
    get: {
      tags: ["Reviews"],
      summary: "Get Product Comments and Reviews",
      description: "Retrieves customer ratings and reviews for products in the merchant shop.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "item_id", in: "query", schema: { type: "integer" } },
        { name: "comment_id", in: "query", schema: { type: "integer" } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 20 } }
      ],
      responses: {
        "200": {
          description: "List of item reviews",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  response: {
                    type: "object",
                    properties: {
                      item_comment_list: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            comment_id: { type: "integer" },
                            item_id: { type: "integer" },
                            model_id: { type: "integer" },
                            buyer_username: { type: "string" },
                            rating_star: { type: "integer" },
                            comment: { type: "string" },
                            comment_reply: {
                              type: "object",
                              properties: {
                                reply: { type: "string" },
                                reply_time: { type: "integer" }
                              }
                            }
                          }
                        }
                      },
                      more: { type: "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/v2/product/reply_comment": {
    post: {
      tags: ["Reviews"],
      summary: "Reply to Customer Review",
      description: "Official endpoint allowing sellers to reply to customer comments. Enforces duplicate reply prevention.",
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
              required: ["comment_list"],
              properties: {
                comment_list: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["comment_id", "comment"],
                    properties: {
                      comment_id: { type: "integer", example: 12 },
                      comment: { type: "string", example: "Thank you for shopping with us!" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Batch reply results",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  response: {
                    type: "object",
                    properties: {
                      result_list: { type: "array", items: { type: "object" } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/v2/webhook/logs/clear": {
    delete: {
      tags: ["Webhook & Push"],
      summary: "Clear Webhook Logs",
      description: "Purges all recorded outbound push webhook dispatch event logs.",
      responses: {
        "200": {
          description: "Number of deleted log events",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  response: {
                    type: "object",
                    properties: {
                      deleted_count: { type: "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
