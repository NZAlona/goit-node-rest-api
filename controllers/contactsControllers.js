import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
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
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      throw HttpError(404, "Not Found");
      //   return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);

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
    const { name, email, phone } = req.body;

    //created middleware and invoke it(in routes) before controller createdContact is invoked
    // const { error } = createContactSchema.validate({ name, email, phone });
    // if (error) {
    //   throw HttpError(400, error.message);
    // }
    const createdContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    // const { error } = updateContactSchema.validate({ name, email, phone });
    // if (error) {
    //   throw HttpError(400, "Not Found");
    // }

    const { id } = req.params;

    const updatedContact = await contactsService.updateById(id, {
      name,
      email,
      phone,
    });

    if (!updatedContact) {
      throw HttpError(404, "Not Found such contact");
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
