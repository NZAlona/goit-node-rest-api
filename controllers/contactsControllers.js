import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    // method find() enables to find all objects in collection and returns array of obj - this mongoose lib method works with MongoDB
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) throw HttpError(404, "Not Found");

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) throw HttpError(404, "Not Found");

    res.json(deletedContact);
  } catch (error) {
    console.log("hhh");
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const createdContact = await Contact.create(req.body);
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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

    const updatedStatusContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // oprion {new:true} returns updated object in Postman
    if (!updatedStatusContact) throw HttpError(404, "Not Found such contact");

    res.json(updatedStatusContact);
  } catch (error) {
    next(error);
  }
};
