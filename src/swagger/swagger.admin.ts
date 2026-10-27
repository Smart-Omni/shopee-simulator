export const adminSwaggerPaths: Record<string, any> = {
  // =========================================================================
  // Platform Admin Return & Dispute Arbitration Endpoints
  // =========================================================================
  "/api/v2/simulator/returns": {
    get: {
      tags: ["Returns & Disputes"],
      summary: "Admin Return & Dispute Cases Overview",
      description: "Returns all return cases across shops with summary metrics (requested, judging, processing, accepted, closed, disputed).",
      parameters: [
        { name: "shop_id", in: "query", schema: { type: "string" }, description: "Filter by shop ID or 'ALL'" }
      ],
      responses: {
        "200": {
          description: "Summary counters and itemized returns list with proof media"
        }
      }
    }
  },
  "/api/v2/simulator/admin/returns/review": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Customer Service Review Return Claim",
      description: "Platform CS decision to APPROVE (instructing buyer to ship return) or REJECT return request.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["return_sn", "action"],
              properties: {
                return_sn: { type: "string", example: "RET23442063109" },
                action: { type: "string", enum: ["APPROVE", "REJECT"] },
                reason: { type: "string", example: "Hàng không đúng mô tả, chấp thuận hoàn hàng." }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated return record with status and action log" }
      }
    }
  },
  "/api/v2/simulator/admin/returns/warehouse_inbound": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Platform Warehouse Return Inspection (Inbound)",
      description: "Physical warehouse inspection of returned parcel: PASS (triggers escrow refund) or FAIL (cancels refund).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["return_sn", "result"],
              properties: {
                return_sn: { type: "string", example: "RET23442063109" },
                result: { type: "string", enum: ["PASS", "FAIL"] },
                inspection_notes: { type: "string", example: "Hàng hoàn nguyên vẹn niêm phong, đủ điều kiện hoàn tiền." }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Updated return record with warehouse inspection result" }
      }
    }
  },
  "/api/v2/simulator/admin/returns/arbitrate_dispute": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Shopee Platform Gavel Dispute Arbitration",
      description: "Final binding ruling on seller dispute: BUYER_WIN or SELLER_WIN, with optional platform compensation payout.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["return_sn", "verdict"],
              properties: {
                return_sn: { type: "string", example: "RET23442063109" },
                verdict: { type: "string", enum: ["BUYER_WIN", "SELLER_WIN"] },
                compensation_amount: { type: "number", example: 150000 },
                ruling_notes: { type: "string", example: "Trọng tài Shopee xét duyệt chứng cứ: Người mua cung cấp đầy đủ video bóc hàng." }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Binding ruling result with escrow adjustment" }
      }
    }
  },

  // =========================================================================
  // Interactive Returns Lifecycle Endpoints (Buyer & Seller Actions)
  // =========================================================================
  "/api/v2/simulator/returns/buyer_request": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Buyer Initiates Return / Refund Request",
      description: "Creates a return request for an eligible delivered order with proof uploads.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["order_sn", "reason"],
              properties: {
                order_sn: { type: "string" },
                reason: { type: "string", example: "DAMAGED_FAULTY" },
                text_reason: { type: "string" },
                solution: { type: "string", enum: ["REFUND", "RETURN_REFUND"] },
                refund_amount: { type: "number" },
                proof_images: { type: "array", items: { type: "string", format: "binary" } }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Created return request with return_sn" }
      }
    }
  },
  "/api/v2/simulator/returns/buyer_ship": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Buyer Dispatches Return Parcel",
      description: "Buyer submits tracking number when returning goods to warehouse or seller.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" },
                tracking_number: { type: "string", example: "SPXVNRET99212" },
                shipping_carrier: { type: "string", example: "SPX Express" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Return parcel tracking status updated" }
      }
    }
  },
  "/api/v2/simulator/returns/buyer_cancel": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Buyer Cancels Return Request",
      description: "Withdraws a pending return request before resolution.",
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
        "200": { description: "Return status transitioned to CANCELLED" }
      }
    }
  },
  "/api/v2/simulator/returns/seller_confirm": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Seller Accepts Return / Refund Request",
      description: "Seller acknowledges return request and authorizes immediate refund.",
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
        "200": { description: "Return status transitioned to ACCEPTED" }
      }
    }
  },
  "/api/v2/simulator/returns/seller_offer": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Seller Counter-Offer for Partial Refund",
      description: "Seller proposes a partial refund amount without requiring goods return.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["return_sn", "offer_amount"],
              properties: {
                return_sn: { type: "string" },
                offer_amount: { type: "number" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Counter-offer registered with negotiation status" }
      }
    }
  },
  "/api/v2/simulator/returns/buyer_accept_offer": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Buyer Accepts Seller Counter-Offer",
      description: "Buyer accepts proposed partial refund, resolving return request.",
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
        "200": { description: "Partial refund executed and return resolved" }
      }
    }
  },
  "/api/v2/simulator/returns/seller_dispute": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Seller Disputes Return Request",
      description: "Seller disputes the return request to escalate to Shopee arbitration.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["return_sn", "dispute_reason"],
              properties: {
                return_sn: { type: "string" },
                dispute_reason: { type: "string" },
                dispute_text_reason: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Return status transitioned to SELLER_DISPUTE" }
      }
    }
  },
  "/api/v2/simulator/returns/seller_upload_proof": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Seller Uploads Evidence Proofs",
      description: "Uploads packaging photos or video proof for dispute arbitration.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["return_sn"],
              properties: {
                return_sn: { type: "string" },
                proof_images: { type: "array", items: { type: "string", format: "binary" } }
              }
            }
          }
        }
      },
      responses: {
        "200": { description: "Seller proofs saved" }
      }
    }
  },
  "/api/v2/simulator/returns/seller_cancel_dispute": {
    post: {
      tags: ["Returns & Disputes"],
      summary: "Seller Cancels Active Dispute",
      description: "Retracts dispute claim, allowing return refund to proceed.",
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
        "200": { description: "Dispute cancelled" }
      }
    }
  }
};
