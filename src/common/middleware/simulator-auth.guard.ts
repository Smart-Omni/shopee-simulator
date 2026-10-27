import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { createShopeeErrorResponse } from "../utils/envelope";

export interface SimulatorAuthGuardOptions {
  role?: "buyer" | "seller";
  optional?: boolean;
}

/**
 * Simulator Authentication Guard for Layer B Simulator Routes.
 * Validates 'Authorization: Bearer sim_jwt_<userId>_<timestamp>'
 */
export function simulatorAuthGuard(options: SimulatorAuthGuardOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (options.optional) {
        next();
        return;
      }
      res.status(401).json(createShopeeErrorResponse("error_auth", "Authentication token required"));
      return;
    }

    const token = authHeader.slice(7).trim();
    const match = token.match(/^sim_jwt_(\d+)_/);

    if (!match) {
      if (options.optional) {
        next();
        return;
      }
      res.status(401).json(createShopeeErrorResponse("error_auth", "Invalid authentication token"));
      return;
    }

    try {
      const userId = BigInt(match[1]);
      const user = await prisma.buyerUser.findUnique({ where: { id: userId } });

      if (!user) {
        if (options.optional) {
          next();
          return;
        }
        res.status(401).json(createShopeeErrorResponse("error_auth", "Authenticated user not found"));
        return;
      }

      if (options.role && user.role !== options.role) {
        res.status(403).json(createShopeeErrorResponse("error_permission", `Action requires '${options.role}' role`));
        return;
      }

      (req as any).simulatorUser = user;
      next();
    } catch (err: any) {
      res.status(500).json(createShopeeErrorResponse("error_server", err.message || "Failed to authenticate token"));
    }
  };
}
