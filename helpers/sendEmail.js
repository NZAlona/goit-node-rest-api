import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_KEY } = process.env;

sgMail.setApiKey(SENDGRID_KEY);

const sendEmail = async (message) => {
  const email = { ...message, from: "amakoveychenko@gmail.com" };
  await sgMail.send(email);
  return true;
};

export default sendEmail;
