import express, { Router } from "express";
import {
  addAssetToUserWallet,
  createUserWallet,
  getUserWallet,
} from "@/controllers/walletController";
import validateSymbol from "@/middleware/validateAssetSymbol";
const router: Router = express.Router();
import "@/schema/wallet.schema";
import validateAPIKey from "@/middleware/validateAPIKey";

/**
 * @swagger
 * /api/wallet:
 *   post:
 *     summary: Create new user wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/WalletCreation'
 *     security:
 *       - wallet-x-key: []
 *     responses:
 *       '201':
 *         description: Successful response
 *       '500':
 *         description: Error
 *       '401':
 *         description: Unauthorized
 */
router.post("/", validateAPIKey, createUserWallet);

/**
 * @swagger
 * /api/wallet/{walletId}:
 *   get:
 *     summary: Get user wallet
 *     parameters:
 *      - name: walletId
 *        in: path
 *        description: User wallet id to which asset is to be added
 *        required: true
 *     security:
 *       - wallet-x-key: []
 *     responses:
 *       '200':
 *         description: Successful response
 *       '401':
 *         description: Unauthorized
 */
router.get("/:walletId", validateAPIKey, getUserWallet);

/**
 * @swagger
 * /api/wallet/{walletId}/add-asset:
 *   post:
 *     summary: Adds asset to user wallet
 *     parameters:
 *      - name: walletId
 *        in: path
 *        description: User wallet id to which asset is to be added
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/Wallet'
 *     security:
 *       - wallet-x-key: []
 *     responses:
 *       '201':
 *         description: Successful response
 *       '500':
 *         description: Error
 *       '401':
 *         description: Unauthorized
 */
router.post(
  "/:walletId/add-asset",
  validateAPIKey,
  validateSymbol,
  addAssetToUserWallet
);

export default router;
