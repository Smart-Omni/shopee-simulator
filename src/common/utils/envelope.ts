import { v4 as uuidv4 } from "uuid";

export interface ShopeeResponse<T = any> {
  error: string;
  message: string;
  response?: T;
  request_id: string;
}

export function createShopeeSuccessResponse<T>(data: T, requestId?: string): ShopeeResponse<T> {
  return {
    error: "",
    message: "",
    response: data,
    request_id: requestId || uuidv4().replace(/-/g, "")
  };
}

export function createShopeeErrorResponse(
  errorCode: string,
  message: string,
  requestId?: string
): ShopeeResponse {
  return {
    error: errorCode,
    message: message,
    request_id: requestId || uuidv4().replace(/-/g, "")
  };
}
