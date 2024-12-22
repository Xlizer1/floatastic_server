import express from "express";
import { getMarketsData, getTopSkins } from "./controller";

const router = express.Router();

router.get("/", getMarketsData);
router.get("/top", getTopSkins);

export default router;
