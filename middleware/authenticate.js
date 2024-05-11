import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  // Checks if header includes Bearer and valid token
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Invalid authorization header"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const userExistsInDb = await User.findById(id);

    if (
      !userExistsInDb ||
      !userExistsInDb.token ||
      userExistsInDb.token !== token
    ) {
      next(HttpError(401, "Not authorized"));
    }

    //   To identify user who sends requests
    req.user = userExistsInDb;
    next();
  } catch {
    next(HttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;
