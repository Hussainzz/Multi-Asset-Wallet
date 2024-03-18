import {
  transferUserFunds,
  withdrawUserFunds,
} from "@/resources/transfer.resource";
import { transactionQueue } from "@/utils/queue";
import { sleepWithCall } from "./helper";
import prisma from "@/prisma";

if (process.env.TEST_TYPE !== "e2e") {
  transactionQueue.process(async function (job, done) {
    const actionType = job.data?.actionType || "";
    let result = null;
    let txData: any = null;

    job.log(`Transaction job ${actionType} initiated! 🚀`);
    job.progress(20);
    await sleepWithCall(10000, () => {
      job.log(`Transaction job ${actionType} Almost Done! 🦅`);
      job.progress(70);
    });
    switch (actionType) {
      case "transfer-funds":
        let transferData =
      job.data as TransferJobData;
        txData = {
          amount: transferData.amountToTransfer,
          assetId: transferData.assetInfo.id,
          type: 'TRANSFER',
          senderWalletId: transferData.balanceId,
          receiverWalletId: transferData.transferTo
        }
        result = await transferUserFunds(job);
        break;
      case "withdraw-funds":
        let withdrawData =
        job.data as WithdrawJobData;
          txData = {
            amount: withdrawData.amountToWithdraw,
            assetId: withdrawData.assetInfo.id,
            type: 'WITHDRAWL',
            senderWalletId: withdrawData.balanceId,
            receiverWalletId: null
          }
        result = await withdrawUserFunds(job);
        break;
      default:
        break;
    }
    job.log(`Transaction job ${actionType} Processed! ✅`);
    job.progress(100);

    if(txData && result?.status){
      txData.status = result?.status?.toUpperCase();
      await prisma.transaction.create({
        data: txData
      })
    }

    done(null, result);
  });
}
