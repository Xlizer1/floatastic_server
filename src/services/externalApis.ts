import axios from "axios";
import { formatCurrency } from "../helpers/common";

export async function fetchSkinportData() {
    const response = await axios.get("https://api.skinport.com/v1/items");
    return response.data;
}

export async function fetchDmarketData() {
    try {
        const response = await axios.get(
            "https://api.dmarket.com/exchange/v1/market/items",
            {
                params: { currency: "USD", limit: 100, gameId: "a8db" },
            }
        );
        return response.data.objects.map((skin: any) => ({
            name: skin?.extra?.name,
            price: formatCurrency(skin?.price?.USD),
            exterior: skin?.extra?.exterior || "none",
            float: skin?.extra?.floatValue || 0,
            quality: skin?.extra?.quality || "none",
            stickers: skin?.extra?.stickers?.length ? skin?.extra?.stickers : [],
            inspectInGame: skin?.extra?.inspectInGame || "none",
            paintIndex: skin?.extra?.paintIndex || 0,
            paintSeed: skin?.extra?.paintSeed || 0,
            itemType: skin?.extra?.itemType || "none",
            marketLink: skin?.extra?.linkId ? "https://dmarket.com/ingame-items/item-list/csgo-skins?userOfferId=" + skin?.extra?.linkId : "none",
            currency: "USD",
            updatedAt: Date.now(),
            market: "dmarket",
        }));
    } catch (error) {
        console.log(error);
    }
}
