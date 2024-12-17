import express from "express";
import { getSkinportSkins, getDmarketData } from "./controller";

const router = express.Router();

router.get("/dmarket", getDmarketData);

router.get("/skinport", getSkinportSkins);

export default router;
