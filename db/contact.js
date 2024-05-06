import { Schema, model } from "mongoose";
import handleMongooseErr from "../middleware/handleMongooseErr.js";

// Need to create schema (object) with some requirements which will be saved in mongooseDB
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
// options: {versionKey: false, timestamps: true } removing version number instead adding when it was created&updated

// Created middleware coz mongoose doesn't return status of errors
contactSchema.post("save", handleMongooseErr);

// Need to create model(class) and pass collection name in singular and schema we created above

export const Contact = model("contact", contactSchema);
