export const voucherSwaggerPaths: Record<string, any> = {
  "/api/v2/voucher/add_voucher": {
    post: {
      tags: ["Voucher"],
      summary: "Add Voucher",
      description: "Creates a new merchant shop voucher with fixed discount or percentage reward.",
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
              required: ["voucher_name", "voucher_code", "reward_type", "min_basket_price", "usage_quantity", "start_time", "end_time"],
              properties: {
                voucher_name: { type: "string", example: "Shop Welcome 50k" },
                voucher_code: { type: "string", example: "WLCM5", description: "1-5 alphanumeric characters" },
                voucher_type: { type: "integer", default: 1, description: "1: Shop voucher, 2: Product voucher" },
                reward_type: { type: "integer", example: 1, description: "1: Fix amount, 2: Percentage discount" },
                discount_amount: { type: "number", example: 50000, description: "Required if reward_type=1" },
                percentage: { type: "integer", example: 15, description: "Required if reward_type=2 (1-100)" },
                max_price: { type: "number", example: 100000, description: "Max discount cap if reward_type=2" },
                min_basket_price: { type: "number", example: 200000, description: "Minimum order basket amount required" },
                usage_quantity: { type: "integer", example: 500, description: "Total redemption quota limit" },
                start_time: { type: "integer", example: 1776510000 },
                end_time: { type: "integer", example: 1777114800 }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Created voucher response",
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
                      voucher_id: { type: "integer", example: 3001 },
                      voucher_code: { type: "string", example: "WLCM5" }
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
  "/api/v2/voucher/get_voucher_list": {
    get: {
      tags: ["Voucher"],
      summary: "Get Voucher List",
      description: "Retrieves a paginated list of vouchers filtered by status.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "status", in: "query", required: true, schema: { type: "string", enum: ["all", "upcoming", "ongoing", "expired"] } },
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 20 } }
      ],
      responses: {
        "200": {
          description: "List of vouchers",
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
                      voucher_list: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            voucher_id: { type: "integer" },
                            voucher_code: { type: "string" },
                            voucher_name: { type: "string" },
                            voucher_type: { type: "integer" },
                            reward_type: { type: "integer" },
                            discount_amount: { type: "number" },
                            percentage: { type: "integer" },
                            min_basket_price: { type: "number" },
                            usage_quantity: { type: "integer" },
                            current_usage: { type: "integer" },
                            start_time: { type: "integer" },
                            end_time: { type: "integer" }
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
  "/api/v2/voucher/get_voucher": {
    get: {
      tags: ["Voucher"],
      summary: "Get Voucher Detail",
      description: "Retrieves complete configuration, quota metrics, and current usage for a single voucher.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "voucher_id", in: "query", required: true, schema: { type: "integer" } }
      ],
      responses: {
        "200": {
          description: "Detailed voucher object",
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
                      voucher_id: { type: "integer" },
                      voucher_code: { type: "string" },
                      voucher_name: { type: "string" },
                      min_basket_price: { type: "number" },
                      usage_quantity: { type: "integer" },
                      current_usage: { type: "integer" },
                      start_time: { type: "integer" },
                      end_time: { type: "integer" }
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
  "/api/v2/voucher/update_voucher": {
    post: {
      tags: ["Voucher"],
      summary: "Update Voucher",
      description: "Modifies parameters such as voucher name, usage quota, or end time.",
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
              required: ["voucher_id"],
              properties: {
                voucher_id: { type: "integer", example: 3001 },
                voucher_name: { type: "string", example: "Updated Voucher Name" },
                usage_quantity: { type: "integer", example: 1000 },
                end_time: { type: "integer", example: 1777900000 }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Update voucher response"
        }
      }
    }
  },
  "/api/v2/voucher/delete_voucher": {
    post: {
      tags: ["Voucher"],
      summary: "Delete Upcoming Voucher",
      description: "Deletes an upcoming voucher. Ongoing vouchers cannot be deleted; use end_voucher instead.",
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
              required: ["voucher_id"],
              properties: {
                voucher_id: { type: "integer", example: 3001 }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Voucher deletion response" }
      }
    }
  },
  "/api/v2/voucher/end_voucher": {
    post: {
      tags: ["Voucher"],
      summary: "End Ongoing Voucher",
      description: "Terminates an active ongoing voucher immediately.",
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
              required: ["voucher_id"],
              properties: {
                voucher_id: { type: "integer", example: 3001 }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Voucher termination response" }
      }
    }
  }
};
