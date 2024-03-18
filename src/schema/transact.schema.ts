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
 *           type: string
 *           default: "USD"
 *         amount:
 *           type: number
 *           default: 0
 *         walletId:
 *           type: number
 *         transferTo:
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
 *
 */
