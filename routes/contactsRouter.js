import express from "express";
import contactCtrl from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";
import isValidId from "../middleware/isValidId.js";
import authenticate from "../middleware/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactCtrl.getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, contactCtrl.getOneContact);

contactsRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  contactCtrl.deleteContact
);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  contactCtrl.createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  contactCtrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  contactCtrl.updateStatusContact
);

export default contactsRouter;
