import { Router } from "express";
import * as productController from "../controllers/productController";
import {authorizeSeller,verifyToken} from "../controllers/authController"

const router = Router();

router
  .route("/")
  .post(verifyToken,authorizeSeller,productController.createProduct)
  .get(verifyToken,productController.getProducts);



  router
  .route("/:id")
  .put(verifyToken,authorizeSeller,productController.updateProduct)
  .delete(verifyToken,authorizeSeller,productController.deleteProduct)

export { router as productRouter };
