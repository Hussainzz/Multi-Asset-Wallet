import express, { Request, Response, Router } from "express";
import walletRoutes from "./walletRoutes";
import assetRoutes from "./assetRoutes";
import transactionRoutes from "./transactionRoutes";
const router: Router = express.Router();

router.get("/test", async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
  });
});

router.use('/assets', assetRoutes);
router.use('/wallet', walletRoutes);
router.use('/transaction', transactionRoutes);

export default router;
