const mg = require("mongoose");

const Schema = mg.Schema;

const SalesOrder = new Schema({
  subject: { type: String, required: true },
  contactName: { type: String, ref: "Contact", required: true },
  status: { type: String, required: true },
  total: { type: String, required: true },
  assignedTo: { type: String, ref: "User", required: true },
  creator: { type: String, default: "admin" },
  description: { type: String, required: false },
  createdTime: { type: Date, default: new Date() },
  updatedTime: { type: Date, default: new Date() },
});

module.exports = mg.model("SalesOrder", SalesOrder);
