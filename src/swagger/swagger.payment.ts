export const paymentSwaggerPaths: Record<string, any> = {
  "/api/v2/payment/get_escrow_detail": {
    post: {
      tags: ["Payment & Escrow"],
      summary: "Get Order Escrow Detail",
      description: "Fetches itemized accounting breakdown for an order, including cost of goods sold, shipping fees, vouchers, platform commission fee (2%), service fee (1.5%), payment transaction fee (2.5%), and final net escrow payout.",
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
                order_sn: { type: "string", example: "261019A1B2C3D4" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Itemized escrow income breakdown",
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
                      order_sn: { type: "string", example: "261019A1B2C3D4" },
                      buyer_user_name: { type: "string", example: "nguyen_van_a" },
                      return_order_sn_list: { type: "array", items: { type: "string" } },
                      order_income: {
                        type: "object",
                        properties: {
                          escrow_amount: { type: "number", example: 235500 },
                          buyer_total_amount: { type: "number", example: 265000 },
                          cost_of_goods_sold: { type: "number", example: 250000 },
                          commission_fee: { type: "number", example: 5000 },
                          service_fee: { type: "number", example: 3750 },
                          seller_transaction_fee: { type: "number", example: 6625 }
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
  "/api/v2/payment/get_escrow_detail_batch": {
    post: {
      tags: ["Payment & Escrow"],
      summary: "Get Order Escrow Detail Batch",
      description: "Batch query of order escrow income details for up to 50 orders at a time.",
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
              required: ["order_sn_list"],
              properties: {
                order_sn_list: {
                  type: "array",
                  items: { type: "string" },
                  example: ["261019A1B2C3D4", "261019E5F6G7H8"]
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "List of order escrow details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  response: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        escrow_detail: { type: "object" }
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
  "/api/v2/payment/get_escrow_list": {
    get: {
      tags: ["Payment & Escrow"],
      summary: "Get Released Escrow Orders List",
      description: "Retrieves list of completed orders whose escrow has been released to the seller within a timestamp window.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "release_time_from", in: "query", required: true, schema: { type: "integer" } },
        { name: "release_time_to", in: "query", required: true, schema: { type: "integer" } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 40 } },
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } }
      ],
      responses: {
        "200": {
          description: "List of orders with released escrow payout",
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
                      more: { type: "boolean", example: false },
                      escrow_list: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            order_sn: { type: "string", example: "261019A1B2C3D4" },
                            payout_amount: { type: "number", example: 235500 },
                            escrow_release_time: { type: "integer", example: 1729350000 }
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
  "/api/v2/payment/get_income_overview": {
    get: {
      tags: ["Payment & Escrow"],
      summary: "Get Shop Income Overview",
      description: "Consolidated snapshot of total released income, pending escrow amounts, and upcoming payout balances.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "income_status", in: "query", schema: { type: "integer", enum: [1, 2] }, description: "1: Released, 2: Pending" }
      ],
      responses: {
        "200": {
          description: "Income overview balances",
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
                      total_income: {
                        type: "object",
                        properties: {
                          released_amount: { type: "number", example: 1250000 },
                          pending_amount: { type: "number", example: 350000 },
                          to_release_amount: { type: "number", example: 0 }
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
};
