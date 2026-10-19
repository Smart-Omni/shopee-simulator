/**
 * Shopee Open API v2 Logistics Engine
 * Implements Official Shopee Vietnam Chargeable Weight, Geographic Zone Routing,
 * Carrier Rate Matrices, and Freeship Xtra Platform Subsidy calculations.
 */

export enum ShippingZone {
  INTRA_PROVINCE = "INTRA_PROVINCE", // Same province/city (Nội tỉnh)
  INTRA_REGION = "INTRA_REGION",     // Same macro-region (Nội vùng)
  INTER_REGION = "INTER_REGION"      // Across macro-regions (Liên vùng)
}

export interface WeightCalculationResult {
  actualWeightGram: number;
  volumetricWeightGram: number;
  chargeableWeightGram: number;
}

export interface ShippingRateQuote {
  channelId: number;
  channel_id: number;
  channelName: string;
  channel_name: string;
  serviceType: "standard" | "instant" | "economy";
  service_type: "standard" | "instant" | "economy";
  enabled: boolean;
  disabledReason?: string;
  disabled_reason?: string;
  zone: ShippingZone;
  actualShippingFee: number;
  actual_shipping_fee: number;
  shopeeShippingRebate: number;
  shopee_shipping_rebate: number;
  buyerPaidShippingFee: number;
  buyer_paid_shipping_fee: number;
  estimatedDeliveryDays: string;
  estimated_delivery_days: string;
}

// Vietnam Macro-Region Mapping
const NORTHERN_CITIES = [
  "hà nội", "ha noi", "hanoi", "hải phòng", "hai phong", "bắc ninh", "bac ninh",
  "hưng yên", "hung yen", "hải dương", "hai duong", "quảng ninh", "quang ninh",
  "thái nguyên", "thai nguyen", "nam định", "nam dinh", "ninh bình", "ninh binh",
  "vĩnh phúc", "vinh phuc", "phú thọ", "phu tho", "bắc giang", "bac giang", "hà nam", "ha nam"
];

const CENTRAL_CITIES = [
  "đà nẵng", "da nang", "danang", "thừa thiên huế", "thua thien hue", "huế", "hue",
  "quảng nam", "quang nam", "quảng ngãi", "quang ngai", "bình định", "binh dinh",
  "khánh hòa", "khanh hoa", "nha trang", "nghệ an", "nghe an", "vinh", "hà tĩnh", "ha tinh",
  "thanh hóa", "thanh hoa", "phú yên", "phu yen", "ninh thuận", "ninh thuan", "bình thuận", "binh thuan"
];

const SOUTHERN_CITIES = [
  "hồ chí minh", "ho chi minh", "hcm", "sài gòn", "saigon", "bình dương", "binh duong",
  "đồng nai", "dong nai", "bà rịa", "ba ria", "vũng tàu", "vung tau", "long an",
  "cần thơ", "can tho", "tiền giang", "tien giang", "an giang", "bến tre", "ben tre",
  "đồng tháp", "dong thap", "vĩnh long", "vinh long", "kiên giang", "kien giang",
  "cà mau", "ca mau", "sóc trăng", "soc trang", "bạc liêu", "bac lieu", "trà vinh", "tra vinh",
  "hậu giang", "hau giang", "tây ninh", "tay ninh", "bình phước", "binh phuoc"
];

function removeVietnameseTones(str: string): string {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function normalizeCity(cityStr: string): string {
  return removeVietnameseTones(cityStr || "")
    .trim()
    .toLowerCase()
    .replace(/^(thanh pho|tp\.|tp|tinh|city|province)\s+/i, "")
    .replace(/\s+(city|province)$/i, "")
    .trim();
}

function getMacroRegion(normalizedCity: string): "NORTH" | "CENTRAL" | "SOUTH" | "UNKNOWN" {
  if (NORTHERN_CITIES.some(nc => normalizedCity.includes(nc))) return "NORTH";
  if (CENTRAL_CITIES.some(cc => normalizedCity.includes(cc))) return "CENTRAL";
  if (SOUTHERN_CITIES.some(sc => normalizedCity.includes(sc))) return "SOUTH";
  return "UNKNOWN";
}

export class LogisticsEngine {
  /**
   * Resolves the geographical shipping zone based on Shop warehouse city and Buyer delivery city.
   */
  public static resolveShippingZone(shopCity: string, buyerCity: string): ShippingZone {
    const s = normalizeCity(shopCity);
    const b = normalizeCity(buyerCity);

    // Exact city match or both contain matching root
    if (s === b || (s.includes(b) && b.length > 3) || (b.includes(s) && s.length > 3)) {
      return ShippingZone.INTRA_PROVINCE;
    }

    const shopRegion = getMacroRegion(s);
    const buyerRegion = getMacroRegion(b);

    if (shopRegion !== "UNKNOWN" && buyerRegion !== "UNKNOWN" && shopRegion === buyerRegion) {
      return ShippingZone.INTRA_REGION;
    }

    return ShippingZone.INTER_REGION;
  }

  /**
   * Calculates actual scale weight and volumetric weight:
   * Volumetric Weight (grams) = (Length * Width * Height) / 5
   * Chargeable Weight = max(actual, volumetric)
   */
  public static calculatePackageWeight(
    items: Array<{
      weightKg?: number | string | null;
      dimensions?: { length?: number; width?: number; height?: number } | null;
      quantity: number;
    }>
  ): WeightCalculationResult {
    let totalActualGrams = 0;
    let totalVolumetricGrams = 0;

    for (const it of items) {
      const qty = Math.max(1, Number(it.quantity || 1));
      const unitWeightGrams = Math.max(50, Math.round(Number(it.weightKg || 0.5) * 1000));
      totalActualGrams += unitWeightGrams * qty;

      const dims: any = it.dimensions || {};
      const l = Math.max(1, Number(dims.package_length || dims.length || 20));
      const w = Math.max(1, Number(dims.package_width || dims.width || 15));
      const h = Math.max(1, Number(dims.package_height || dims.height || 10));

      // Volumetric weight per item: (L * W * H) / 5 in grams
      const unitVolumetricGrams = Math.round((l * w * h) / 5);
      totalVolumetricGrams += unitVolumetricGrams * qty;
    }

    const chargeableWeightGram = Math.max(totalActualGrams, totalVolumetricGrams);

    return {
      actualWeightGram: totalActualGrams,
      volumetricWeightGram: totalVolumetricGrams,
      chargeableWeightGram
    };
  }

  /**
   * Calculates Shopee Freeship Xtra platform subsidy based on package items subtotal.
   * - Subtotal >= 300k: offset up to 30k
   * - Subtotal >= 150k: offset up to 15k
   * - Clamped to actual shipping fee
   */
  public static calculateFreeshipRebate(subtotal: number, actualShippingFee: number): number {
    let maxRebate = 0;
    if (subtotal >= 300000) {
      maxRebate = 30000;
    } else if (subtotal >= 150000) {
      maxRebate = 15000;
    }
    return Math.min(maxRebate, actualShippingFee);
  }

  /**
   * Calculates shipping fee rate for a given carrier channel, zone, and weight.
   */
  public static calculateChannelFee(
    channelId: number,
    zone: ShippingZone,
    chargeableWeightGram: number
  ): { actualFee: number; enabled: boolean; disabledReason?: string; carrierName: string; serviceType: "standard" | "instant" | "economy"; estimatedDays: string } {
    switch (channelId) {
      // 1. SPX Express (Standard Delivery)
      case 30001:
      case 18080: {
        let baseFee = 16500;
        let stepFee = 2500;
        let estimatedDays = "1-2 days";

        if (zone === ShippingZone.INTRA_REGION) {
          baseFee = 22000;
          stepFee = 3500;
          estimatedDays = "2-3 days";
        } else if (zone === ShippingZone.INTER_REGION) {
          baseFee = 32000;
          stepFee = 5000;
          estimatedDays = "3-4 days";
        }

        // Base covers up to 500g. Additional 500g step.
        const additionalSteps = Math.max(0, Math.ceil((chargeableWeightGram - 500) / 500));
        const actualFee = baseFee + (additionalSteps * stepFee);

        return {
          actualFee,
          enabled: true,
          carrierName: "SPX Express",
          serviceType: "standard",
          estimatedDays
        };
      }

      // 2. SPX Instant (Hỏa Tốc) - Strictly Same City Only!
      case 30002:
      case 18081: {
        if (zone !== ShippingZone.INTRA_PROVINCE) {
          return {
            actualFee: 0,
            enabled: false,
            disabledReason: "SPX Instant (Hỏa Tốc) is only available for same-city delivery.",
            carrierName: "SPX Instant (Hỏa Tốc)",
            serviceType: "instant",
            estimatedDays: "N/A"
          };
        }

        if (chargeableWeightGram > 5000) {
          return {
            actualFee: 0,
            enabled: false,
            disabledReason: "Package exceeds SPX Instant maximum weight limit (5kg).",
            carrierName: "SPX Instant (Hỏa Tốc)",
            serviceType: "instant",
            estimatedDays: "N/A"
          };
        }

        // Base 25,000 VND for up to 2,000g, +10,000 VND per additional 1,000g
        const additionalKg = Math.max(0, Math.ceil((chargeableWeightGram - 2000) / 1000));
        const actualFee = 25000 + (additionalKg * 10000);

        return {
          actualFee,
          enabled: true,
          carrierName: "SPX Instant (Hỏa Tốc)",
          serviceType: "instant",
          estimatedDays: "2 hours"
        };
      }

      // 3. SPX Economy (Tiết Kiệm)
      case 30003:
      case 18082:
      default: {
        let baseFee = 13000;
        let stepFee = 2000;
        let estimatedDays = "3-4 days";

        if (zone === ShippingZone.INTRA_REGION) {
          baseFee = 18000;
          stepFee = 3000;
          estimatedDays = "4-5 days";
        } else if (zone === ShippingZone.INTER_REGION) {
          baseFee = 25000;
          stepFee = 4000;
          estimatedDays = "5-7 days";
        }

        // Base covers up to 1,000g. Additional 1,000g step.
        const additionalSteps = Math.max(0, Math.ceil((chargeableWeightGram - 1000) / 1000));
        const actualFee = baseFee + (additionalSteps * stepFee);

        return {
          actualFee,
          enabled: true,
          carrierName: "SPX Economy (Tiết Kiệm)",
          serviceType: "economy",
          estimatedDays
        };
      }
    }
  }

  /**
   * Generates complete rate quotes across all available carrier channels for a package.
   */
  public static quoteAllChannels(
    shopCity: string,
    buyerCity: string,
    chargeableWeightGram: number,
    subtotal: number
  ): ShippingRateQuote[] {
    const zone = this.resolveShippingZone(shopCity, buyerCity);
    const channelIds = [30001, 30002, 30003];

    return channelIds.map(chId => {
      const calc = this.calculateChannelFee(chId, zone, chargeableWeightGram);
      const rebate = calc.enabled ? this.calculateFreeshipRebate(subtotal, calc.actualFee) : 0;
      const buyerPaid = calc.enabled ? Math.max(0, calc.actualFee - rebate) : 0;

      return {
        channelId: chId,
        channel_id: chId,
        channelName: calc.carrierName,
        channel_name: calc.carrierName,
        serviceType: calc.serviceType,
        service_type: calc.serviceType,
        enabled: calc.enabled,
        disabledReason: calc.disabledReason,
        disabled_reason: calc.disabledReason,
        zone,
        actualShippingFee: calc.actualFee,
        actual_shipping_fee: calc.actualFee,
        shopeeShippingRebate: rebate,
        shopee_shipping_rebate: rebate,
        buyerPaidShippingFee: buyerPaid,
        buyer_paid_shipping_fee: buyerPaid,
        estimatedDeliveryDays: calc.estimatedDays,
        estimated_delivery_days: calc.estimatedDays
      };
    });
  }
}
