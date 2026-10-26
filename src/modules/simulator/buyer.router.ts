import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { hashPassword, verifyPassword } from "../../common/utils/password";

export const buyerRouter = Router();

// ============================================================================
// 1. BUYER AUTHENTICATION (FOR SHOPIZ FRONTEND)
// ============================================================================

/**
 * POST /api/v2/simulator/auth/login
 * Allows buyer login by email, username, or phone number.
 */
buyerRouter.post("/api/v2/simulator/auth/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identity, password } = req.body || {};

    if (!identity || !password) {
      res.json(createShopeeErrorResponse("error_param", "Missing identity or password"));
      return;
    }

    const cleanIdentity = identity.trim().toLowerCase();
    const cleanPhone = cleanIdentity.replace(/[\s().-]/g, "");

    // Search user matching username, email or clean phone
    const user = await prisma.buyerUser.findFirst({
      where: {
        OR: [
          { username: { equals: cleanIdentity, mode: "insensitive" } },
          { email: { equals: cleanIdentity, mode: "insensitive" } },
          { phone: cleanPhone }
        ]
      },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
        }
      }
    });

    if (!user) {
      res.json(createShopeeErrorResponse("error_auth", "User not found"));
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      res.json(createShopeeErrorResponse("error_auth", "Invalid credentials"));
      return;
    }

    let shopName: string | null = null;
    if (user.shopId) {
      const shop = await prisma.shop.findUnique({ where: { shopId: user.shopId } });
      shopName = shop?.shopName || null;
    }

    const token = `sim_jwt_${user.id}_${Date.now()}`;

    res.json(createShopeeSuccessResponse({
      token,
      user: {
        id: Number(user.id),
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatarUrl,
        role: user.role || "buyer",
        shop_id: user.shopId ? Number(user.shopId) : null,
        shop_name: shopName,
        addresses: user.addresses.map((a) => ({
          id: a.id,
          recipient_name: a.recipientName,
          recipient_phone: a.recipientPhone,
          address_line: a.addressLine,
          ward: a.ward,
          district: a.district,
          city: a.city,
          state: a.state,
          zipcode: a.zipcode,
          is_default: a.isDefault
        }))
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Login failed"));
  }
});

/**
 * POST /api/v2/simulator/auth/register
 * Registers a new buyer account with password hashing.
 */
buyerRouter.post("/api/v2/simulator/auth/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name, phone, email } = req.body || {};

    if (!username || !password || !name) {
      res.json(createShopeeErrorResponse("error_param", "Missing username, password or display name"));
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim().replace(/[\s().-]/g, "") : null;
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check existing username
    const existing = await prisma.buyerUser.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone }] : [])
        ]
      }
    });

    if (existing) {
      res.json(createShopeeErrorResponse("error_param", "Username, email, or phone is already registered"));
      return;
    }

    const passwordHash = hashPassword(password);

    const newUser = await prisma.buyerUser.create({
      data: {
        username: cleanUsername,
        name: name.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        passwordHash
      }
    });

    const token = `sim_jwt_${newUser.id}_${Date.now()}`;

    res.json(createShopeeSuccessResponse({
      token,
      user: {
        id: Number(newUser.id),
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        avatar_url: newUser.avatarUrl,
        addresses: []
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Registration failed"));
  }
});

/**
 * POST /api/v2/simulator/auth/forgot_password
 * Mock password reset request returning demo OTP preview.
 */
buyerRouter.post("/api/v2/simulator/auth/forgot_password", async (req: Request, res: Response): Promise<void> => {
  const { identity } = req.body || {};
  if (!identity) {
    res.json(createShopeeErrorResponse("error_param", "Missing identity"));
    return;
  }
  res.json(createShopeeSuccessResponse({
    message: "A password reset link or verification code has been dispatched.",
    otp_preview: "849201"
  }));
});

// ============================================================================
// 2. BUYER PROFILE & ADDRESS BOOK
// ============================================================================

/**
 * GET /api/v2/simulator/buyer/profile
 * Retrieves buyer user profile and their saved addresses.
 */
buyerRouter.get("/api/v2/simulator/buyer/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const buyerIdStr = req.query.buyer_id as string;
    if (!buyerIdStr) {
      res.json(createShopeeErrorResponse("error_param", "Missing buyer_id"));
      return;
    }

    const buyerId = BigInt(buyerIdStr);
    const user = await prisma.buyerUser.findUnique({
      where: { id: buyerId },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
        }
      }
    });

    if (!user) {
      res.json(createShopeeErrorResponse("error_not_found", "Buyer user not found"));
      return;
    }

    let shopName: string | null = null;
    if (user.shopId) {
      const shop = await prisma.shop.findUnique({ where: { shopId: user.shopId } });
      shopName = shop?.shopName || null;
    }

    res.json(createShopeeSuccessResponse({
      user: {
        id: Number(user.id),
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatarUrl,
        role: user.role || "buyer",
        shop_id: user.shopId ? Number(user.shopId) : null,
        shop_name: shopName,
        addresses: user.addresses.map((a) => ({
          id: a.id,
          recipient_name: a.recipientName,
          recipient_phone: a.recipientPhone,
          address_line: a.addressLine,
          ward: a.ward,
          district: a.district,
          city: a.city,
          state: a.state,
          zipcode: a.zipcode,
          is_default: a.isDefault
        }))
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to retrieve profile"));
  }
});

/**
 * PUT /api/v2/simulator/buyer/profile
 * Updates buyer profile (name, email, phone, avatar_url).
 */
buyerRouter.put("/api/v2/simulator/buyer/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const { buyer_id, name, email, phone, avatar_url } = req.body || {};
    if (!buyer_id) {
      res.json(createShopeeErrorResponse("error_param", "Missing buyer_id"));
      return;
    }

    const buyerId = BigInt(buyer_id);
    const updated = await prisma.buyerUser.update({
      where: { id: buyerId },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(email !== undefined ? { email: email ? email.trim() : null } : {}),
        ...(phone !== undefined ? { phone: phone ? phone.trim() : null } : {}),
        ...(avatar_url !== undefined ? { avatarUrl: avatar_url } : {})
      }
    });

    res.json(createShopeeSuccessResponse({
      user: {
        id: Number(updated.id),
        name: updated.name,
        username: updated.username,
        email: updated.email,
        phone: updated.phone,
        avatar_url: updated.avatarUrl
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to update profile"));
  }
});

/**
 * GET /api/v2/simulator/buyer/addresses
 * Retrieves all saved shipping addresses for a buyer.
 */
buyerRouter.get("/api/v2/simulator/buyer/addresses", async (req: Request, res: Response): Promise<void> => {
  try {
    const buyerIdStr = req.query.buyer_id as string;
    if (!buyerIdStr) {
      res.json(createShopeeErrorResponse("error_param", "Missing buyer_id"));
      return;
    }

    const buyerId = BigInt(buyerIdStr);
    const addresses = await prisma.buyerAddress.findMany({
      where: { buyerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });

    res.json(createShopeeSuccessResponse({
      addresses: addresses.map((a) => ({
        id: a.id,
        buyer_id: Number(a.buyerId),
        recipient_name: a.recipientName,
        recipient_phone: a.recipientPhone,
        address_line: a.addressLine,
        ward: a.ward,
        district: a.district,
        city: a.city,
        state: a.state,
        zipcode: a.zipcode,
        is_default: a.isDefault,
        created_at: a.createdAt
      }))
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to retrieve addresses"));
  }
});

/**
 * POST /api/v2/simulator/buyer/addresses
 * Creates a new shipping address for a buyer.
 */
buyerRouter.post("/api/v2/simulator/buyer/addresses", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      buyer_id,
      recipient_name,
      recipient_phone,
      address_line,
      ward,
      district,
      city,
      state,
      zipcode,
      is_default
    } = req.body || {};

    if (!buyer_id || !recipient_name || !recipient_phone || !address_line || !city || !district) {
      res.json(createShopeeErrorResponse("error_param", "Missing required address fields"));
      return;
    }

    const buyerId = BigInt(buyer_id);

    // If marked as default, unset any existing default address
    if (is_default) {
      await prisma.buyerAddress.updateMany({
        where: { buyerId, isDefault: true },
        data: { isDefault: false }
      });
    }

    // If this is the buyer's first address, make it default automatically
    const existingCount = await prisma.buyerAddress.count({ where: { buyerId } });
    const shouldBeDefault = is_default || existingCount === 0;

    const newAddress = await prisma.buyerAddress.create({
      data: {
        buyerId,
        recipientName: recipient_name.trim(),
        recipientPhone: recipient_phone.trim(),
        addressLine: address_line.trim(),
        ward: ward ? ward.trim() : null,
        district: district.trim(),
        city: city.trim(),
        state: state ? state.trim() : city.trim(),
        zipcode: zipcode ? zipcode.trim() : "700000",
        isDefault: shouldBeDefault
      }
    });

    res.json(createShopeeSuccessResponse({
      address: {
        id: newAddress.id,
        buyer_id: Number(newAddress.buyerId),
        recipient_name: newAddress.recipientName,
        recipient_phone: newAddress.recipientPhone,
        address_line: newAddress.addressLine,
        ward: newAddress.ward,
        district: newAddress.district,
        city: newAddress.city,
        state: newAddress.state,
        zipcode: newAddress.zipcode,
        is_default: newAddress.isDefault
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to create address"));
  }
});

/**
 * PUT /api/v2/simulator/buyer/addresses/:id
 * Updates an existing address.
 */
buyerRouter.put("/api/v2/simulator/buyer/addresses/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      buyer_id,
      recipient_name,
      recipient_phone,
      address_line,
      ward,
      district,
      city,
      state,
      zipcode,
      is_default
    } = req.body || {};

    const address = await prisma.buyerAddress.findUnique({ where: { id } });
    if (!address) {
      res.json(createShopeeErrorResponse("error_not_found", "Address not found"));
      return;
    }

    if (buyer_id && BigInt(buyer_id) !== address.buyerId) {
      res.json(createShopeeErrorResponse("error_permission", "Address does not belong to buyer"));
      return;
    }

    if (is_default) {
      await prisma.buyerAddress.updateMany({
        where: { buyerId: address.buyerId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.buyerAddress.update({
      where: { id },
      data: {
        ...(recipient_name ? { recipientName: recipient_name.trim() } : {}),
        ...(recipient_phone ? { recipientPhone: recipient_phone.trim() } : {}),
        ...(address_line ? { addressLine: address_line.trim() } : {}),
        ...(ward !== undefined ? { ward: ward ? ward.trim() : null } : {}),
        ...(district ? { district: district.trim() } : {}),
        ...(city ? { city: city.trim() } : {}),
        ...(state ? { state: state.trim() } : {}),
        ...(zipcode ? { zipcode: zipcode.trim() } : {}),
        ...(is_default !== undefined ? { isDefault: Boolean(is_default) } : {})
      }
    });

    res.json(createShopeeSuccessResponse({
      address: {
        id: updated.id,
        buyer_id: Number(updated.buyerId),
        recipient_name: updated.recipientName,
        recipient_phone: updated.recipientPhone,
        address_line: updated.addressLine,
        ward: updated.ward,
        district: updated.district,
        city: updated.city,
        state: updated.state,
        zipcode: updated.zipcode,
        is_default: updated.isDefault
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to update address"));
  }
});

/**
 * DELETE /api/v2/simulator/buyer/addresses/:id
 * Deletes a saved address.
 */
buyerRouter.delete("/api/v2/simulator/buyer/addresses/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const address = await prisma.buyerAddress.findUnique({ where: { id } });
    if (!address) {
      res.json(createShopeeErrorResponse("error_not_found", "Address not found"));
      return;
    }

    await prisma.buyerAddress.delete({ where: { id } });

    // If deleted address was default, promote another address to default if available
    if (address.isDefault) {
      const nextDefault = await prisma.buyerAddress.findFirst({
        where: { buyerId: address.buyerId },
        orderBy: { createdAt: "desc" }
      });
      if (nextDefault) {
        await prisma.buyerAddress.update({
          where: { id: nextDefault.id },
          data: { isDefault: true }
        });
      }
    }

    res.json(createShopeeSuccessResponse({ deleted: true, address_id: id }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to delete address"));
  }
});

/**
 * POST /api/v2/simulator/buyer/addresses/:id/set_default
 * Sets the target address as default.
 */
buyerRouter.post("/api/v2/simulator/buyer/addresses/:id/set_default", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const address = await prisma.buyerAddress.findUnique({ where: { id } });
    if (!address) {
      res.json(createShopeeErrorResponse("error_not_found", "Address not found"));
      return;
    }

    await prisma.buyerAddress.updateMany({
      where: { buyerId: address.buyerId, isDefault: true },
      data: { isDefault: false }
    });

    const updated = await prisma.buyerAddress.update({
      where: { id },
      data: { isDefault: true }
    });

    res.json(createShopeeSuccessResponse({
      address_id: updated.id,
      is_default: true
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to set default address"));
  }
});
