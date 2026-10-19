/**
 * Generate a valid standard PDF 1.4 binary buffer for Shopee Airway Bill (AWB)
 * Completely self-contained with zero external dependencies.
 */
export function generateShopeeAwbPdf(params: {
  orderSn: string;
  trackingNumber: string;
  shippingCarrier: string;
  recipientName: string;
  recipientAddress: string;
  packageNumber?: string;
}): Buffer {
  const {
    orderSn,
    trackingNumber,
    shippingCarrier,
    recipientName,
    recipientAddress,
    packageNumber = "PKG-STANDARD"
  } = params;

  // Stream content drawing shipping label
  const streamLines = [
    "BT",
    "/F1 20 Tf",
    "50 740 Td",
    "(SHOPEE AIRWAY BILL - OFFICIAL TEST SIMULATOR) Tj",
    "/F1 12 Tf",
    "0 -30 Td",
    `(${escapePdfText("CARRIER: " + shippingCarrier)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("TRACKING NUMBER: " + trackingNumber)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("ORDER SN: " + orderSn)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("PACKAGE NO: " + packageNumber)}) Tj`,
    "0 -30 Td",
    "/F1 14 Tf",
    "(RECIPIENT INFORMATION:) Tj",
    "/F1 11 Tf",
    "0 -20 Td",
    `(${escapePdfText("Name: " + recipientName)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("Address: " + recipientAddress)}) Tj`,
    "0 -40 Td",
    "/F1 10 Tf",
    "(========================================================================) Tj",
    "0 -20 Td",
    "([BARCODE PLACEHOLDER: *" + escapePdfText(trackingNumber) + "*]) Tj",
    "0 -20 Td",
    "(========================================================================) Tj",
    "0 -30 Td",
    "(SMARTOMNI CHANNEL TEST PRINT - SHOPEE OPEN API V2 SIMULATOR) Tj",
    "ET"
  ];

  const streamContent = streamLines.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  // Build PDF Objects
  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n";
  const obj4 = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;
  const obj5 = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";

  const header = "%PDF-1.4\n";

  let offset = header.length;
  const offset1 = offset;
  offset += obj1.length;
  const offset2 = offset;
  offset += obj2.length;
  const offset3 = offset;
  offset += obj3.length;
  const offset4 = offset;
  offset += obj4.length;
  const offset5 = offset;
  offset += obj5.length;

  const xrefOffset = offset;
  const pad = (num: number) => String(num).padStart(10, "0");

  const xref =
    "xref\n0 6\n" +
    "0000000000 65535 f \n" +
    `${pad(offset1)} 00000 n \n` +
    `${pad(offset2)} 00000 n \n` +
    `${pad(offset3)} 00000 n \n` +
    `${pad(offset4)} 00000 n \n` +
    `${pad(offset5)} 00000 n \n`;

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;
  return Buffer.from(fullPdf, "utf-8");
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
