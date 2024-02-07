import mongoose, { Types } from "mongoose";

export interface IProduct {
  id: Types.ObjectId;
  productName: string;
  amountAvailable: number;
  cost: number;
  sellerId: Types.ObjectId;
}

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "please provide product name"],
    index: true,
    unique: true,
  },
  amountAvailable: { type: Number, require: [true, "please provide available amount"] },
  cost: {
    type: Number,
    required: [true, "please provide cost"],
    validate: {
      validator: function (v: number) {
        return v%5==0;
      },
      message: "invalid cost must be modulus 5",
    },
  },
  sellerId: { type: Types.ObjectId, ref: "User" },
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
