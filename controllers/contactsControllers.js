import HttpError from "../helpers/HttpError.js";
import { Contact } from "../db/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    // method find() enables to find all objects in collection and returns array of obj - this mongoose lib method works with MongoDB
    res.json(contacts);
  } catch (error) {
    next(error);
    //to reduce code duplication(the below line) we can pass as third parameter next(error)to hanle errors by Express
    // res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      throw HttpError(404, "Not Found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      throw HttpError(404, "Not Found");
    }

    res.json(deletedContact);
  } catch (error) {
    console.log("hhh");
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;

    //created middleware and invoke it(in routes) before controller createdContact is invoked
    // const { error } = createContactSchema.validate({ name, email, phone });
    // if (error) {
    //   throw HttpError(400, error.message);
    // }
    const createdContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
    });
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;

    if (!name && !email && !phone && !favorite) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        favorite,
      },
      { new: true }
    );
    // oprion {new:true} returns updated object in Postman
    if (!updatedContact) {
      throw HttpError(404, "Not Found such contact");
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;

    const { id } = req.params;

    const updatedStatusContact = await Contact.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        favorite,
      },
      { new: true }
    );
    // oprion {new:true} returns updated object in Postman
    if (!updatedStatusContact) {
      throw HttpError(404, "Not Found such contact");
    }

    res.json(updatedStatusContact);
  } catch (error) {
    next(error);
  }
};
