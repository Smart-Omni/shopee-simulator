export const discountSwaggerPaths: Record<string, any> = {
  "/api/v2/discount/add_discount": {
    post: {
      tags: ["Discount"],
      summary: "Add Discount Activity",
      description: "Creates a new promotional discount campaign for the merchant shop.",
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
              required: ["discount_name", "start_time", "end_time"],
              properties: {
                discount_name: { type: "string", example: "Mid-Month Mega Sale" },
                start_time: { type: "integer", example: 1776510000, description: "Epoch start time in seconds (> now)" },
                end_time: { type: "integer", example: 1777114800, description: "Epoch end time in seconds (> start_time + 1 hour)" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Standard Shopee response envelope containing created discount_id",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  request_id: { type: "string", example: "req_f48d0a..." },
                  response: {
                    type: "object",
                    properties: {
                      discount_id: { type: "integer", example: 100201 }
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
  "/api/v2/discount/add_discount_item": {
    post: {
      tags: ["Discount"],
      summary: "Add Items to Discount",
      description: "Applies promotion discount prices and purchase limits to products and variation models.",
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
              required: ["discount_id", "item_list"],
              properties: {
                discount_id: { type: "integer", example: 100201 },
                item_list: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item_id"],
                    properties: {
                      item_id: { type: "integer", example: 14 },
                      purchase_limit: { type: "integer", example: 2 },
                      item_promotion_price: { type: "number", example: 150000 },
                      model_list: {
                        type: "array",
                        items: {
                          type: "object",
                          required: ["model_id", "model_promotion_price"],
                          properties: {
                            model_id: { type: "integer", example: 101 },
                            model_promotion_price: { type: "number", example: 150000 }
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
      responses: {
        "200": {
          description: "Result list indicating success and failure counts",
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
                      discount_id: { type: "integer" },
                      count: { type: "integer" },
                      error_list: { type: "array", items: { type: "object" } }
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
  "/api/v2/discount/get_discount_list": {
    get: {
      tags: ["Discount"],
      summary: "Get Discount List",
      description: "Retrieves a paginated list of discount promotions filtered by status.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "discount_status", in: "query", required: true, schema: { type: "string", enum: ["all", "upcoming", "ongoing", "expired"] } },
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 20 } }
      ],
      responses: {
        "200": {
          description: "List of discounts",
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
                      discount_list: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            discount_id: { type: "integer" },
                            discount_name: { type: "string" },
                            start_time: { type: "integer" },
                            end_time: { type: "integer" },
                            status: { type: "string" }
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
  "/api/v2/discount/get_discount": {
    get: {
      tags: ["Discount"],
      summary: "Get Discount Detail",
      description: "Retrieves full details of a specific discount including participating items and variation models.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } },
        { name: "discount_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 20 } }
      ],
      responses: {
        "200": {
          description: "Detailed discount object",
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
                      discount_id: { type: "integer" },
                      discount_name: { type: "string" },
                      start_time: { type: "integer" },
                      end_time: { type: "integer" },
                      status: { type: "string" },
                      item_list: { type: "array", items: { type: "object" } }
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
  "/api/v2/discount/update_discount": {
    post: {
      tags: ["Discount"],
      summary: "Update Discount",
      description: "Modifies the name or timing of an existing upcoming or ongoing discount.",
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
              required: ["discount_id"],
              properties: {
                discount_id: { type: "integer", example: 100201 },
                discount_name: { type: "string", example: "Updated Super Sale" },
                start_time: { type: "integer", example: 1776510000 },
                end_time: { type: "integer", example: 1777114800 }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Updated discount response",
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
                      discount_id: { type: "integer" }
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
  "/api/v2/discount/update_discount_item": {
    post: {
      tags: ["Discount"],
      summary: "Update Discount Item",
      description: "Modifies promotional prices or limits for items in a discount.",
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
              required: ["discount_id", "item_list"],
              properties: {
                discount_id: { type: "integer", example: 100201 },
                item_list: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Update items response" }
      }
    }
  },
  "/api/v2/discount/delete_discount": {
    post: {
      tags: ["Discount"],
      summary: "Delete Discount",
      description: "Deletes an upcoming discount promotion. Ongoing promotions cannot be deleted; use end_discount instead.",
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
              required: ["discount_id"],
              properties: {
                discount_id: { type: "integer", example: 100201 }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Deletion result",
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
                      discount_id: { type: "integer" }
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
  "/api/v2/discount/delete_discount_item": {
    post: {
      tags: ["Discount"],
      summary: "Delete Item from Discount",
      description: "Removes a specific item or variation model from an existing discount promotion.",
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
              required: ["discount_id", "item_id"],
              properties: {
                discount_id: { type: "integer", example: 100201 },
                item_id: { type: "integer", example: 14 },
                model_id: { type: "integer", example: 101 }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Item deletion response" }
      }
    }
  },
  "/api/v2/discount/end_discount": {
    post: {
      tags: ["Discount"],
      summary: "End Ongoing Discount",
      description: "Immediately terminates an ongoing promotional discount, reverting prices to original values.",
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
              required: ["discount_id"],
              properties: {
                discount_id: { type: "integer", example: 100201 }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Termination confirmation",
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
                      discount_id: { type: "integer" }
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
