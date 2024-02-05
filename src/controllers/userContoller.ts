import { Request, Response, NextFunction } from "express";
import { UserModel, IUser, comparePassword } from "../models/userModel";
import { signToken } from "./authController";
import { ProductModel } from "../models/productsModel";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.create(req.body);
    req.user = user;
    return next();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "Username  already exists",
      });
    }
    return res.status(403).json({ status: "failed", message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!req.body.username) {
    return res
      .status(422)
      .json({ status: "failed", message: "please enter username" });
  }
  if (!req.body.password) {
    return res
      .status(422)
      .json({ status: "failed", message: "please enter paswword" });
  }
  let user = (await UserModel.findOne({
    username: req.body.username,
  })) as unknown as IUser;
  if (!user) {
    return res
      .status(406)
      .json({ status: "failed", message: "wrong username" });
  }
  const isMatchPass = await comparePassword(req.body.password, user.password);
  if (!isMatchPass) {
    return res
      .status(406)
      .json({ status: "failed", message: "wrong password" });
  }
  const token = signToken(user.id);
  res.cookie("jwt", "Bearer " + token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 1000,
  });
  res.status(200).json({
    status: "sucsess",
    user: { username: user.username, role: user.role },
  });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "id doesn't exsist",
      });
    }

    res.status(200).json({ status: "sucsess", user });
  } catch (error) {
    return res.status(403).json(error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await UserModel.findByIdAndDelete(id);
    await ProductModel.deleteMany({ sellerId: id });

    res
      .clearCookie("jwt")
      .status(200)
      .json({
        status: "sucsess",
        message: "user data and his products has been deleted",
      });
  } catch (error) {
    return res.status(403).json(error.message);
  }
};
