import prisma from "@/prisma";

export const createWallet = async (walletName:string, userId: number) => {
  const wallet = await prisma.wallet.create({
    data: {
      walletName,
      userId,
    },
  });
  return wallet;
};

export const getUserWalletWithAssetBalances = async (userId: number, walletId: number) => {
  return await prisma.wallet.findUnique({
    where: {
      id: walletId,
      userId,
    },
    include: {
      balances: {
        include: {
          asset: {
              select:{
                  name: true,
                  symbol: true
              }
          },
        },
      },
    },
  });
}
