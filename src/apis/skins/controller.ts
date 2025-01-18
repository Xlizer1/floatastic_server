import { type Request, type Response } from "express";
import { SkinService } from "../../services/skinService";
import { executeQuery } from "../../helpers/common";
import type { SearchParameters } from "../../interfaces/ISearchParams";

export async function getMarketsData(req: Request, res: Response) {
    const searchParams: SearchParameters = {
        name: JSON.stringify(req.query.name) || "",
        defIndex:
            Number(
                Array.isArray(req.query.defIndex)
                    ? req.query.defIndex[0]
                    : req.query.defIndex
            ) || 0,
        paintIndex:
            Number(
                Array.isArray(req.query.paintIndex)
                    ? req.query.paintIndex[0]
                    : req.query.paintIndex
            ) || 0,
        stickerIndex:
            Number(
                Array.isArray(req.query.stickerIndex)
                    ? req.query.stickerIndex[0]
                    : req.query.stickerIndex
            ) || 0,
        keychainIndex:
            Number(
                Array.isArray(req.query.keychainIndex)
                    ? req.query.keychainIndex[0]
                    : req.query.keychainIndex
            ) || 0,
        floatRange:
            typeof req.query.float_range === "string"
                ? JSON.parse(req.query.float_range).length === 2 &&
                  typeof JSON.parse(req.query.float_range)[0] === "number" &&
                  typeof JSON.parse(req.query.float_range)[1] === "number"
                    ? JSON.parse(req.query.float_range)
                    : [0, 1]
                : [0, 1],
    };
    const skins = await SkinService.getSkins(searchParams);
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
            console.log(likeClauses);
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
