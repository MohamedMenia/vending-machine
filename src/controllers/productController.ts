import { Request, Response } from "express";
import { ProductModel } from "../models/productsModel";

export const getProducts = async (req: Request, res: Response) => {
  try {
    //we can use populte function to get info of seller with every product
    const products = await ProductModel.find();

    res.status(200).json({ status: "sucsess", products });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.create({
      ...req.body,
      sellerId: req.user.id,
    });
    res.status(200).json({ status: "sucsess", product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "that product name  already used",
      });
    }
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "sucsess", product });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: "sucsess", message: "product has been deleted" });
  } catch (error) {
    return res.status(500).json({ stats: "failed", message: error.message });
  }
};
