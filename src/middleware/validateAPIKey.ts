import prisma from "@/prisma";
import AppError from "@/utils/appError";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";


const APIKeySchema = z
  .object({
    "wallet-x-key": z.string().trim().min(1),
  })
  .required();

// Middleware function to validate the symbol
const validateAPIKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validator = APIKeySchema.safeParse(req.headers);
    if (!validator.success || !validator.data["wallet-x-key"]) {
      return next(
        new AppError(`Invalid API Key`, StatusCodes.UNAUTHORIZED, "error")
      );
    }

    const apiKey = validator.data["wallet-x-key"] ?? "";
    const user = await prisma.user.findUnique({
      where: { apiKey },
      select: { id: true, email: true },
    });

    if (!user) {
      return next(
        new AppError(`Invalid API Key`, StatusCodes.UNAUTHORIZED, "error")
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    return next(
      new AppError(`Error`, StatusCodes.INTERNAL_SERVER_ERROR, "error")
    );
  }
};

export default validateAPIKey;
