const mg = require("mongoose");

const Schema = mg.Schema;

const Contacts = new Schema({
  contactName: { type: String, required: true },
  salutation: { type: String, required: true },
  mobilePhone: { type: String, required: true },
  email: { type: String, required: false },
  organization: { type: String, required: false },
  dob: { type: String, required: false },
  leadSrc: { type: String, required: true },
  assignedTo: { type: String, ref: "User", required: true },
  creator: { type: String, default: "admin" },
  address: { type: String, required: false },
  description: { type: String, required: false },
  createdTime: { type: Date, default: new Date() },
  updatedTime: { type: Date, default: new Date() },
});

module.exports = mg.model("Contacts", Contacts);
