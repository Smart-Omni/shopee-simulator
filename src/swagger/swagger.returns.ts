export const returnsSwaggerPaths: Record<string, any> = {
  "/api/v2/returns/get_return_list": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Get Return List",
      description: "Queries list of return and refund requests for the authorized shop with pagination and status filters.",
      parameters: [
        { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
        { name: "access_token", in: "query", required: true, schema: { type: "string" } },
        { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "sign", in: "query", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                page_no: { type: "integer", default: 1 },
                page_size: { type: "integer", default: 20 },
                create_time_from: { type: "integer" },
                create_time_to: { type: "integer" },
                status: {
                  type: "string",
                  enum: [
                    "REQUESTED",
                    "JUDGING",
                    "PROCESSING",
                    "ACCEPTED",
                    "CANCELLED",
                    "CLOSED",
                    "SELLER_DISPUTE"
                  ]
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "List of returns and pagination metadata",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  request_id: { type: "string" },
                  response: {
                    type: "object",
                    properties: {
                      return_list: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            return_sn: { type: "string" },
                            order_sn: { type: "string" },
                            status: { type: "string" },
                            refund_amount: { type: "number" },
                            currency: { type: "string" },
                            create_time: { type: "integer" },
                            update_time: { type: "integer" },
                            due_date: { type: "integer" },
                            tracking_number: { type: "string" },
                            reason: { type: "string" },
                            text_reason: { type: "string" },
                            buyer_user_name: { type: "string" },
                            needs_logistics: { type: "boolean" }
                          }
                        }
                      },
                      more: { type: "boolean" },
                      page_no: { type: "integer" },
                      page_size: { type: "integer" },
                      total: { type: "integer" }
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
  "/api/v2/returns/get_return_detail": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Get Return Detail",
      description: "Fetches full details for a return request including items, dispute reasons, logistics, and proof attachments.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string", example: "RET261020A1B2C3" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Full return details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "" },
                  message: { type: "string", example: "" },
                  request_id: { type: "string" },
                  response: {
                    type: "object",
                    properties: {
                      return_sn: { type: "string" },
                      order_sn: { type: "string" },
                      status: { type: "string" },
                      flow_type: { type: "string" },
                      refund_amount: { type: "number" },
                      amount_before_discount: { type: "number" },
                      currency: { type: "string" },
                      create_time: { type: "integer" },
                      update_time: { type: "integer" },
                      due_date: { type: "integer" },
                      tracking_number: { type: "string" },
                      reason: { type: "string" },
                      text_reason: { type: "string" },
                      item: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            item_id: { type: "integer" },
                            model_id: { type: "integer" },
                            name: { type: "string" },
                            images: { type: "array", items: { type: "string" } },
                            amount: { type: "number" },
                            item_price: { type: "number" },
                            is_addon_sub_item: { type: "boolean" }
                          }
                        }
                      },
                      user: {
                        type: "object",
                        properties: {
                          username: { type: "string" },
                          email: { type: "string" },
                          portrait: { type: "string" }
                        }
                      },
                      proof_images: { type: "array", items: { type: "string" } },
                      seller_proof_images: { type: "array", items: { type: "string" } },
                      dispute_reason: { type: "string" },
                      dispute_reason_id: { type: "integer" },
                      dispute_text_reason: { type: "string" },
                      compensation_status: { type: "string" },
                      seller_compensation_amount: { type: "number" },
                      needs_logistics: { type: "boolean" }
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
  "/api/v2/returns/confirm": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Confirm / Accept Return",
      description: "Seller agrees to the buyer return/refund request, transitioning status to ACCEPTED and releasing refund deduction.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Confirmed return",
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
                      return_sn: { type: "string" }
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
  "/api/v2/returns/offer": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Propose Counter-Offer",
      description: "Seller submits a counter-proposal (e.g. partial refund or return & refund) to the buyer.",
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
              required: ["return_sn", "offer_type", "offer_amount"],
              properties: {
                return_sn: { type: "string" },
                offer_type: { type: "string", enum: ["REFUND_ONLY", "RETURN_AND_REFUND"] },
                offer_amount: { type: "number" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Counter-offer registered",
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
                      return_sn: { type: "string" }
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
  "/api/v2/returns/accept_offer": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Accept Counter-Offer",
      description: "Resolves the return by accepting an active counter-proposal.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Accepted offer",
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
                      return_sn: { type: "string" }
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
  "/api/v2/returns/dispute": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Dispute Return / Request Shopee Arbitration",
      description: "Seller disputes the return request or requests Shopee compensation using standard Shopee dispute reason IDs.",
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
              required: ["return_sn", "dispute_reason_id", "dispute_text_reason", "email"],
              properties: {
                return_sn: { type: "string" },
                dispute_reason_id: {
                  type: "integer",
                  description: "47: ITEM_DAMAGED_BY_BUYER, 48: WEIGHT_MEASUREMENT_MISMATCH, 49: OTHER, 50: INCORRECT_CLAIM, 51: NON_RECEIPT_REJECT, 52: NOT_RECEIVED_RETURN"
                },
                dispute_text_reason: { type: "string" },
                email: { type: "string" },
                image: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Dispute escalated to Shopee Admin",
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
                      return_sn: { type: "string" }
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
  "/api/v2/returns/cancel_dispute": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Cancel Dispute",
      description: "Seller withdraws their active dispute before Shopee makes a final arbitration decision.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Cancelled dispute",
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
                      return_sn: { type: "string" }
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
  "/api/v2/returns/get_return_dispute_reason": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Get Return Dispute Reason",
      description: "Returns the official list of dispute reasons allowed for the given return_sn based on its status and flow type.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "List of allowed dispute reasons",
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
                      dispute_reason: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            dispute_reason_id: { type: "integer" },
                            dispute_reason_name: { type: "string" }
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
  "/api/v2/returns/get_available_solutions": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Get Available Solutions",
      description: "Returns available resolution options (RETURN_REFUND or REFUND_ONLY) for this return case.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Available solutions",
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
                      solutions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            solution_id: { type: "integer" },
                            solution_name: { type: "string" }
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
  "/api/v2/returns/upload_proof": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Upload Return Proof",
      description: "Attaches image or video proof URL for a return or dispute arbitration.",
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
              required: ["return_sn", "proof_type", "url"],
              properties: {
                return_sn: { type: "string" },
                proof_type: { type: "string", enum: ["IMAGE", "VIDEO"] },
                url: { type: "string" },
                description: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Proof attached",
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
                      return_sn: { type: "string" },
                      proof_id: { type: "integer" }
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
  "/api/v2/returns/query_proof": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Query Return Proof",
      description: "Retrieves list of all proof documents attached by buyer, seller, and warehouse inspector.",
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
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Proof documents",
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
                      proof_list: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            proof_type: { type: "string" },
                            uploader_role: { type: "string" },
                            url: { type: "string" },
                            description: { type: "string" },
                            create_time: { type: "integer" }
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
  }
};
