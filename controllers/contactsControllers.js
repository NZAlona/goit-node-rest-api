import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await Contact.findById({ _id: id, owner });

    if (!contact) throw HttpError(404, "Not Found");

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });

    if (!deletedContact) throw HttpError(404, "Not Found");

    res.json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const createdContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
