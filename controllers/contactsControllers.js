import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";
import ctrlWrapper from "../decorator/ctrlWrapper.js";

const getAllContacts = async (req, res, next) => {
  // To return all items that were created/updated by specific user
  const { _id: owner } = req.user;

  // Pagination --> req.query
  const { page = 1, limit = 20, favorite } = req.query;

  let filter = { owner, favorite };

  if (favorite === undefined) {
    filter = { owner };
  }

  // method find() enables to find all objects in collection and returns array of obj - this mongoose lib method works with MongoDB

  const skip = (page - 1) * limit;
  const contacts = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  // method populate enables to get additional info about user who sent request
  res.json(contacts);
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contact.findById({ _id: id, owner });

  if (!contact) throw HttpError(404, "Not Found");

  res.json(contact);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });

  if (!deletedContact) throw HttpError(404, "Not Found");

  res.json(deletedContact);
};

const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const createdContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(createdContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { ...req.body, _id: id, owner },
    {
      new: true,
    }
  );
  // option {new:true} returns updated object in Postman
  if (!updatedContact) throw HttpError(404, "Not Found such contact");

  res.json(updatedContact);
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updatedStatusContact = await Contact.findByIdAndUpdate(
    id,
    { ...req.body, _id: id, owner },
    {
      new: true,
    }
  );
  // oprion {new:true} returns updated object in Postman
  if (!updatedStatusContact) throw HttpError(404, "Not Found such contact");

  res.json(updatedStatusContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
