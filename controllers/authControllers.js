import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorator/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import * as fs from "node:fs/promises";
import path from "node:path";

const { SECRET_KEY } = process.env;

async function register(req, res, next) {
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
}

async function login(req, res, next) {
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
}

async function getCurrent(req, res) {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
}

async function logOut(req, res) {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
}

async function updateSubscription(req, res) {
  const { _id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ subscription });
}

async function updateAvatar(req, res) {
  // console.log(req.file)
  await fs.rename(
    req.file.path,
    path.resolve("public/avatars", req.file.filename)
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatarURL: req.file.filename },
    { new: true }
  );

  if (user === null) {
    return res.status(401).send({ message: "Not authorized" });
  }

  res.json({ avatarURL: user.avatarURL });
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logOut: ctrlWrapper(logOut),
  updateSubscription: ctrlWrapper(updateSubscription),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
