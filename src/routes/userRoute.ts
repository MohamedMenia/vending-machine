import { Router } from "express";
import * as userContoller from "../controllers/userContoller";
import { authorizeAdmin, authorizeUser ,verifyToken} from "../controllers/authController";

const router = Router();

router.post("/login", userContoller.login);
router
  .route("/")
  .post(userContoller.createUser, userContoller.login)
  .get(verifyToken,authorizeAdmin,userContoller.getUsers);


  router
  .route("/:id")
  .put(verifyToken,authorizeUser, userContoller.updateUser)
  .delete(verifyToken,authorizeUser,userContoller.deleteUser)
 

export { router as userRouter };
