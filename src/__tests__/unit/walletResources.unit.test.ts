import {
  createWallet,
  getUserWalletWithAssetBalances,
} from "@/resources/wallet.resource";

import { prismaMock } from "@/prisma/singleton";

describe("Wallet Resources", () => {
  it("should create a new user wallet", async () => {
    const userId = 1;

    const walletRecord = {
      id: 1,
      walletName: "Primary Wallet",
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.wallet.create.mockResolvedValue(walletRecord);

    const newRecord = await createWallet(walletRecord.walletName, userId);

    expect(newRecord).toEqual(walletRecord);
  });

  it("should get user wallet with asset balances", async () => {
    const userId = 1;
    const walletId = 1;

    const assetRecord = {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      amount: 69,
    };

    const mockWalletData = {
      id: walletId,
      walletName: "Primary Wallet",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      balances: [
        {
          id: 1,
          asset: assetRecord,
        },
      ],
    };

    prismaMock.wallet.findUnique.mockResolvedValueOnce(mockWalletData);
    const userWallet = await getUserWalletWithAssetBalances(userId, walletId);
    expect(userWallet).toEqual(
      expect.objectContaining({
        id: walletId,
        userId,
        balances: expect.arrayContaining([
          expect.objectContaining({
            asset: expect.objectContaining(assetRecord),
          }),
        ]),
      })
    );
  });
});
