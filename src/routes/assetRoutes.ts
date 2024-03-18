
import { getAssets } from "@/controllers/assetController";
import express, { Router } from "express";
const router: Router = express.Router();

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Get all available application assets options
 *     responses:
 *       '200':
 *         description: list of available assets
 */
router.get("/", getAssets);

export default router;
