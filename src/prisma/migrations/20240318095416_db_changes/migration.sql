/*
  Warnings:

  - You are about to drop the column `walletId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `senderWalletId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletName` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_walletId_fkey`;

-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `walletId`,
    ADD COLUMN `receiverWalletId` INTEGER NULL,
    ADD COLUMN `senderWalletId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `wallets` ADD COLUMN `walletName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `transactions_senderWalletId_receiverWalletId_idx` ON `transactions`(`senderWalletId`, `receiverWalletId`);

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_senderWalletId_fkey` FOREIGN KEY (`senderWalletId`) REFERENCES `wallets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
