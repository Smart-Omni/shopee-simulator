/**
 * Generate valid standard PDF 1.4 binary buffers for Shopee Airway Bill (AWB),
 * Picking Lists, Packing Lists, and Handover Manifests.
 * Completely self-contained with zero external dependencies.
 */

export interface AwbItemParams {
  orderSn: string;
  trackingNumber: string;
  shippingCarrier: string;
  recipientName: string;
  recipientAddress: string;
  packageNumber?: string;
  items?: Array<{ itemName: string; modelName?: string; quantity: number }>;
}

export interface HandoverManifestParams {
  shopName: string;
  shippingCarrier: string;
  createDate?: string;
  orders: Array<{
    orderSn: string;
    trackingNumber: string;
    recipientName: string;
    itemsCount: number;
  }>;
}

/**
 * Single-page AWB generator (kept for backward compatibility)
 */
export function generateShopeeAwbPdf(params: AwbItemParams): Buffer {
  return generateMultiPageShopeePdf([params], { printFormat: "normal" });
}

/**
 * Multi-page AWB / Shipping Document generator
 */
export function generateMultiPageShopeePdf(
  items: AwbItemParams[],
  options: { printFormat?: "normal" | "thermal"; docType?: string } = {}
): Buffer {
  const isThermal = options.printFormat === "thermal";
  const mediaBox = isThermal ? "[0 0 283 425]" : "[0 0 612 792]";
  const docTypeLabel =
    options.docType === "picking_list"
      ? "PHIEU XUAT HANG (PICKING LIST)"
      : options.docType === "packing_list"
      ? "PHIEU DONG GOI (PACKING LIST)"
      : "SHOPEE AIRWAY BILL (AWB)";

  // If no items, generate a placeholder page
  const list = items.length > 0 ? items : [{
    orderSn: "N/A",
    trackingNumber: "N/A",
    shippingCarrier: "Shopee Xpress",
    recipientName: "N/A",
    recipientAddress: "N/A"
  }];

  const pagesCount = list.length;
  // Object IDs layout:
  // 1: Catalog
  // 2: Pages root
  // 3: Shared Font
  // For each page i (0 <= i < pagesCount):
  // Page object ID: 4 + i * 2
  // Content object ID: 4 + i * 2 + 1
  const fontObjId = 3;
  const pageKidsRefs: string[] = [];

  const pageObjects: string[] = [];
  const contentObjects: string[] = [];

  for (let i = 0; i < pagesCount; i++) {
    const pageObjId = 4 + i * 2;
    const contentObjId = pageObjId + 1;
    pageKidsRefs.push(`${pageObjId} 0 R`);

    const item = list[i];
    const streamContent = isThermal
      ? buildThermalStreamContent(item, docTypeLabel)
      : buildNormalStreamContent(item, docTypeLabel);
    const streamLength = Buffer.byteLength(streamContent, "utf-8");

    pageObjects.push(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox ${mediaBox} /Contents ${contentObjId} 0 R /Resources << /Font << /F1 ${fontObjId} 0 R >> >> >>\nendobj\n`
    );

    contentObjects.push(
      `${contentObjId} 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`
    );
  }

  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [${pageKidsRefs.join(" ")}] /Count ${pagesCount} >>\nendobj\n`;
  const obj3 = `${fontObjId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  const header = "%PDF-1.4\n";
  const objects: { id: number; body: string }[] = [
    { id: 1, body: obj1 },
    { id: 2, body: obj2 },
    { id: 3, body: obj3 },
  ];

  for (let i = 0; i < pagesCount; i++) {
    objects.push({ id: 4 + i * 2, body: pageObjects[i] });
    objects.push({ id: 4 + i * 2 + 1, body: contentObjects[i] });
  }

  return assemblePdfBuffer(header, objects);
}

/**
 * Handover Manifest PDF generator (Biên bản bàn giao đơn hàng)
 */
export function generateShopeeHandoverManifestPdf(params: HandoverManifestParams): Buffer {
  const {
    shopName,
    shippingCarrier,
    createDate = new Date().toLocaleDateString("vi-VN"),
    orders
  } = params;

  const streamLines = [
    "BT",
    "/F1 18 Tf",
    "50 740 Td",
    "(SHOPEE VIETNAM - BIEN BAN BAN GIAO HANG HOA) Tj",
    "/F1 11 Tf",
    "0 -25 Td",
    `(${escapePdfText("Shop: " + shopName)} | ${escapePdfText("Don vi van chuyen: " + shippingCarrier)}) Tj`,
    "0 -18 Td",
    `(${escapePdfText("Ngay in: " + createDate)} | ${escapePdfText("Tong so don: " + orders.length)}) Tj`,
    "0 -25 Td",
    "/F1 10 Tf",
    "(----------------------------------------------------------------------------------------------------) Tj",
    "0 -15 Td",
    "(STT   MA DON HANG         MA VAN DON           NGUOI NHAN          SO SP   CHU KY NGUOI NHAN) Tj",
    "0 -15 Td",
    "(----------------------------------------------------------------------------------------------------) Tj",
  ];

  orders.slice(0, 25).forEach((order, index) => {
    const idxStr = String(index + 1).padEnd(4, " ");
    const snStr = (order.orderSn || "").padEnd(28, " ");
    const trkStr = (order.trackingNumber || "").padEnd(20, " ");
    const recStr = (order.recipientName || "").slice(0, 18).padEnd(20, " ");
    const countStr = String(order.itemsCount || 1).padEnd(6, " ");
    const row = `${idxStr}${snStr}${trkStr}${recStr}${countStr}[       ]`;

    streamLines.push("0 -18 Td");
    streamLines.push(`(${escapePdfText(row)}) Tj`);
  });

  streamLines.push(
    "0 -30 Td",
    "(----------------------------------------------------------------------------------------------------) Tj",
    "0 -30 Td",
    "/F1 11 Tf",
    "(      XAC NHAN CUA BEN GIAO (SHOP)                 XAC NHAN CUA BEN NHAN (BUU TA)) Tj",
    "0 -20 Td",
    "(          (Ky va ghi ro ho ten)                         (Ky va ghi ro ho ten)) Tj",
    "ET"
  );

  const streamContent = streamLines.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n";
  const obj3 = "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
  const obj4 = "4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 3 0 R >> >> >>\nendobj\n";
  const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const header = "%PDF-1.4\n";
  return assemblePdfBuffer(header, [
    { id: 1, body: obj1 },
    { id: 2, body: obj2 },
    { id: 3, body: obj3 },
    { id: 4, body: obj4 },
    { id: 5, body: obj5 },
  ]);
}

function buildNormalStreamContent(item: AwbItemParams, docTypeLabel: string): string {
  const {
    orderSn,
    trackingNumber,
    shippingCarrier,
    recipientName,
    recipientAddress,
    packageNumber = "PKG-STANDARD"
  } = item;

  const streamLines = [
    "BT",
    "/F1 18 Tf",
    "50 740 Td",
    `(${escapePdfText(docTypeLabel)}) Tj`,
    "/F1 12 Tf",
    "0 -30 Td",
    `(${escapePdfText("DON VI VAN CHUYEN: " + shippingCarrier)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("MA VAN DON: " + trackingNumber)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("MA DON HANG: " + orderSn)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("MA KIEN HANG: " + packageNumber)}) Tj`,
    "0 -30 Td",
    "/F1 13 Tf",
    "(THONG TIN NGUOI NHAN:) Tj",
    "/F1 11 Tf",
    "0 -20 Td",
    `(${escapePdfText("Ten: " + recipientName)}) Tj`,
    "0 -20 Td",
    `(${escapePdfText("Dia chi: " + recipientAddress)}) Tj`,
    "0 -35 Td",
    "/F1 10 Tf",
    "(========================================================================) Tj",
    "0 -20 Td",
    "([BARCODE PLACEHOLDER: *" + escapePdfText(trackingNumber) + "*]) Tj",
    "0 -20 Td",
    "(========================================================================) Tj",
    "0 -30 Td",
    "(SMARTOMNI CHANNEL - SHOPEE OPEN API V2 SIMULATOR MASS SHIP) Tj",
    "ET"
  ];
  return streamLines.join("\n");
}

function buildThermalStreamContent(item: AwbItemParams, docTypeLabel: string): string {
  const {
    orderSn,
    trackingNumber,
    shippingCarrier,
    recipientName,
    recipientAddress
  } = item;

  const streamLines = [
    "BT",
    "/F1 12 Tf",
    "15 400 Td",
    `(${escapePdfText(docTypeLabel.slice(0, 24))}) Tj`,
    "/F1 10 Tf",
    "0 -20 Td",
    `(${escapePdfText("DVVC: " + shippingCarrier)}) Tj`,
    "0 -18 Td",
    `(${escapePdfText("MA VAN DON: " + trackingNumber)}) Tj`,
    "0 -18 Td",
    `(${escapePdfText("DON HANG: " + orderSn)}) Tj`,
    "0 -22 Td",
    "/F1 9 Tf",
    `(${escapePdfText("Nguoi nhan: " + recipientName)}) Tj`,
    "0 -15 Td",
    `(${escapePdfText("Dia chi: " + recipientAddress.slice(0, 36))}) Tj`,
    "0 -25 Td",
    "/F1 9 Tf",
    "(---------------------------------------------------) Tj",
    "0 -15 Td",
    "([BARCODE: *" + escapePdfText(trackingNumber) + "*]) Tj",
    "0 -15 Td",
    "(---------------------------------------------------) Tj",
    "0 -20 Td",
    "(SHOPEE MASS SHIP - THERMAL 100x150) Tj",
    "ET"
  ];
  return streamLines.join("\n");
}

function assemblePdfBuffer(header: string, objects: { id: number; body: string }[]): Buffer {
  let offset = header.length;
  const offsets: number[] = [];

  let body = "";
  for (const obj of objects) {
    offsets[obj.id] = offset;
    body += obj.body;
    offset += obj.body.length;
  }

  const xrefOffset = offset;
  const pad = (num: number) => String(num).padStart(10, "0");

  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += `${pad(offsets[i] || 0)} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(header + body + xref + trailer, "utf-8");
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
