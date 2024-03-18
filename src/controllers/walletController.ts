import catchAsync from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import AppError from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { createWallet, getUserWalletWithAssetBalances } from "@/resources/wallet.resource";
import { getAssetBySymbol } from "@/resources/assets.resource";

export const createUserWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {walletName} = req.body;
    const userId = req.user.id;

    if(!walletName) {
      return next(
        new AppError(`Wallet name required`, StatusCodes.BAD_REQUEST, "error")
      );
    }

    const wallet = await createWallet(walletName, userId);
    const walletCreated = wallet?.id;
    res
      .status(
        walletCreated ? StatusCodes.CREATED : StatusCodes.INTERNAL_SERVER_ERROR
      )
      .json({
        status: wallet?.id ? "success" : "error",
        wallet: wallet?.id,
      });
  }
);

export const getUserWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { walletId } = req.params;
    const wallet = await getUserWalletWithAssetBalances(userId, parseInt(walletId));

    type WalletAsset = {
        name: string;
        symbol: string;
        amount: number;
    }
    let walletInfo:{
        name: string;
        assets: WalletAsset[]
    } = {
        name: '',
        assets: []
    };
    if(wallet){
       walletInfo.name = wallet.walletName;
       if(wallet?.balances.length){
        wallet.balances.forEach((balance) => {
            walletInfo.assets.push({
                name: balance.asset.name,
                symbol: balance.asset.symbol,
                amount: balance.amount.toNumber()
            })
        })
       }
    }

    res.json({
      status: "success",
      wallet: walletInfo?.name?.length ? walletInfo : null,
    });
  }
);

export const addAssetToUserWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id ?? null;
    const { walletId } = req.params;
    const { symbol, address } = req.body;

    // Retrieve the wallet
    const wallet = await prisma.wallet.findUnique({
      select: { id: true, userId: true },
      where: { id: parseInt(walletId), userId },
    });
    if (!wallet) {
      return next(
        new AppError("Wallet not found", StatusCodes.NOT_FOUND, "error")
      );
    }

    // Find the asset
    let assetInfo: AppAsset | null = await getAssetBySymbol(symbol);
    if (!assetInfo) {
      return next(
        new AppError("Asset not found", StatusCodes.NOT_FOUND, "error")
      );
    }

    // Check if the balance already exists
    const walletAssetExists = await prisma.balance.findFirst({
      where: {
        walletId: parseInt(walletId),
        assetId: assetInfo.id,
      },
    });
    if (walletAssetExists) {
      return next(
        new AppError(
          "Wallet asset already exists",
          StatusCodes.CONFLICT,
          "error"
        )
      );
    }

    // Validate address for crypto asset
    if (assetInfo.type === "CRYPTO" && !address) {
      return next(
        new AppError(
          `Crypto wallet address required for ${assetInfo.type} asset`,
          StatusCodes.BAD_REQUEST,
          "error"
        )
      );
    }

    // Create new wallet asset
    const newWalletAsset = await prisma.balance.create({
      data: {
        walletId: parseInt(walletId),
        assetId: assetInfo.id,
        address: address ?? '',
        amount: 1000,
      },
    });

    // Prepare response
    let response: { status: string; message: string } = {
      status: "error",
      message: "Something went wrong",
    };
    let httpCode = StatusCodes.INTERNAL_SERVER_ERROR;

    // Check if the wallet asset was created successfully
    if (newWalletAsset.id) {
      response = {
        status: "success",
        message: `${assetInfo.symbol} added to wallet successfully`,
      };
      httpCode = StatusCodes.CREATED;
    }

    // Send response
    res.status(httpCode).json(response);
  }
);
