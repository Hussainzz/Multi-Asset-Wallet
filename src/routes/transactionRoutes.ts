import {
  getWalletTransactions,
  transferFunds,
  withdrawFunds,
} from "@/controllers/transactionController";
import express, { Router } from "express";
const router: Router = express.Router();
import "@/schema/transact.schema";
import validateAPIKey from "@/middleware/validateAPIKey";
import validateTransferBody from "@/middleware/validateTransferBody";
import validateWithdrawBody from "@/middleware/validateWithdrawBody";

/**
 * @swagger
 * /api/transaction/transfer:
 *   post:
 *     summary: Transfers user funds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/Transfer'
 *     security:
 *       - wallet-x-key: []
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/TransferResponse'
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/TransferBadRequestResponse'
 *       '500':
 *         description: Error
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/TransferUnAuthorizedResponse'
 */
router.post("/transfer", validateAPIKey, validateTransferBody, transferFunds);

/**
 * @swagger
 * /api/transaction/withdraw:
 *   post:
 *     summary: Withdraw Funds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/Withdraw'
 *     security:
 *       - wallet-x-key: []
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/WithdrawResponse'
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/TransferBadRequestResponse'
 *       '500':
 *         description: Error
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/TransferUnAuthorizedResponse'
 */
router.post("/withdraw", validateAPIKey, validateWithdrawBody, withdrawFunds);

/**
 * @swagger
 * /api/transaction/{walletId}:
 *   get:
 *     summary: Get all wallet transactions
 *     parameters:
 *      - name: walletId
 *        in: path
 *        description: User wallet id to which asset is to be added
 *        required: true
 *      - name: limit
 *        in: query
 *        description: Limit (Default:10)
 *      - name: c
 *        in: query
 *        description: Cursor
 *     security:
 *       - wallet-x-key: []
 *     responses:
 *       '200':
 *         description: List of wallet transactions
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/TransferUnAuthorizedResponse'
 */
router.get("/:walletId", validateAPIKey, getWalletTransactions);

export default router;
