import { Router, Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";

export const mediaRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB per Shopee doc
  }
});

// ============================================================================
// UPLOAD IMAGE: POST /api/v2/media_space/upload_image
// ============================================================================
mediaRouter.post(
  "/api/v2/media_space/upload_image",
  shopeeAuthGuard,
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.json(createShopeeErrorResponse("error_param", "Missing image file in multipart/form-data"));
      return;
    }

    // Generate realistic Shopee image ID format: vn-11134201-7rd5z-<random>
    const randomSuffix = uuidv4().replace(/-/g, "").slice(0, 16);
    const imageId = `vn-11134201-7rd5z-${randomSuffix}`;

    const response = {
      image_info: {
        image_id: imageId,
        image_url_list: [
          {
            image_url_region: "VN",
            image_url: `https://cf.shopee.vn/file/${imageId}`
          },
          {
            image_url_region: "SG",
            image_url: `https://cf.shopee.sg/file/${imageId}`
          }
        ]
      }
    };

    res.json(createShopeeSuccessResponse(response));
  }
);
