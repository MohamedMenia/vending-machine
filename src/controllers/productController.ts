import { Request, Response } from "express";
import {IProduct, ProductModel } from "../models/productsModel";


export const getProducts = async (req: Request, res: Response) => {
  try {
    //we can use populte to get info of seller with every product
    const products = await ProductModel.find();

    res.status(200).json({ status: "sucsess", products });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.create({...req.body,sellerId:req.user.id});

    res.status(200).json({ status: "sucsess", product });
  } catch (error) {
    return res.status(403).json({ status: "failed", message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "id doesn't exsist",
      });
    }

    res.status(200).json({ status: "sucsess", product });
  } catch (error) {
    return res.status(403).json(error.message);
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
    return res.status(403).json(error.message);
  }
};
