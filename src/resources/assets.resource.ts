import prisma from "@/prisma";
import { getCache, getOrSetCache } from "@/utils/Redis";

type AssetBalance = number;

interface AssetBalanceInfo {
  amount: number;
  balanceId: number;
}

export async function getAssetBalance(
  userId: number,
  walletId: number,
  assetId: number
): Promise<AssetBalanceInfo | null> {
  const assetBalance = await prisma.wallet.findUnique({
    select: {
      balances: {
        where: {
          assetId: assetId,
        },
        select: {
          id: true,
          amount: true,
        },
      },
    },
    where: {
      id: walletId,
      userId: userId,
    },
  });
  if (!assetBalance || !assetBalance.balances.length) {
    return null;
  }
  const amount = assetBalance.balances[0].amount;
  const balance: number = amount.toNumber();
  return {
    balanceId: assetBalance.balances[0].id,
    amount: balance,
  };
}

export async function getAssetBySymbol(
  symbol: string
): Promise<AppAsset | null> {
  let assetInfo: AppAsset | null = null;
  // try to hit the cache for assets
  let allAssets: AppAsset[] | null = await getCache<AppAsset[]>("app_assets");
  if (allAssets) {
    //filter from cache
    assetInfo =
      allAssets.find(
        (asset: AppAsset) => asset.symbol === symbol.toUpperCase()
      ) || null;
  } else {
    assetInfo = await prisma.asset.findFirst({
      select: { id: true, name: true, symbol: true, type: true },
      where: {
        symbol: symbol.toUpperCase(),
      },
    });
  }
  return assetInfo;
}

export async function getAllAppAssets(): Promise<AppAsset[]> {
  const assets = await getOrSetCache(`app_assets`, async () => {
    return await prisma.asset.findMany({
      select: {
        id: true,
        name: true,
        symbol: true,
        type: true,
      },
    });
  });
  return assets;
}
