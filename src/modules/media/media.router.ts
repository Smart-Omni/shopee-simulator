import { Router, Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { storageService } from "../../common/storage/storage.service";

export const mediaRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB to allow high-res photos and short video clips
  }
});

// ============================================================================
// 1. OFFICIAL LAYER A: UPLOAD IMAGE (POST /api/v2/media_space/upload_image)
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

    try {
      const uploadResult = await storageService.uploadFile(req.file);

      // Generate realistic Shopee image ID format: vn-11134201-7rd5z-<random>
      const randomSuffix = uuidv4().replace(/-/g, "").slice(0, 16);
      const imageId = `vn-11134201-7rd5z-${randomSuffix}`;

      const response = {
        image_info: {
          image_id: imageId,
          storage_url: uploadResult.url,
          provider: uploadResult.provider,
          image_url_list: [
            {
              image_url_region: "VN",
              image_url: uploadResult.url
            },
            {
              image_url_region: "SG",
              image_url: uploadResult.url
            }
          ]
        }
      };

      res.json(createShopeeSuccessResponse(response));
    } catch (err: any) {
      res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to upload image"));
    }
  }
);

// ============================================================================
// 2. SIMULATOR PUBLIC HELPER: SINGLE MEDIA UPLOAD (FOR SHOPIZ / DISPUTES / REVIEWS)
// POST /api/v2/simulator/media/upload
// ============================================================================
mediaRouter.post(
  "/api/v2/simulator/media/upload",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.json(createShopeeErrorResponse("error_param", "Missing file in multipart/form-data (field name: 'file')"));
        return;
      }

      // Validate allowed mime types (images and videos)
      const allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo"
      ];

      if (!allowedMimes.includes(file.mimetype.toLowerCase())) {
        res.json(createShopeeErrorResponse("error_param", `Unsupported media type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV.`));
        return;
      }

      const result = await storageService.uploadFile(file);

      res.json(createShopeeSuccessResponse({
        url: result.url,
        file_id: result.fileId,
        file_name: result.fileName,
        mime_type: result.mimeType,
        size: result.size,
        provider: result.provider,
        web_view_link: result.webViewLink,
        web_content_link: result.webContentLink
      }));
    } catch (err: any) {
      res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to upload media to cloud"));
    }
  }
);

// ============================================================================
// 3. SIMULATOR PUBLIC HELPER: BATCH MEDIA UPLOAD
// POST /api/v2/simulator/media/upload_multiple
// ============================================================================
mediaRouter.post(
  "/api/v2/simulator/media/upload_multiple",
  upload.array("files", 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.json(createShopeeErrorResponse("error_param", "Missing files in multipart/form-data (field name: 'files')"));
        return;
      }

      const uploadPromises = files.map(f => storageService.uploadFile(f));
      const results = await Promise.all(uploadPromises);

      res.json(createShopeeSuccessResponse({
        total: results.length,
        files: results.map(r => ({
          url: r.url,
          file_id: r.fileId,
          file_name: r.fileName,
          mime_type: r.mimeType,
          size: r.size,
          provider: r.provider
        }))
      }));
    } catch (err: any) {
      res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to batch upload media"));
    }
  }
);
