require("./config/passport");

const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const passport = require("passport");
const route = require("./routers");
const db = require("./config/dbConnection");

const app = express();

dotenv.config({ path: ".env" });

// Database connection
db.connect();

if (process.env.NODE_ENV == "development") {
  app.use(logger("dev"));
}

// Parsing body request
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

/* ERROR: Access at 'http://localhost:4040/contacts/store' from origin 'http://localhost:4200' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource */
// FIX: use cors middleware to allow cross-origin requests
app.use(cors());

app.use(passport.initialize());

/* Routing */
route(app);

// error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message),
    );
    res.status(422).send(valErrors);
  } else {
    console.log(err);
  }
});

if (!module.parent) {
  app.listen(process.env.SERVER_PORT, process.env.HOSTNAME, () => {
    console.info(
      `Server running at http://${process.env.HOSTNAME}:${process.env.SERVER_PORT}`,
    );
  });
}
