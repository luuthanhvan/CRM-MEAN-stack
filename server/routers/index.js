const contactsRouter = require("./contacts");
const salesOrderRouter = require("./sales_order");
const userRouter = require("./user");
const authRouter = require("./auth");

function route(app) {
  app.use("/contacts", contactsRouter);
  app.use("/sales_order", salesOrderRouter);
  app.use("/user_management", userRouter);
  app.use("/auth", authRouter);
}

module.exports = route;
