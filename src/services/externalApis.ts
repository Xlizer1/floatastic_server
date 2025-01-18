import axios, { type AxiosResponse } from "axios";
import type { SearchParameters } from "../interfaces/ISearchParams";

interface DmarketResponse {
    objects: {
        extra: {
            name: string;
            exterior?: string;
            floatValue?: number;
            quality?: string;
            stickers?: any[];
            inspectInGame?: string;
            paintIndex?: number;
            paintSeed?: number;
            itemType?: string;
            linkId?: string;
        };
        price: {
            USD: number;
        };
    }[];
    cursor?: string;
}

export async function fetchSkinportData(name: string): Promise<any[] | undefined> {
    const response = await axios.get("https://api.skinport.com/v1/items");
    return response.data;
}

function formatFloatRange(range: [number, number]): string {
    return `floatValueFrom%5B%5D=${range[0].toFixed(2)},floatValueTo%5B%5D=${range[1].toFixed(2)}`;
}

export async function fetchDmarketData(searchParams: SearchParameters): Promise<any[] | undefined> {
    try {
        console.log("fetchDmarketData");
        let allItems: any[] = [];
        let cursor: string | null = null;

        // do {
            const response: AxiosResponse<DmarketResponse> = await axios.get(
                "https://api.dmarket.com/exchange/v1/market/items",
                {
                    params: {
                        currency: "USD",
                        limit: 100,
                        gameId: "a8db",
                        orderBy: "price",
                        orderDir: "asc",
                        cursor: cursor,
                        treeFilters: formatFloatRange(searchParams.floatRange),
                        title: searchParams.name
                    },
                }
            );

            allItems = allItems.concat(response.data.objects);

        //     cursor = response.data.cursor || null;
        //     console.log("got a batch", cursor)
        // } while (cursor);

        return allItems;
    } catch (error) {
        console.error("Error fetching DMarket data:", error);
    }
}
