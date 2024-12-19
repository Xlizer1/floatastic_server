import { type Request, type Response } from "express";
import { SkinService } from "../../services/skinService";

export async function getMarketsData(req: Request, res: Response) {
    const { name } = req.body;
    const skins = await SkinService.getSkins(name);
    res.json(skins);
}
