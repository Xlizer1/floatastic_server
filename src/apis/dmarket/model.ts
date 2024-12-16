import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/skinport", (req: Request, res: Response) => {
    res.json({
        message: "Skinport API is ready"
    });
});

module.exports = router;