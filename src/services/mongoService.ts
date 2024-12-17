import { Skin } from "../models/skin";

export async function saveSkinData(market: string, skinData: any[]) {
    try {
        if (skinData?.length) {
            await Skin.insertMany(skinData);
        } else {
            console.log("error: no skins: saveSkinData: ", saveSkinData);
        }
    } catch (error) {
        console.log("Error: saveSkinData", error);
    }
}

export async function getStoredSkins(market: string) {
    return await Skin.find({ market }).lean();
}
