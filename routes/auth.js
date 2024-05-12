import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema } from "../schemas/usersSchema.js";
import { loginSchema } from "../schemas/usersSchema.js";
import {
  login,
  logOut,
  getCurrent,
  updateSubscription,
  register,
} from "../controllers/authControllers.js";
import authenticate from "../middleware/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logOut);

authRouter.patch("/subscription", authenticate, updateSubscription);

export default authRouter;
