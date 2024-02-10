const mg = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

async function connect() {
  try {
    await mg.connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Database sucessfully connected");
  } catch (err) {
    console.log("Database failure connected");
  }
}

module.exports = { connect };
