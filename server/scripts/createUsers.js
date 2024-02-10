const mg = require("mongoose");
const db = require("../config/dbConnection");
const sampleUsers = require("../json-data/sample-users.json");
const User = require("../models/User");

db.connect();

User.insertMany(sampleUsers)
  .then(function (docs) {
    console.log("All user data are saved to the database", docs);
    mg.connection.close();
  })
  .catch(function (err) {
    console.error("Error Occurred: ", err.message);
  });
