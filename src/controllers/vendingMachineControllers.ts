import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/userModel";
import { ProductModel } from "../models/productsModel";
import { ObjectId } from "mongoose";

const acceptedCoins = [100, 50, 20, 10, 5];
const calcChange = (x: number) => {
  let change: { coin: number; count: number }[] = [];
  for (let i of acceptedCoins) {
    let count = Math.floor(x / i);
    x = x % i;
    change.push({ coin: i, count });
  }
  return change;
};

export const deposit = async (req: Request, res: Response) => {
  try {
    if (!req.body.coins) {
      return res.status(400).json({
        status: "failed",
        message: "please provied coins",
      });
    }
    if (!acceptedCoins.includes(req.body.coins)) {
      return res.status(400).json({
        status: "failed",
        message: "this kind of coins not acceptable",
      });
    }
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { deposit: req.body.coins },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      status: "sucsess",
      message: "coins has been added",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const checkout = async (req: Request, res: Response) => {
  try {
    if (!(req.body instanceof Array)) {
      return res.status(400).json({
        status: "failed",
        message:
          "please provide products in array form [{productId,amountOfProducts},{}...] ",
      });
    }
    let totalSpent = 0;
    let promises = [];
    for (const selectedProduct of req.body) {
      const { productId, amountOfProducts } = selectedProduct;
      if (!productId || !amountOfProducts) {
        return res.status(400).json({
          status: "failed",
          message: "please provide productId and amountOfProducts",
        });
      }
      let product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          statue: "failed",
          message: `invalid product id ${productId}`,
        });
      }
      if (amountOfProducts > product.amountAvailable) {
        return res.status(404).json({
          statue: "failed",
          message: `the available amout of ${product.productName} is ${product.amountAvailable}`,
        });
      }
      totalSpent += product.cost * amountOfProducts;
      const promise = ProductModel.findByIdAndUpdate(
        productId,
        {
          $inc: { amountAvailable: -amountOfProducts },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      promises.push(promise);
    }
    if (totalSpent > req.user.deposit) {
      return res.status(400).json({
        statue: "failed",
        message: `your total deposit coins ${req.user.deposit} and your requset needs ${totalSpent} `,
      });
    }
    let change = calcChange(req.user.deposit - totalSpent);
    const updateProducts = await Promise.all(promises);
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        deposit: 0,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: "sucsess",
      totalSpent,
      change: change,
      products: updateProducts,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const reset = async (req: Request, res: Response) => {
  try {
    let change = calcChange(req.user.deposit);
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        deposit: 0,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "sucsses",
      deposit: change,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
