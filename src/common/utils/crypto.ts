import * as crypto from "crypto";

export function calculateHmacSha256(secretKey: string, message: string): string {
  return crypto.createHmac("sha256", secretKey).update(message).digest("hex");
}

export function buildBaseString(
  partnerId: string | number,
  apiPath: string,
  timestamp: string | number,
  accessToken?: string,
  shopId?: string | number,
  merchantId?: string | number
): string {
  if (accessToken && shopId) {
    return `${partnerId}${apiPath}${timestamp}${accessToken}${shopId}`;
  }
  if (accessToken && merchantId) {
    return `${partnerId}${apiPath}${timestamp}${accessToken}${merchantId}`;
  }
  return `${partnerId}${apiPath}${timestamp}`;
}

export function verifyShopeeSignature(
  partnerKey: string,
  partnerId: string | number,
  apiPath: string,
  timestamp: string | number,
  incomingSign: string,
  accessToken?: string,
  shopId?: string | number,
  merchantId?: string | number
): boolean {
  const baseString = buildBaseString(
    partnerId,
    apiPath,
    timestamp,
    accessToken,
    shopId,
    merchantId
  );
  const calculatedSign = calculateHmacSha256(partnerKey, baseString);
  return calculatedSign.toLowerCase() === incomingSign.toLowerCase();
}
