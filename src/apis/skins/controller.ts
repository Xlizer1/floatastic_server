import { type Request, type Response } from "express";
import { SkinService } from "../../services/skinService";
import { fetchSkinportData, fetchDmarketData } from "../../services/externalApis";

export async function getDmarketData(req: Request, res: Response) {
    const skins = await SkinService.getSkins("dmarket", fetchDmarketData);
    res.json(skins);
}

export async function getSkinportSkins(req: Request, res: Response) {
    const skins = await SkinService.getSkins("skinport", fetchSkinportData);
    res.json(skins);
}
