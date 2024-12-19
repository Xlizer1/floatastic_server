import express from "express";
import { getMarketsData } from "./controller";

const router = express.Router();

router.get("/", getMarketsData);

export default router;
