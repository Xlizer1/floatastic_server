import { formatCurrency } from "../helpers/common";
import type { SearchParameters } from "../interfaces/ISearchParams";
import { fetchSkinportData, fetchDmarketData } from "./externalApis";

export class AllCombainedMarketsSkins {
    /**
     *
     * @param name
     * @returns
     */
    static async dataCombained(searchParams: SearchParameters) {
        const dmarketData = await this.getDmarketData(searchParams);
        return [ ...dmarketData ];
    }
    private static async getDmarketData(searchParams: SearchParameters) {
        const data = await fetchDmarketData(searchParams);
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
        const data = await fetchSkinportData(name);
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
