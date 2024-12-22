import { type Request, type Response } from "express";
import { SkinService } from "../../services/skinService";
import { executeQuery } from "../../helpers/common";

export async function getMarketsData(req: Request, res: Response) {
    const { name } = req.query;
    try {
        var skin_name = name ? JSON.stringify(name) : "";
    } catch (error) {
        skin_name = "";
        console.log(error);
    }
    const skins = await SkinService.getSkins(skin_name);
    res.json(skins);
}

export async function getTopSkins(req: Request, res: Response) {
    const { name } = req.query;
    try {
        var skin_name = name ? JSON.stringify(name) : "";
    } catch (error) {
        skin_name = "";
        console.log(error);
    }

    var sql = `
        SELECT DISTINCT
            * 
        FROM 
            skins f
    `;

    if (name) sql += ` WHERE f.name LIKE '${skin_name.split('"').join("%")}'`;

    sql += ` LIMIT 10`;

    executeQuery(sql, "name", (result: any) => res.json(result));
}
