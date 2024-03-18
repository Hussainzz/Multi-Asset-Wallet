/**
 * @swagger
 * components:
 *   schema:
 *     Transfer:
 *       type: object
 *       required:
 *        - symbol
 *        - amount
 *        - walletId
 *        - transferTo
 *       properties:
 *         symbol:
 *           summary: Asset Symbol
 *           type: string
 *           default: "ETH"
 *         amount:
 *           summary: Amount to transfer
 *           type: number
 *           default: 100
 *         walletId:
 *           summary: your wallet id
 *           type: number
 *         transferTo:
 *          summary: Receiver's Wallet Id
 *          type: number
 *     Withdraw:
 *       type: object
 *       required:
 *        - symbol
 *        - amount
 *        - walletId
 *       properties:
 *         symbol:
 *           type: string
 *           default: "USD"
 *         amount:
 *           type: number
 *           default: 0
 *         walletId:
 *           type: number
 *     TransferResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: "success"
 *         message:
 *           type: string
 *           default: "Transaction Transfer Requested!"
 *     TransferBadRequestResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: "error"
 *         message:
 *           type: string
 *           default: "Asset not found in wallet / Insufficient Funds!"
 *     TransferUnAuthorizedResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: "error"
 *         message:
 *           type: string
 *           default: "Invalid API Key"
 *     WithdrawResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: "success"
 *         message:
 *           type: string
 *           default: "Withdraw Requested, Will be processed shortly."
 *
 */
