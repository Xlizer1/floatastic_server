import { cacheSkinData, getCachedSkinData } from "./redisService";
import { saveSkinData, getStoredSkins } from "./mongoService";

const CACHE_TTL = 600; // 10 minutes

export class SkinService {
    /**
     * Centralized function to get skins
     * @param marketName - Name of the market (e.g., "skinport", "dmarket")
     * @param fetchFunction - Function to fetch data from the market API
     * @returns Cached or fetched skins
     */
    static async getSkins(marketName: string, fetchFunction: () => Promise<any>) {
        const cacheKey = `skins:${marketName}`;

        // Step 1: Check Redis cache
        const cachedData = await getCachedSkinData(cacheKey);
        if (cachedData) {
            console.log(`[Cache] Returning ${marketName} data from cache.`);
            return cachedData;
        }

        console.log(`[Fetch] Fetching ${marketName} data from API...`);
        const fetchedData = await fetchFunction();

        if (fetchedData) {
            // Step 2: Cache the data in Redis
            await cacheSkinData(cacheKey, fetchedData, CACHE_TTL);

            // Step 3: Save to MongoDB
            await saveSkinData(marketName, fetchedData);

            return fetchedData;
        }

        // Step 4: Retrieve stored data from MongoDB if API fails
        console.log(`[Fallback] Retrieving ${marketName} data from MongoDB...`);
        const storedData = await getStoredSkins(marketName);

        return storedData;
    }
}
