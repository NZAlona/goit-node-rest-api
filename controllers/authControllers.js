import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import ctrlWrapper from "../decorator/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import * as fs from "node:fs/promises";
import path from "node:path";
import gravatar from "gravatar";
import Jimp from "jimp";
import crypto from "node:crypto";

const { SECRET_KEY } = process.env;

async function register(req, res) {
  const { email, password } = req.body;
  const exsistedUser = await User.findOne({ email });

  if (exsistedUser !== null) throw HttpError(409, "Email in use");

  // Password hashing can be done by using bcrypt library and salt concept(unique random string)
  const hashPassword = await bcrypt.hash(password, 10);

  // Create temporary avatar - variable name should be the same as specified in schema
  const avatarURL = gravatar.url(email);

  // Create verification token
  const verificationToken = crypto.randomUUID();

  // to add user in MongoDB we need need to invoke method create in model, then using spread oper(makes a copy of all values and replace passwaord value )
  const user = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  //  Create email to confirm/verify by recipient
  const verifyEmail = {
    to: email,
    subject: "Verify your Email",

    html: `<p>Hi there. To access your account, you'll need to verify your email address. Please click on the following <a style="color: blue" target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">link</a> </p>`,

    text: "Hi there. To access your account, you'll need to verify your email address. Please follow these steps: Copy the following link: http://localhost:3000/api/users/verify/${verificationToken} and paste it into your browser's address bar.",
  };

  await sendEmail(verifyEmail);

  res
    .status(201)
    .json({ user: { email: user.email, subscription: user.subscription } });
}

async function verifyEmail(req, res) {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
}

async function resendEmail(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(404, "User not found");

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  //  Create email to confirm/verify by recipient
  const verifyEmail = {
    to: email,
    subject: "Verify your Email",

    html: `<p>Hi there. To access your account, you'll need to verify your email address. Please click on the following <a style="color: blue" target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a> </p>`,

    text: "Hi there. To access your account, you'll need to verify your email address. Please follow these steps: Copy the following link: http://localhost:3000/api/users/verify/${verificationToken} and paste it into your browser's address bar.",
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
}

async function login(req, res) {
  const { email, password } = req.body;
  // Checks if we already have in db registered email
  const user = await User.findOne({ email });

  if (user === null) throw HttpError(401, "Email or password is wrong");

  // Check if user verified his email
  if (user.verify === false)
    throw HttpError(401, "Email has not been verified");

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
  const resizeAvatar = await Jimp.read(req.file.path);
  resizeAvatar.resize(250, 250).write(path.resolve(req.file.path));

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
  verifyEmail: ctrlWrapper(verifyEmail),
  resendEmail: ctrlWrapper(resendEmail),
  login: ctrlWrapper(login),
  logOut: ctrlWrapper(logOut),
  updateSubscription: ctrlWrapper(updateSubscription),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
