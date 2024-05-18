import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema } from "../schemas/usersSchema.js";
import { loginSchema } from "../schemas/usersSchema.js";
import autCtrl from "../controllers/authControllers.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), autCtrl.register);

authRouter.post("/login", validateBody(loginSchema), autCtrl.login);

authRouter.get("/current", authenticate, autCtrl.getCurrent);

authRouter.post("/logout", authenticate, autCtrl.logOut);

authRouter.patch("/subscription", authenticate, autCtrl.updateSubscription);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  autCtrl.updateAvatar
);

export default authRouter;
