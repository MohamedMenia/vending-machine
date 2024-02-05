import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { IProduct, ProductModel } from "../models/productsModel";
import { IUser, UserModel } from "../models/userModel";

export const signToken = (id: Types.ObjectId): String => {
  return jwt.sign({ id: id }, process.env.SECRET_STR as string, {
    expiresIn: process.env.LOGIN_EXPIRES as string,
  });
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies.jwt;
  if (!token && token.startsWith("Bearer ")) {
    return res.status(406).json({
      status: "failed",
      message: "Invalid credentials",
    });
  }
  token = token.split(" ")[1];
  const decodedToken = jwt.verify(
    token,
    process.env.SECRET_STR as string
  ) as jwt.JwtPayload;
  const id = decodedToken.id;
  const user = (await UserModel.findById(id)) as unknown as IUser;
  if (!user) {
    return res.status(403).json({
      status: "failed",
      message: "please login again",
    });
  }
  req.user = user;

  return next();
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role == "admin") return next();

  if (req.user.id.toString() != req.params.id) {
    return res.status(403).json({
      status: "failed",
      message: "unauthorized",
    });
  }
  return next();
};
export const authorizeBuyer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role == "admin") return next();
  if (req.user.role != "buyer")

    return res.status(403).json({
      status: "failed",
      message: "unauthorized",
    });
  return next();
};

export const authorizeSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //admin authorized to do anything
  if (req.user.role == "admin") return next();

  //only seller can create products
  if (req.method == "POST") {
    if (req.user.role != "seller")
      return res.status(403).json({
        status: "failed",
        message: "unauthorized",
      });
    else return next();
  }

  //if not post req this mean that it 's update or delete
  //and this block of code makes sure that product seller is the one who modfies the product

  const product = (await ProductModel.findById(
    req.params.id
  )) as unknown as IProduct;
  if (!product) {
    return res.status(404).json({
      status: "failed",
      message: "Product Not Found",
    });
  }
  if (req.user.id != product.sellerId) {
    return res.status(403).json({
      status: "failed",
      message: "unauthorized",
    });
  }
  return next();
};
