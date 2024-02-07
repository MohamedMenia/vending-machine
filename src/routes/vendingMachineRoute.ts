import { Router } from "express";
import {verifyToken,authorizeBuyer} from "../controllers/authController"
import * as vendingMachineControllers from "../controllers/vendingMachineControllers"


const router = Router();

router.post("/",verifyToken,authorizeBuyer,vendingMachineControllers.checkout)
router.post("/buyerDeposit",verifyToken,authorizeBuyer,vendingMachineControllers.deposit)
router.post("/depositBack",verifyToken,authorizeBuyer,vendingMachineControllers.reset)

export { router as vendingMachineRouter };
