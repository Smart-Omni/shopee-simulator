export interface DisputeReasonDefinition {
  dispute_reason: number;
  dispute_name: string;
  dispute_requirement: string;
  evidence_module_list: Array<{
    module_index: number;
    requirement: string;
    is_required: boolean;
  }>;
}

export const SHOPEE_DISPUTE_REASONS: DisputeReasonDefinition[] = [
  {
    dispute_reason: 50,
    dispute_name: "INCORRECT_CLAIM",
    dispute_requirement: "Regarding to your refund dispute request, Shopee would like to request evidence proving buyer claim is incorrect or returned parcel is incorrect.",
    evidence_module_list: [
      { module_index: 1, requirement: "Photo(s) or Video of unboxing the returned parcel with the consignment note (Airway Bill).", is_required: true },
      { module_index: 2, requirement: "Photo(s) or Video of all returned item(s).", is_required: true },
      { module_index: 3, requirement: "Photo(s) or Video while packing the parcel before dispatch with consignment note.", is_required: true },
      { module_index: 4, requirement: "Photo or Video of the product matching description details.", is_required: true }
    ]
  },
  {
    dispute_reason: 49,
    dispute_name: "OTHER",
    dispute_requirement: "Regarding to your dispute request, please provide your statement and supporting evidence to reject the request.",
    evidence_module_list: [
      { module_index: 1, requirement: "Photo(s) or Video of the parcel/item condition.", is_required: false },
      { module_index: 2, requirement: "Written statement or chat history with buyer.", is_required: false }
    ]
  },
  {
    dispute_reason: 48,
    dispute_name: "WEIGHT_MEASUREMENT_MISMATCH",
    dispute_requirement: "Please provide parcel weight measurement proof before dispatch and upon return receipt.",
    evidence_module_list: [
      { module_index: 1, requirement: "Clear Video or Photo showing the weight measurement of returned parcel on scale.", is_required: true },
      { module_index: 2, requirement: "Courier manifest / dispatch proof showing dispatch weight.", is_required: true }
    ]
  },
  {
    dispute_reason: 47,
    dispute_name: "ITEM_DAMAGED_BY_BUYER",
    dispute_requirement: "Please provide evidence proving the returned product was damaged or used by the buyer.",
    evidence_module_list: [
      { module_index: 1, requirement: "Photo(s) or Video of unboxing returned parcel.", is_required: true },
      { module_index: 2, requirement: "Close-up photo(s) of the damage point(s) on the returned item.", is_required: true }
    ]
  },
  {
    dispute_reason: 51,
    dispute_name: "NON_RECEIPT_REJECT",
    dispute_requirement: "Reject non-receipt claim. Please provide carrier delivery confirmation.",
    evidence_module_list: [
      { module_index: 1, requirement: "3PL courier proof of delivery receipt or recipient signature.", is_required: true }
    ]
  },
  {
    dispute_reason: 52,
    dispute_name: "NOT_RECEIVED_RETURN",
    dispute_requirement: "Seller agreed to return, but the return parcel was never received from carrier.",
    evidence_module_list: [
      { module_index: 1, requirement: "Tracking number confirmation showing no delivery to seller address.", is_required: false }
    ]
  }
];

export const VALID_RETURN_STATUSES = [
  "REQUESTED",
  "JUDGING",
  "PROCESSING",
  "ACCEPTED",
  "CANCELLED",
  "CLOSED",
  "SELLER_DISPUTE"
];

export const VALID_RETURN_SOLUTIONS = [
  "REFUND",
  "RETURN_REFUND"
];

export interface ShopeeOfficialReturnReason {
  reason: string;
  displayName: string;
  description: string;
  isNotReceived: boolean;
}

export const SHOPEE_OFFICIAL_RETURN_REASONS: ShopeeOfficialReturnReason[] = [
  {
    reason: "NOT_RECEIVED",
    displayName: "Không nhận được hàng / Nhận thiếu hàng",
    description: "Đơn hàng chưa giao tới tay người mua hoặc kiện hàng bị thiếu sản phẩm.",
    isNotReceived: true
  },
  {
    reason: "DAMAGED_FAULTY",
    displayName: "Nhận được hàng nhưng hàng có vấn đề (bể vỡ, sai hàng, hàng lỗi, khác mô tả...)",
    description: "Nhận được hàng nhưng hàng bị vỡ, rách bao bì, sai phân loại hoặc không hoạt động.",
    isNotReceived: false
  },
  {
    reason: "CHANGE_OF_MIND",
    displayName: "Đổi ý (Sản phẩm còn nguyên tem, nhãn mác, bao bì)",
    description: "Người mua đổi ý không còn nhu cầu, cam kết sản phẩm còn nguyên vẹn chưa qua sử dụng.",
    isNotReceived: false
  }
];

export function normalizeReturnReason(rawReason: string): string {
  if (!rawReason) return "DAMAGED_FAULTY";
  const upper = rawReason.trim().toUpperCase();

  // 1. Not received category
  if (
    upper === "NOT_RECEIVED" ||
    upper === "NOT_RECEIPT" ||
    upper === "SP_NOT_RECEIVED" ||
    upper.includes("NON_RECEIPT") ||
    upper.includes("CHUA_NHAN")
  ) {
    return "NOT_RECEIVED";
  }

  // 2. Change of mind category
  if (
    upper === "CHANGE_OF_MIND" ||
    upper === "CHANGE_MIND" ||
    upper === "SP_CHANGE_MIND" ||
    upper.includes("DOI_Y")
  ) {
    return "CHANGE_OF_MIND";
  }

  // 3. Damaged / faulty / wrong item / missing / different description
  return "DAMAGED_FAULTY";
}

export const VALID_RETURN_REASONS = [
  "NOT_RECEIVED",
  "DAMAGED_FAULTY",
  "CHANGE_OF_MIND",
  "NOT_RECEIPT",
  "WRONG_ITEM",
  "ITEM_DAMAGED",
  "DIFFERENT_DESCRIPTION",
  "MUTUAL_AGREE",
  "OTHER",
  "ITEM_WRONGDAMAGED",
  "CHANGE_MIND",
  "ITEM_MISSING",
  "EXPECTATION_FAILED",
  "ITEM_FAKE",
  "PHYSICAL_DMG",
  "FUNCTIONAL_DMG",
  "SP_DAMAGE",
  "SP_WRONG_ITEM",
  "SP_ITEM_MISSING",
  "SP_COUNTERFEIT",
  "SP_CHANGE_MIND"
];
