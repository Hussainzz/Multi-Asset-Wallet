import catchAsync from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "@/utils/appError";
import { getAssetBalance, getAssetBySymbol } from "@/resources/assets.resource";
import { transactionQueue } from "@/utils/queue";
import { getAllTransactions } from "@/resources/transfer.resource";



export const getWalletTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let c: string | null = req.query.c as string | null ?? null;
    let limit: string | null = req.query.limit as string | null ?? null;
    let {walletId} = req.params;

    let allTxs: TransactionLogsResponse = {
      logs: [],
      cursor: null,
    };

      if (!limit) {
        limit = "10";
      }
      allTxs = await getAllTransactions(
        parseInt(walletId),
        parseInt(limit),
        c ? parseInt(c) : null
      );

      res.json(allTxs);
    }
);

export const transferFunds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { symbol, walletId, amount, transferTo } = req.body;

    let assetInfo: AppAsset | null = await getAssetBySymbol(symbol);
    if (!assetInfo) {
      return next(
        new AppError("Asset not found", StatusCodes.NOT_FOUND, "error")
      );
    }

    const currentAssetBalance = await getAssetBalance(
      userId,
      walletId,
      assetInfo.id
    );
    if (!currentAssetBalance) {
      return next(
        new AppError(
          "Asset not found in wallet",
          StatusCodes.NOT_FOUND,
          "error"
        )
      );
    }

    if (parseInt(amount) <= currentAssetBalance.amount) {
      await transactionQueue.add({
        actionType: "transfer-funds",
        balanceId: currentAssetBalance.balanceId,
        amountToTransfer: amount,
        transferTo,
        assetInfo,
      });
    } else {
      next(new AppError("Insufficient Funds!", StatusCodes.BAD_REQUEST));
      return;
    }
    res.json({
      status: "success",
      message: "Transaction Transfer Requested!",
    });
  }
);

export const withdrawFunds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { symbol, walletId, amount } = req.body;

    let assetInfo: AppAsset | null = await getAssetBySymbol(symbol);
    if (!assetInfo) {
      return next(
        new AppError("Asset not found", StatusCodes.NOT_FOUND, "error")
      );
    }

    const currentAssetBalance = await getAssetBalance(
      userId,
      walletId,
      assetInfo.id
    );
    if (!currentAssetBalance) {
      return next(
        new AppError(
          "Asset not found in wallet",
          StatusCodes.NOT_FOUND,
          "error"
        )
      );
    }

    if (parseInt(amount) > currentAssetBalance.amount) {
      return next(new AppError("Insufficient Funds!", StatusCodes.BAD_REQUEST));
    }

    await transactionQueue.add({
      actionType: "withdraw-funds",
      balanceId: currentAssetBalance.balanceId,
      amountToWithdraw: amount,
      assetInfo,
    });

    res.json({
      status: "success",
      message: "Withdraw Requested, Will be processed shortly.",
    });
  }
);
