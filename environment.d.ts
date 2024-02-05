import { IUser } from "./src/models/userModel";
import * as express from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_STR: string;
      DB_STR: string;
      LOGIN_EXPIRES: string;
    }
  }
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export {};
