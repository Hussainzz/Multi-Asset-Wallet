import { Job } from "bull";
import prisma from "@/prisma";

export async function getAllTransactions(
  walletId: number,
  limit: number,
  myCursor: number | null
) : Promise<{
  logs: TransactionLog[];
  cursor: number | null;
}> {
  let logs: TransactionLog[] = [];
  let cursor: number | null = null;

  try {
    logs = (await prisma.transaction.findMany({
      take: limit,
      ...(myCursor && {
        skip: 1,
        cursor: {
          id: myCursor,
        },
      }),
      where: {
        senderWalletId: walletId,
      },
      select: {
        id: true,
        asset: {
          select:{
            name: true,
            symbol: true
          }
        },
        senderWalletId: true,
        receiverWalletId: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as TransactionLog[] | [];
    cursor =
      logs.length > 0
        ? logs.length === limit
          ? logs[logs.length - 1].id
          : null
        : null;
  } catch (error: any) {
    console.error("Error fetching Transactions:", error?.message);
  }

  return { logs, cursor };
}
export async function withdrawUserFunds(job: Job) {
  try {
    const { balanceId, amountToWithdraw, assetInfo } =
      job.data as WithdrawJobData;
    if (!balanceId || !amountToWithdraw || !assetInfo) {
      return {
        status: "error",
        message: "Bad Request",
      };
    }

    const balanceRecord = await prisma.balance.findUnique({
      where: {
        id: balanceId,
      },
    });

    if (!balanceRecord) {
      return {
        status: "error",
        message: "Asset Balance not found",
      };
    }

    const currentAssetBalance = balanceRecord.amount.toNumber();
    if (amountToWithdraw > currentAssetBalance) {
      return {
        status: "error",
        message: "Insufficient funds",
      };
    }

    await prisma.balance.update({
      where: {
        id: balanceRecord.id,
      },
      data: {
        amount: {
          decrement: amountToWithdraw,
        },
      },
    });

    return {
      status: "success",
      message: "Withdraw success!",
    };
  } catch (error) {
    console.log("withdrawUserFunds ", error);
  }
  return {
    status: "error",
    message: "Withdraw failed!",
  };
}

export async function transferUserFunds(job: Job) {
  try {
    const { balanceId, amountToTransfer, transferTo, assetInfo } =
      job.data as TransferJobData;
    if (!balanceId || !amountToTransfer || !transferTo) {
      return {
        status: "error",
        message: "Bad Request",
      };
    }

    const balanceRecord = await prisma.balance.findUnique({
      where: {
        id: balanceId,
      },
    });

    if (!balanceRecord) {
      return {
        status: "error",
        message: "Balance not found",
      };
    }

    const currentAssetBalance = balanceRecord.amount.toNumber();
    if (amountToTransfer > currentAssetBalance) {
      return {
        status: "error",
        message: "Insufficient funds",
      };
    }

    await prisma.$transaction([
      prisma.balance.update({
        where: {
          id: balanceRecord.id,
        },
        data: {
          amount: {
            decrement: amountToTransfer,
          },
        },
      }),
      prisma.balance.update({
        where: {
          walletId_assetId: {
            walletId: transferTo,
            assetId: assetInfo.id,
          },
        },
        data: {
          amount: {
            increment: amountToTransfer,
          },
        },
      }),
    ]);

    return {
      status: "success",
      message: "Transfer complete!",
    };
  } catch (error) {
    console.log("transferUserFunds ", error);
  }
  return {
    status: "error",
    message: "Transfer failed!",
  };
}
