const shopeeCommonQueryParams = [
  { name: "partner_id", in: "query", required: true, schema: { type: "integer" } },
  { name: "timestamp", in: "query", required: true, schema: { type: "integer" } },
  { name: "access_token", in: "query", required: true, schema: { type: "string" } },
  { name: "shop_id", in: "query", required: true, schema: { type: "integer" } },
  { name: "sign", in: "query", required: true, schema: { type: "string" } }
];

export const accountHealthSwaggerPaths = {
  "/api/v2/account_health/get_shop_performance": {
    get: {
      tags: ["Account Health"],
      summary: "Get Shop Performance",
      parameters: [...shopeeCommonQueryParams],
      responses: { "200": { description: "Shop performance rating and metric_list" } }
    }
  },
  "/api/v2/account_health/get_penalty_point_history": {
    get: {
      tags: ["Account Health"],
      summary: "Get Penalty Point History",
      parameters: [
        ...shopeeCommonQueryParams,
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 10 } },
        { name: "violation_type", in: "query", schema: { type: "integer" } }
      ],
      responses: { "200": { description: "Penalty point records in current quarter" } }
    }
  },
  "/api/v2/account_health/get_punishment_history": {
    get: {
      tags: ["Account Health"],
      summary: "Get Punishment History",
      parameters: [
        ...shopeeCommonQueryParams,
        { name: "punishment_status", in: "query", required: true, schema: { type: "integer", enum: [1, 2] } },
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: { "200": { description: "Punishment records in current quarter" } }
    }
  },
  "/api/v2/account_health/get_late_orders": {
    get: {
      tags: ["Account Health"],
      summary: "Get Late Orders",
      parameters: [
        ...shopeeCommonQueryParams,
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: { "200": { description: "Overdue open orders" } }
    }
  },
  "/api/v2/account_health/get_listings_with_issues": {
    get: {
      tags: ["Account Health"],
      summary: "Get Listings With Issues",
      parameters: [
        ...shopeeCommonQueryParams,
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: { "200": { description: "Listings with policy violations" } }
    }
  },
  "/api/v2/account_health/get_metric_source_detail": {
    get: {
      tags: ["Account Health"],
      summary: "Get Metric Source Detail",
      parameters: [
        ...shopeeCommonQueryParams,
        { name: "metric_id", in: "query", required: true, schema: { type: "integer" } },
        { name: "page_no", in: "query", schema: { type: "integer", default: 1 } },
        { name: "page_size", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: { "200": { description: "Affected orders or listings for a metric" } }
    }
  }
};
