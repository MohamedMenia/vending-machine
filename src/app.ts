import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config'
import { userRouter } from "./routes/userRoute";
import { productRouter } from "./routes/productRoute";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true }));
  app.use(cookieParser());
mongoose
  .connect(
    process.env.DB_STR as string
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/user", userRouter);
app.use("/products", productRouter);
//globel not found page error handeller
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Page not found',
  });
});

app.listen(3030, () => {
  console.log("server is running");
});

