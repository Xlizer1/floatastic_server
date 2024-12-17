import mongoose from "mongoose";

const skinSchema = new mongoose.Schema({
    name: String,
    price: String,
    exterior: String,
    float: Number,
    quality: String,
    stickers: Array,
    paintIndex: Number,
    paintSeed: Number,
    inspectInGame: String,
    itemType: String,
    marketLink: String,
    market: String,
    currency: String,
    updatedAt: { type: Date, default: Date.now },
});

export const Skin = mongoose.model("Skin", skinSchema);
