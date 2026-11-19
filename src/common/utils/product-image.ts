/**
 * Safely extracts the primary image URL from product imagesJson.
 */
export function extractProductImage(product: any): string {
  const imgJson = product?.imagesJson;
  if (!imgJson) return "";
  if (Array.isArray(imgJson)) {
    const first = imgJson[0];
    return typeof first === "string" ? first : (first?.url || first?.image_url || "");
  }
  if (Array.isArray(imgJson.image_url_list) && imgJson.image_url_list.length > 0) {
    return imgJson.image_url_list[0] || "";
  }
  if (Array.isArray(imgJson.images) && imgJson.images.length > 0) {
    const first = imgJson.images[0];
    return typeof first === "string" ? first : (first?.url || "");
  }
  if (typeof imgJson.url === "string") return imgJson.url;
  if (typeof imgJson.image_url === "string") return imgJson.image_url;
  return "";
}
