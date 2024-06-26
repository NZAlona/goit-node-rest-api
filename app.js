import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/usersRouter.js";
import mongoose from "mongoose";
import "dotenv/config";
import path from "node:path";

const { DB_HOST } = process.env;
// process.env enables to see what Environmental variables are available when an applaication was initiated
// process.env is a global variable which is added during runtime by Node,js to show the state of environment an application was initiated - it requires to install dotenv/config loads envir variabl from .env file into process.env

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// mongoose.connect returns promise
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
