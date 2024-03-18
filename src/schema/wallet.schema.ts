/**
 * @swagger
 * components:
 *   schema:
 *     Wallet:
 *       type: object
 *       required:
 *        - symbol
 *       properties:
 *         symbol:
 *           type: string
 *           default: "ETH"
 *     WalletCreation:
 *       type: object
 *       required:
 *        - walletName
 *       properties:
 *         symbol:
 *           type: string
 *           default: "Primary Wallet"
 *     WalletCreationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: "success"
 *         wallet:
 *           type: number
 *           default: 1
 */