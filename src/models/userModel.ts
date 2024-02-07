import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  id: Types.ObjectId;
  username: string;
  password: string;
  deposit: number;
  role: "buyer" | "seller" | "admin";
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, "please provide username"],
    index: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: [6, "Must be at least 6 "],
  },
  deposit: { type: Number, default: 0 },
  role: {
    type: String,
    enum: {
      values: ["buyer", "seller", "admin"],
      message: "role must be buyer pr seller or admin",
    },
    default: "buyer",
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const comparePassword = async function (
  password: string,
  dpPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(password, dpPassword);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
