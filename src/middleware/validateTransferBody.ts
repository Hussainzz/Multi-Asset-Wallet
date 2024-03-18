import AppError from "@/utils/appError";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const WalletTransferSchema = z.object({
  symbol: z.enum(["BTC", "ETH", "USD", "EUR"]),
  walletId: z.number(),
  amount: z.number().min(1),
  transferTo: z.number(),
});

// Middleware function to validate the symbol
const validateTransferBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { symbol, walletId, amount, transferTo } = req.body;
  try {
    // Validate the symbol against the schema
    WalletTransferSchema.parse({ symbol, walletId, amount, transferTo });
    next();
  } catch (error) {
    return next(new AppError(`Bad Request`, 400, "error"));
  }
};

export default validateTransferBody;
