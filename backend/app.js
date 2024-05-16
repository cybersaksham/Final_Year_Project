// Required Modules
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./lib/db");

// Creating a new express server
const app = express();

// Initializing custom port for the server
const port = process.env.PORT || 5500;

// Connecting to MongoDb Database
connectDB();

// Enabling CORS to allow cross origin API calls
app.use(cors());

// Using bodyparser to accept body data in json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route for user APIs
app.use("/user", require("./Routes/user"));
// Route for challenge APIs
app.use("/challenge", require("./Routes/challenge"));
// Route for contest APIs
app.use("/contest", require("./Routes/contest"));

// Listening the express server on given port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
