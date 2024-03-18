import AppError from "@/utils/appError";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Define a Zod schema for the allowed symbols
const AllowedSymbols = z.enum(["BTC", "ETH", "USD", "EUR"]);

// Middleware function to validate the symbol
const validateSymbol = (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.body;
  try {
    // Validate the symbol against the schema
    AllowedSymbols.parse(symbol).toUpperCase();
    next();
  } catch (error) {
    return next(new AppError(`${symbol} Invalid asset symbol`, 400, "error"));
  }
};

export default validateSymbol;
