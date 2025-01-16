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
        let sql = `
            SELECT DISTINCT
                *
            FROM 
                skins f
        `;

        if (name) {
            const tokens = (name as string)
                .split(/\s+/)
                .filter(Boolean)
                .map((token) => token.replace(/'/g, "''")); // Escape single quotes to prevent injection
            const likeClauses = tokens
                .map((token) => `f.name LIKE '%${token}%'`)
                .join(" AND ");
                console.log(likeClauses)
            sql += ` WHERE ${likeClauses}`;
        }

        sql += ` LIMIT 10`;

        executeQuery(sql, "getTopSkins", (result: any) => {
            res.json(result);
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
