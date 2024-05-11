import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema } from "../schemas/usersSchema.js";
import { loginSchema } from "../schemas/usersSchema.js";
import AuthController from "../controllers/authControllers.js";
import authenticate from "../middleware/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  AuthController.register
);

authRouter.post("/login", validateBody(loginSchema), AuthController.login);

authRouter.get("/current", authenticate, AuthController.getCurrent);

authRouter.post("/logout", authenticate, AuthController.logOut);

authRouter.patch("/", authenticate, AuthController.updateSubscription);

export default authRouter;
