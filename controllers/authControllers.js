import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { SECRET_KEY } = process.env;

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const exsistedUser = await User.findOne({ email });

    if (exsistedUser !== null) throw HttpError(409, "Email in use");

    // Password hashing can be done by using bcrypt library and salt concept(unique random string)
    const hashPassword = await bcrypt.hash(password, 10);

    // to add user in MongoDB we need need to invoke method create in model, then using spread oper(makes a copy of all values and replace passwaord value )

    const user = await User.create({ ...req.body, password: hashPassword });

    res
      .status(201)
      .json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    // Checks if we already have in db registered email
    const user = await User.findOne({ email });

    if (user === null) throw HttpError(401, "Email or password is wrong");

    //  If user already registered then compare passwords
    const comparePassword = await bcrypt.compare(password, user.password);

    if (comparePassword === false)
      throw HttpError(401, "Email or password is wrong");

    const payload = {
      id: user._id,
    };
    // a unique string sent by server after user logged in
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    // when user  is logged in we save token

    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrent(req, res) {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
}

export async function logOut(req, res) {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
}

export async function updateSubscription(req, res) {
  const { _id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ subscription });
}
