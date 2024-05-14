import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    // Checks if header includes Bearer and valid token
    const { authorization = "" } = req.headers;

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      next(HttpError(401, "Invalid authorization header"));
    }
    // Verifies JWT token
    const { id } = jwt.verify(token, SECRET_KEY);
    // Checks if user exists in DB
    const userExistsInDb = await User.findById(id);
    // Verifies if the user's token matches the token provided
    if (
      !userExistsInDb ||
      !userExistsInDb.token ||
      userExistsInDb.token !== token
    ) {
      next(HttpError(401, "Not authorized"));
    }

    //  sets req.user
    req.user = userExistsInDb;
    next();
  } catch {
    next(HttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;
