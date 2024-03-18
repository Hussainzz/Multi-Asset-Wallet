import catchAsync from "@/utils/catchAsync";
import { Response, NextFunction } from "express";
import { getAllAppAssets } from "@/resources/assets.resource";

export const getAssets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const assets = await getAllAppAssets();
    res.json(assets);
  }
);
