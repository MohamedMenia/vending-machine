import mongoose, { Types } from "mongoose";

export interface IProduct {
  id:Types.ObjectId;
  productName: string;
  amountAvailable: number;
  cost: number;
  sellerId: Types.ObjectId;
}

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    require: [true, "please provide product name"],
    index: true,
    unique: true,
  },
  amountAvailable: { type: Number, require: true },
  cost: { type: Number, require: true },
  sellerId: { type: Types.ObjectId, ref: "User" },
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
