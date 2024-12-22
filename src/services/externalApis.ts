import axios, { type AxiosResponse } from "axios";

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

export async function fetchSkinportData() {
    const response = await axios.get("https://api.skinport.com/v1/items");
    return response.data;
}

export async function fetchDmarketData(name: string): Promise<any[] | undefined> {
    try {
        console.log("fetchDmarketData");
        let allItems: any[] = [];
        let cursor: string | null = null;

        // do {
        console.log(name)
            const response: AxiosResponse<DmarketResponse> = await axios.get(
                "https://api.dmarket.com/exchange/v1/market/items",
                {
                    params: {
                        currency: "USD",
                        limit: 100,
                        gameId: "a8db",
                        orderBy: "personal",
                        cursor: cursor,
                        title: name
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
