import { Router, Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../../common/prisma";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { WebhookService } from "../webhook/webhook.service";
import {
  SHOPEE_DISPUTE_REASONS,
  VALID_RETURN_STATUSES,
  VALID_RETURN_SOLUTIONS,
  VALID_RETURN_REASONS
} from "./returns.constants";

export const returnsRouter = Router();

// ============================================================================
// 1. GET RETURN LIST: POST & GET /api/v2/returns/get_return_list
// ============================================================================
async function handleGetReturnList(req: Request, res: Response): Promise<void> {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const pageNo = parseInt(String(req.query.page_no || req.body?.page_no || "1"), 10) || 1;
  const pageSize = parseInt(String(req.query.page_size || req.body?.page_size || "40"), 10) || 40;

  const status = (req.query.status || req.body?.status) as string | undefined;
  const createTimeFromRaw = req.query.create_time_from || req.body?.create_time_from;
  const createTimeToRaw = req.query.create_time_to || req.body?.create_time_to;
  const updateTimeFromRaw = req.query.update_time_from || req.body?.update_time_from;
  const updateTimeToRaw = req.query.update_time_to || req.body?.update_time_to;
  const negotiationStatus = (req.query.negotiation_status || req.body?.negotiation_status) as string | undefined;
  const sellerProofStatus = (req.query.seller_proof_status || req.body?.seller_proof_status) as string | undefined;
  const compensationStatus = (req.query.seller_compensation_status || req.body?.seller_compensation_status) as string | undefined;

  const whereClause: any = { shopId };

  if (status) {
    whereClause.status = status;
  }
  if (negotiationStatus) {
    whereClause.negotiationStatus = negotiationStatus;
  }
  if (sellerProofStatus) {
    whereClause.sellerProofStatus = sellerProofStatus;
  }
  if (compensationStatus) {
    whereClause.compensationStatus = compensationStatus;
  }

  if (createTimeFromRaw || createTimeToRaw) {
    whereClause.createdAt = {};
    if (createTimeFromRaw) {
      whereClause.createdAt.gte = new Date(Number(createTimeFromRaw) * 1000);
    }
    if (createTimeToRaw) {
      whereClause.createdAt.lte = new Date(Number(createTimeToRaw) * 1000);
    }
  }

  if (updateTimeFromRaw || updateTimeToRaw) {
    whereClause.updatedAt = {};
    if (updateTimeFromRaw) {
      whereClause.updatedAt.gte = new Date(Number(updateTimeFromRaw) * 1000);
    }
    if (updateTimeToRaw) {
      whereClause.updatedAt.lte = new Date(Number(updateTimeToRaw) * 1000);
    }
  }

  const totalCount = await prisma.return.count({ where: whereClause });
  const returns = await prisma.return.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: (pageNo - 1) * pageSize,
    take: pageSize,
    include: {
      order: true
    }
  });

  const returnList = returns.map(r => ({
    image: r.proofImages || [],
    reason: r.reason,
    text_reason: r.textReason || "",
    return_sn: r.returnSn,
    order_sn: r.orderSn,
    refund_amount: Number(r.refundAmount),
    currency: r.currency,
    create_time: Math.floor(r.createdAt.getTime() / 1000),
    update_time: Math.floor(r.updatedAt.getTime() / 1000),
    status: r.status,
    due_date: r.dueDate ? Math.floor(r.dueDate.getTime() / 1000) : null,
    tracking_number: r.reverseTrackingNumber || "",
    dispute_reason: r.disputeReason ? [r.disputeReason] : [],
    dispute_text_reason: r.disputeTextReason ? [r.disputeTextReason] : [],
    needs_logistics: r.needsLogistics,
    validation_type: r.validationType,
    negotiation_status: r.negotiationStatus || "TERMINATED",
    seller_proof_status: r.sellerProofStatus,
    seller_compensation_status: r.compensationStatus
  }));

  const more = (pageNo * pageSize) < totalCount;

  res.json(createShopeeSuccessResponse({
    more,
    return: returnList,
    return_list: returnList,
    total: totalCount
  }));
}

returnsRouter.get("/api/v2/returns/get_return_list", shopeeAuthGuard, handleGetReturnList);
returnsRouter.post("/api/v2/returns/get_return_list", shopeeAuthGuard, handleGetReturnList);

// ============================================================================
// 2. GET RETURN DETAIL: POST & GET /api/v2/returns/get_return_detail
// ============================================================================
async function handleGetReturnDetail(req: Request, res: Response): Promise<void> {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const returnSn = (req.query.return_sn || req.body?.return_sn) as string | undefined;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId },
    include: {
      order: {
        include: {
          items: true
        }
      },
      items: true,
      proofs: true
    }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return record not found for this shop"));
    return;
  }

  const items = r.items.map(item => ({
    item_id: Number(item.itemId),
    model_id: Number(item.modelId),
    name: item.itemName,
    images: [],
    amount: item.quantity,
    item_price: Number(item.itemPrice),
    refund_amount: Number(item.refundAmount),
    item_sku: "",
    variation_sku: item.modelName || ""
  }));

  const user = {
    username: r.order.buyerUsername,
    email: `${r.order.buyerUsername}@mock-shopee.vn`,
    portrait: "https://cf.shopee.sg/file/default_buyer_portrait"
  };

  res.json(createShopeeSuccessResponse({
    image: r.proofImages || [],
    buyer_videos: [],
    reason: r.reason,
    text_reason: r.textReason || "",
    return_sn: r.returnSn,
    order_sn: r.orderSn,
    refund_amount: Number(r.refundAmount),
    currency: r.currency,
    create_time: Math.floor(r.createdAt.getTime() / 1000),
    update_time: Math.floor(r.updatedAt.getTime() / 1000),
    status: r.status,
    due_date: r.dueDate ? Math.floor(r.dueDate.getTime() / 1000) : null,
    tracking_number: r.reverseTrackingNumber || "",
    dispute_reason: r.disputeReason ? [r.disputeReason] : [],
    dispute_text_reason: r.disputeTextReason ? [r.disputeTextReason] : [],
    needs_logistics: r.needsLogistics,
    validation_type: r.validationType,
    return_refund_request_type: r.returnRefundType,
    seller_proof_status: r.sellerProofStatus,
    seller_compensation_status: r.compensationStatus,
    compensation_status: r.compensationStatus,
    amount_before_discount: Number(r.order.totalAmount),
    user,
    item: items,
    proof_images: r.proofImages || [],
    seller_proof_images: r.proofs.filter(p => p.uploaderType === "SELLER").map(p => p.imageUrl),
    ruling_notes: r.rulingNotes || ""
  }));
}

returnsRouter.get("/api/v2/returns/get_return_detail", shopeeAuthGuard, handleGetReturnDetail);
returnsRouter.post("/api/v2/returns/get_return_detail", shopeeAuthGuard, handleGetReturnDetail);

// ============================================================================
// 3. CONFIRM REFUND: POST /api/v2/returns/confirm
// ============================================================================
returnsRouter.post("/api/v2/returns/confirm", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerIdStr = req.query.partner_id as string;
  const partnerId = BigInt(partnerIdStr);

  const returnSn = req.body?.return_sn;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId },
    include: { order: true }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
    return;
  }

  // Edge-case guard: Cannot confirm return that is already ACCEPTED, CLOSED, or CANCELLED
  if (r.status === "ACCEPTED" || r.status === "CLOSED" || r.status === "CANCELLED") {
    res.json(createShopeeErrorResponse("return.invalid_status", `Cannot confirm return in ${r.status} status`));
    return;
  }

  const oldStatus = r.status;
  const refundAmount = Number(r.refundAmount);

  // Update return status
  const updatedReturn = await prisma.return.update({
    where: { returnSn },
    data: {
      status: "ACCEPTED",
      negotiationStatus: "TERMINATED"
    }
  });

  // Adjust order escrow: deduct refund amount (cannot drop below 0)
  const currentEscrow = Number(r.order.escrowAmount || 0);
  const newEscrow = Math.max(0, currentEscrow - refundAmount);

  await prisma.order.update({
    where: { orderSn: r.orderSn },
    data: {
      escrowAmount: newEscrow,
      orderStatus: newEscrow === 0 ? OrderStatus.TO_RETURN : r.order.orderStatus
    }
  });

  // Fire Outbound Push Code 29 (return_updates_push)
  await WebhookService.dispatchReturnUpdate({
    partnerId,
    shopId,
    orderSn: r.orderSn,
    returnSn: r.returnSn,
    updateField: "return_status",
    oldValue: oldStatus,
    newValue: "ACCEPTED"
  });

  res.json(createShopeeSuccessResponse({
    return_sn: updatedReturn.returnSn
  }));
});

// ============================================================================
// 4. OFFER COUNTER SOLUTION: POST /api/v2/returns/offer
// ============================================================================
returnsRouter.post("/api/v2/returns/offer", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerIdStr = req.query.partner_id as string;
  const partnerId = BigInt(partnerIdStr);

  const returnSn = req.body?.return_sn;
  const offerAmount = parseFloat(req.body?.offer_amount);
  const offerReason = req.body?.offer_reason || "Seller proposed counter-offer";

  if (!returnSn || isNaN(offerAmount)) {
    res.json(createShopeeErrorResponse("error_param", "return_sn and valid offer_amount are required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
    return;
  }

  if (r.status !== "REQUESTED" && r.status !== "PROCESSING") {
    res.json(createShopeeErrorResponse("return.invalid_status", "Can only make counter-offer when return is REQUESTED or PROCESSING"));
    return;
  }

  if (offerAmount <= 0 || offerAmount > Number(r.refundAmount)) {
    res.json(createShopeeErrorResponse("error_param", "offer_amount must be greater than 0 and less than or equal to requested refund_amount"));
    return;
  }

  await prisma.return.update({
    where: { returnSn },
    data: {
      negotiationStatus: "PENDING_BUYER_RESPOND",
      offerAmount,
      offerReason
    }
  });

  await WebhookService.dispatchReturnUpdate({
    partnerId,
    shopId,
    orderSn: r.orderSn,
    returnSn: r.returnSn,
    updateField: "negotiation_status",
    oldValue: r.negotiationStatus || "TERMINATED",
    newValue: "PENDING_BUYER_RESPOND"
  });

  res.json(createShopeeSuccessResponse({
    return_sn: returnSn,
    offer_amount: offerAmount
  }));
});

// ============================================================================
// 5. ACCEPT OFFER: POST /api/v2/returns/accept_offer
// ============================================================================
returnsRouter.post("/api/v2/returns/accept_offer", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerIdStr = req.query.partner_id as string;
  const partnerId = BigInt(partnerIdStr);

  const returnSn = req.body?.return_sn;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId },
    include: { order: true }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
    return;
  }

  if (!r.offerAmount || r.negotiationStatus === "TERMINATED") {
    res.json(createShopeeErrorResponse("return.no_active_offer", "No pending counter-offer available to accept"));
    return;
  }

  const agreedRefund = Number(r.offerAmount);
  const oldStatus = r.status;

  await prisma.return.update({
    where: { returnSn },
    data: {
      status: "ACCEPTED",
      refundAmount: agreedRefund,
      negotiationStatus: "TERMINATED"
    }
  });

  // Adjust order escrow
  const currentEscrow = Number(r.order.escrowAmount || 0);
  const newEscrow = Math.max(0, currentEscrow - agreedRefund);

  await prisma.order.update({
    where: { orderSn: r.orderSn },
    data: {
      escrowAmount: newEscrow,
      orderStatus: newEscrow === 0 ? OrderStatus.TO_RETURN : r.order.orderStatus
    }
  });

  await WebhookService.dispatchReturnUpdate({
    partnerId,
    shopId,
    orderSn: r.orderSn,
    returnSn: r.returnSn,
    updateField: "return_status",
    oldValue: oldStatus,
    newValue: "ACCEPTED"
  });

  res.json(createShopeeSuccessResponse({
    return_sn: returnSn
  }));
});

// ============================================================================
// 6. DISPUTE RETURN / REQUEST COMPENSATION: POST /api/v2/returns/dispute
// ============================================================================
returnsRouter.post("/api/v2/returns/dispute", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerIdStr = req.query.partner_id as string;
  const partnerId = BigInt(partnerIdStr);

  const returnSn = req.body?.return_sn;
  const email = req.body?.email;
  const disputeReasonId = parseInt(String(req.body?.dispute_reason_id), 10);
  const disputeTextReason = req.body?.dispute_text_reason || "";
  const imageList = req.body?.image_list || req.body?.image || [];

  if (!returnSn || !email || isNaN(disputeReasonId)) {
    res.json(createShopeeErrorResponse("error_param", "return_sn, email, and dispute_reason_id are required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
    return;
  }

  // Official Shopee Rule: dispute supported in REQUESTED, PROCESSING, or ACCEPTED
  if (r.status !== "REQUESTED" && r.status !== "PROCESSING" && r.status !== "ACCEPTED") {
    res.json(createShopeeErrorResponse("return.invalid_status", `Cannot dispute return in ${r.status} status`));
    return;
  }

  // Predefined Dispute Reason Validation
  const reasonDef = SHOPEE_DISPUTE_REASONS.find(d => d.dispute_reason === disputeReasonId);
  if (!reasonDef) {
    res.json(createShopeeErrorResponse("return.invalid_dispute_reason", `Dispute reason id ${disputeReasonId} is invalid. Call get_return_dispute_reason.`));
    return;
  }

  const oldStatus = r.status;
  const isCompensationDispute = r.status === "ACCEPTED";

  // If already ACCEPTED, this is a compensation dispute
  const newStatus = isCompensationDispute ? "ACCEPTED" : "SELLER_DISPUTE";
  const compensationStatus = isCompensationDispute ? "COMPENSATION_REQUESTED" : r.compensationStatus;

  await prisma.return.update({
    where: { returnSn },
    data: {
      status: newStatus,
      disputeReasonId,
      disputeReason: reasonDef.dispute_name,
      disputeTextReason,
      disputeEmail: email,
      sellerProofStatus: "UPLOADED",
      compensationStatus
    }
  });

  // Store uploaded image proofs if provided (supports strings or Shopee nested { image_url: [] })
  if (Array.isArray(imageList) && imageList.length > 0) {
    for (const item of imageList) {
      if (typeof item === "string") {
        await prisma.returnProof.create({
          data: {
            returnSn,
            uploaderType: "SELLER",
            imageUrl: item,
            comment: disputeTextReason || ""
          }
        });
      } else if (item && Array.isArray(item.image_url)) {
        for (const url of item.image_url) {
          await prisma.returnProof.create({
            data: {
              returnSn,
              uploaderType: "SELLER",
              imageUrl: url,
              comment: item.requirement || ""
            }
          });
        }
      }
    }
  }

  // Fire Webhook Push Code 29
  await WebhookService.dispatchReturnUpdate({
    partnerId,
    shopId,
    orderSn: r.orderSn,
    returnSn: r.returnSn,
    updateField: isCompensationDispute ? "seller_compensation_status" : "return_status",
    oldValue: isCompensationDispute ? r.compensationStatus : oldStatus,
    newValue: isCompensationDispute ? "COMPENSATION_REQUESTED" : "SELLER_DISPUTE"
  });

  res.json(createShopeeSuccessResponse({
    return_sn: returnSn,
    msg: "dispute return success"
  }));
});

// ============================================================================
// 7. CANCEL DISPUTE: POST /api/v2/returns/cancel_dispute
// ============================================================================
returnsRouter.post("/api/v2/returns/cancel_dispute", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerIdStr = req.query.partner_id as string;
  const partnerId = BigInt(partnerIdStr);

  const returnSn = req.body?.return_sn;
  const email = req.body?.email;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
    return;
  }

  // Can cancel:
  // 1. Pre-arbitration seller dispute (status === SELLER_DISPUTE -> reverts to REQUESTED)
  // 2. Post-acceptance compensation dispute (status === ACCEPTED && compensationStatus === COMPENSATION_REQUESTED)
  const isCompensationDispute = r.status === "ACCEPTED" && r.compensationStatus === "COMPENSATION_REQUESTED";
  const isSellerDispute = r.status === "SELLER_DISPUTE";

  if (!isCompensationDispute && !isSellerDispute) {
    res.json(createShopeeErrorResponse("return.invalid_status", "Can only cancel active dispute in SELLER_DISPUTE or COMPENSATION_REQUESTED"));
    return;
  }

  let newStatus = r.status;
  let newCompStatus = r.compensationStatus;
  let updateField = "return_status";
  let oldValue = r.status;
  let newValue = r.status;

  if (isSellerDispute) {
    newStatus = "REQUESTED";
    updateField = "return_status";
    oldValue = "SELLER_DISPUTE";
    newValue = "REQUESTED";
  } else if (isCompensationDispute) {
    newCompStatus = "COMPENSATION_CANCELLED";
    updateField = "seller_compensation_status";
    oldValue = "COMPENSATION_REQUESTED";
    newValue = "COMPENSATION_CANCELLED";
  }

  await prisma.return.update({
    where: { returnSn },
    data: {
      status: newStatus,
      compensationStatus: newCompStatus
    }
  });

  await WebhookService.dispatchReturnUpdate({
    partnerId,
    shopId,
    orderSn: r.orderSn,
    returnSn: r.returnSn,
    updateField,
    oldValue,
    newValue
  });

  res.json(createShopeeSuccessResponse({
    return_sn: returnSn,
    message: "SUCCESS"
  }));
});

// ============================================================================
// 8. GET DISPUTE REASONS: POST & GET /api/v2/returns/get_return_dispute_reason
// ============================================================================
async function handleGetReturnDisputeReason(req: Request, res: Response): Promise<void> {
  const returnSn = (req.query.return_sn || req.body?.return_sn) as string | undefined;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  res.json(createShopeeSuccessResponse({
    dispute_reason_list: SHOPEE_DISPUTE_REASONS,
    dispute_reason: SHOPEE_DISPUTE_REASONS.map(d => ({
      dispute_reason_id: d.dispute_reason,
      dispute_reason_name: d.dispute_name
    }))
  }));
}

returnsRouter.get("/api/v2/returns/get_return_dispute_reason", shopeeAuthGuard, handleGetReturnDisputeReason);
returnsRouter.post("/api/v2/returns/get_return_dispute_reason", shopeeAuthGuard, handleGetReturnDisputeReason);

// ============================================================================
// 9. GET AVAILABLE SOLUTIONS: POST & GET /api/v2/returns/get_available_solutions
// ============================================================================
async function handleGetAvailableSolutions(req: Request, res: Response): Promise<void> {
  const returnSn = (req.query.return_sn || req.body?.return_sn) as string | undefined;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  const solutions = [
    { solution: "REFUND", solution_name: "Refund Only" },
    { solution: "RETURN_REFUND", solution_name: "Return and Refund" }
  ];

  res.json(createShopeeSuccessResponse({
    solution_list: solutions,
    solutions
  }));
}

returnsRouter.get("/api/v2/returns/get_available_solutions", shopeeAuthGuard, handleGetAvailableSolutions);
returnsRouter.post("/api/v2/returns/get_available_solutions", shopeeAuthGuard, handleGetAvailableSolutions);

// ============================================================================
// 10. UPLOAD & QUERY PROOF: /api/v2/returns/upload_proof & query_proof
// ============================================================================
returnsRouter.post("/api/v2/returns/upload_proof", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const returnSn = req.body?.return_sn;
  const rawUrlList = req.body?.image_url_list || (req.body?.url ? [req.body.url] : []);
  const imageUrlList = Array.isArray(rawUrlList) ? rawUrlList : [rawUrlList];
  const comment = req.body?.comment || req.body?.description || "";

  if (!returnSn || imageUrlList.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "return_sn and image_url_list (or url) are required"));
    return;
  }

  const r = await prisma.return.findFirst({
    where: { returnSn, shopId }
  });

  if (!r) {
    res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
    return;
  }

  let lastProofId = 0;
  for (const url of imageUrlList) {
    const createdProof = await prisma.returnProof.create({
      data: {
        returnSn,
        uploaderType: "SELLER",
        imageUrl: url,
        comment
      }
    });
    lastProofId = Number(createdProof.id);
  }

  await prisma.return.update({
    where: { returnSn },
    data: {
      sellerProofStatus: "UPLOADED"
    }
  });

  res.json(createShopeeSuccessResponse({
    return_sn: returnSn,
    proof_id: lastProofId,
    proof_count: imageUrlList.length
  }));
});

async function handleQueryProof(req: Request, res: Response): Promise<void> {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const returnSn = (req.query.return_sn || req.body?.return_sn) as string | undefined;

  if (!returnSn) {
    res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
    return;
  }

  const proofs = await prisma.returnProof.findMany({
    where: {
      returnSn,
      return: { shopId }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(createShopeeSuccessResponse({
    return_sn: returnSn,
    proof_list: proofs.map(p => ({
      uploader_type: p.uploaderType,
      image_url: p.imageUrl,
      comment: p.comment || "",
      created_at: Math.floor(p.createdAt.getTime() / 1000)
    }))
  }));
}

returnsRouter.get("/api/v2/returns/query_proof", shopeeAuthGuard, handleQueryProof);
returnsRouter.post("/api/v2/returns/query_proof", shopeeAuthGuard, handleQueryProof);
