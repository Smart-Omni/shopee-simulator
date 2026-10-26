import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger/swagger.spec";
import { authRouter } from "./modules/auth/auth.router";
import { shopRouter } from "./modules/shop/shop.router";
import { mediaRouter } from "./modules/media/media.router";
import { productRouter } from "./modules/product/product.router";
import { orderRouter } from "./modules/order/order.router";
import { logisticsRouter } from "./modules/logistics/logistics.router";
import { webhookRouter } from "./modules/webhook/webhook.router";
import { simulatorRouter } from "./modules/simulator/simulator.router";
import { discountRouter } from "./modules/discount/discount.router";
import { voucherRouter } from "./modules/voucher/voucher.router";
import { chatRouter } from "./modules/chat/chat.router";
import { sellerchatRouter } from "./modules/chat/sellerchat.router";
import { paymentRouter } from "./modules/payment/payment.router";
import { returnsRouter } from "./modules/returns/returns.router";
import { buyerRouter } from "./modules/simulator/buyer.router";
import { createShopeeErrorResponse } from "./common/utils/envelope";
import path from "path";

dotenv.config();

// ----------------------------------------------------------------------------
// CRITICAL POLYFILL: Enable BigInt JSON serialization
// ----------------------------------------------------------------------------
(BigInt.prototype as any).toJSON = function () {
  const intVal = Number(this);
  return Number.isSafeInteger(intVal) ? intVal : this.toString();
};

export const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Testing UI
app.use(express.static(path.join(__dirname, "../public")));

// Root and UI routes
app.get(["/", "/ui", "/console"], (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "shopee-simulator", timestamp: Math.floor(Date.now() / 1000) });
});

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (_req: Request, res: Response) => {
  res.json(swaggerDocument);
});

// Mount Module Routers
app.use(authRouter);
app.use(shopRouter);
app.use(mediaRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(logisticsRouter);
app.use(webhookRouter);
app.use(discountRouter);
app.use(voucherRouter);
app.use(chatRouter);
app.use(sellerchatRouter);
app.use(paymentRouter);
app.use(returnsRouter);
app.use(simulatorRouter);
app.use(buyerRouter);

// Global Error Handler (Shopee Envelope Format)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Internal server error"));
});

// Start server if executed directly (not when imported in tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`[Shopee Simulator] Server running on http://localhost:${port}`);
    console.log(`[Shopee Simulator] Swagger documentation available at http://localhost:${port}/docs`);
  });
}
