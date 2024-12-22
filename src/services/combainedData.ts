import { formatCurrency } from "../helpers/common";
import { fetchSkinportData, fetchDmarketData } from "./externalApis";

export class AllCombainedMarketsSkins {
    /**
     *
     * @param name
     * @returns
     */
    static async dataCombained(name: string) {
        const dmarketData = await this.getDmarketData(name);
        return [ ...dmarketData ];
    }
    private static async getDmarketData(name: string) {
        const data = await fetchDmarketData(name);
        if (data && data?.length) {
            return data.map((skin) => ({
                name: skin.extra.name,
                price: formatCurrency(skin.price.USD),
                exterior: skin.extra.exterior || "none",
                float: skin.extra.floatValue || 0,
                quality: skin.extra.quality || "none",
                stickers: skin.extra.stickers?.length
                    ? skin.extra.stickers
                    : [],
                inspectInGame: skin.extra.inspectInGame || "none",
                paintIndex: skin.extra.paintIndex || 0,
                paintSeed: skin.extra.paintSeed || 0,
                itemType: skin.extra.itemType || "none",
                marketLink: skin.extra.linkId
                    ? `https://dmarket.com/ingame-items/item-list/csgo-skins?userOfferId=${skin.extra.linkId}`
                    : "none",
                currency: "USD",
                updatedAt: Date.now(),
                market: "dmarket",
            }));
        } else {
            return [];
        }
    }
    private async getSkinPortData(name: string) {
        const data = await fetchDmarketData(name);
        if (data && data?.length) {
            return data.map((skin) => ({
                name: skin.extra.name,
                price: formatCurrency(skin.price.USD),
                exterior: skin.extra.exterior || "none",
                float: skin.extra.floatValue || 0,
                quality: skin.extra.quality || "none",
                stickers: skin.extra.stickers?.length
                    ? skin.extra.stickers
                    : [],
                inspectInGame: skin.extra.inspectInGame || "none",
                paintIndex: skin.extra.paintIndex || 0,
                paintSeed: skin.extra.paintSeed || 0,
                itemType: skin.extra.itemType || "none",
                marketLink: skin.extra.linkId
                    ? `https://dmarket.com/ingame-items/item-list/csgo-skins?userOfferId=${skin.extra.linkId}`
                    : "none",
                currency: "USD",
                updatedAt: Date.now(),
                market: "dmarket",
            }));
        } else {
            return [];
        }
    }
}

interface DmarketItem {
    name: string;
    price: string;
    exterior: string;
    float: number;
    quality: string;
    stickers: any[];
    inspectInGame: string;
    paintIndex: number;
    paintSeed: number;
    itemType: string;
    marketLink: string;
    currency: string;
    updatedAt: number;
    market: string;
}
