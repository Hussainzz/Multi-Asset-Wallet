import prisma from ".";
import { type Prisma } from "@prisma/client";

async function main() {
  // Populate assets
  const dummyTxNum: any = {
    amount: 101,
    assetId: 1,
    status: "SUCCESS",
    type: "WITHDRAWL",
    senderWalletId: 1,
    receiverWalletId: null,
  };

  let data: Prisma.TransactionCreateManyInput[] = [];
  for (let index = 0; index < 50; index++) {
    data.push(dummyTxNum);
  }
  if (!data.length) return;
  await prisma.transaction.createMany({data});
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
