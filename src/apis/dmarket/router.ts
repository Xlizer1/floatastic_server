import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({
        message: "dmarket API is ready"
    });
});

export default router;