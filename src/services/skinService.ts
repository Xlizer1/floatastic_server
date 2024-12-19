import { cacheSkinData, getCachedSkinData } from "./database services/redisService";
import { saveSkinData, getStoredSkins } from "./database services/mongoService";
import { AllCombainedMarketsSkins } from "./combainedData";

const CACHE_TTL = 600; // 10 minutes

export class SkinService {
    /**
     * Centralized function to get skins
     * @param skin_name - Name of the market (e.g., "skinport", "dmarket")
     * @returns Cached or fetched skins
     */
    static async getSkins(skin_name: string) {
        const cacheKey = `skins:${skin_name}`;

        // Step 1: Check Redis cache
        const cachedData = await getCachedSkinData(cacheKey);
        if (cachedData) {
            console.log(`[Cache] Returning ${skin_name} data from cache.`);
            return cachedData;
        }

        console.log(`[Fetch] Fetching ${skin_name} data from API...`);
        const combainedSkinsData = await AllCombainedMarketsSkins.dataCombained(skin_name);

        if (combainedSkinsData) {
            // Step 2: Cache the data in Redis
            await cacheSkinData(cacheKey, combainedSkinsData, CACHE_TTL);

            // Step 3: Save to MongoDB
            await saveSkinData(skin_name, combainedSkinsData);

            return combainedSkinsData;
        }

        // Step 4: Retrieve stored data from MongoDB if API fails
        console.log(`[Fallback] Retrieving ${skin_name} data from MongoDB...`);
        const storedData = await getStoredSkins(skin_name);

        return storedData;
    }
}
