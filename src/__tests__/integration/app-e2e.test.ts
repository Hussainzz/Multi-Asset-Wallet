import request from "supertest";
import app from "@/app";
import prisma from "@/prisma";
import { StatusCodes } from "http-status-codes";
import { gracefulShutdown } from "@/utils/Redis";
import { transactionQueue } from "@/utils/queue";
import { transferUserFunds, withdrawUserFunds } from "@/resources/transfer.resource";
import { Job } from "bull";
import { getAssetBalance } from "@/resources/assets.resource";

const server = app.listen(8002); // Start the server

describe("Application Routes", () => {
  let apiKey: string = "";

  beforeAll(async () => {
    const user = await prisma.user.findUnique({
      where: { id: 1 },
      select: { apiKey: true },
    });

    if (!user) {
      throw new Error("User not found");
    }
    apiKey = user.apiKey ?? "";
  });

  describe("POST /api/wallet", () => {
    it("should create new user wallet", async () => {
      const headers = {
        "wallet-x-key": apiKey,
      };
      const response = await request(server)
        .post("/api/wallet")
        .send({
          walletName: "Primary Wallet",
        })
        .set(headers);
      expect(response.status).toBe(StatusCodes.CREATED);
    });

    it("should not create new user wallet if api key is invalid", async () => {
      const headers = {
        "wallet-x-key": "some-invalid-api-key",
      };
      const response = await request(server).post("/api/wallet").set(headers);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual(
        expect.objectContaining({ status: "error", message: "Invalid API Key" })
      );
    });
  });

  describe("GET /api/wallet/{walletId}", () => {
    it("should get a user wallet", async () => {
      const headers = {
        "wallet-x-key": apiKey,
      };
      const response = await request(server).get(`/api/wallet/1`).set(headers);

      expect(response.body).toEqual(
        expect.objectContaining({
          status: "success",
          wallet: {
            name: "Primary Wallet",
            assets: [],
          },
        })
      );
    });
  });

  describe("POST /api/wallet/{walletId}/add-asset", () => {
    it("should add ETH asset to wallet", async () => {
      const headers = {
        "wallet-x-key": apiKey,
      };
      const asset = "ETH";
      const response = await request(server)
        .post(`/api/wallet/1/add-asset`)
        .send({
          symbol: asset,
          address: "0xxxethwallet1",
        })
        .set(headers);
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "success",
          message: `${asset} added to wallet successfully`,
        })
      );
    });

    it("should not allow to add duplicate asset to wallet", async () => {
      const headers = {
        "wallet-x-key": apiKey,
      };
      const asset = "ETH";
      const response = await request(server)
        .post(`/api/wallet/1/add-asset`)
        .send({
          symbol: asset,
          address: "0xxxethwallet1",
        })
        .set(headers);

      expect(response.statusCode).toBe(StatusCodes.CONFLICT);
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: `Wallet asset already exists`,
        })
      );
    });
  });

  it("should successfully transfer funds |transferUserFunds| resource ", async () => {
    const user2Wallet = await prisma.wallet.create({
      data: {
        userId: 2,
        walletName: "SecondPrimary2",
      },
    });

    const user2AssetOldBalance = await prisma.balance.create({
      data: {
        walletId: user2Wallet.id,
        assetId: 1,
        amount: 1000,
        address: "user2DummyETHAddress",
      },
    });

    let user1AssetBalance = await getAssetBalance(1, 1, 1);
    let user1AssetOldBalance = user1AssetBalance?.amount ?? 0;

    const amountToTransfer = 100;
    await transferUserFunds({
      data: {
        balanceId: 1,
        amountToTransfer,
        transferTo: 2,
        assetInfo: {
          id: 1,
          name: "Ethereum",
          symbol: "ETH",
          type: "CRYPTO",
        },
      },
    } as Job);

    let user1NewAssetBalance = await getAssetBalance(1, 1, 1);
    let user1AssetNewBalance = user1NewAssetBalance?.amount ?? 0;
    expect(user1AssetNewBalance).toEqual(
      user1AssetOldBalance - amountToTransfer
    );

    let user2NewAssetBalance = await getAssetBalance(2, 2, 1);
    let user2AssetNewBalance = user2NewAssetBalance?.amount ?? 0;
    expect(user2AssetNewBalance).toEqual(
      user2AssetOldBalance.amount.toNumber() + amountToTransfer
    );
  });

  it("should successfully withdraw funds |withdrawFunds| resource ", async () => {
    let user1AssetBalance = await getAssetBalance(1, 1, 1);
    let user1AssetOldBalance = user1AssetBalance?.amount ?? 0;

    const amountToWithdraw = 100;
    await withdrawUserFunds({
      data: {
        balanceId: 1,
        amountToWithdraw,
        assetInfo: {
          id: 1,
          name: "Ethereum",
          symbol: "ETH",
          type: "CRYPTO",
        },
      },
    } as Job);

    let user1NewAssetBalance = await getAssetBalance(1, 1, 1);
    let user1AssetNewBalance = user1NewAssetBalance?.amount ?? 0;
    expect(user1AssetNewBalance).toEqual(
      user1AssetOldBalance - amountToWithdraw
    );
  });

  describe("POST /api/transaction/transfer", () => {
    it("should fail with insufficient funds", async () => {
      const headers = {
        "wallet-x-key": apiKey,
      };

      await prisma.balance.update({
        where: { id: 1 },
        data: {
          amount: 0.0,
        },
      });

      const response = await request(server)
        .post("/api/transaction/transfer")
        .send({
          symbol: "ETH",
          amount: 200,
          walletId: 1,
          transferTo: 2,
        })
        .set(headers);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: `Insufficient Funds!`,
        })
      );
    });
  });

  afterAll((done) => {
    transactionQueue.close();
    gracefulShutdown().then(() => {
      server.close(done); // Close the server
    });
  });
});
