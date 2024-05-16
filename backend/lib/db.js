// Required Modules
const mongoose = require("mongoose");

// Configuring environment variables
require("dotenv").config();

// Fetching MongoDb url from environment variables
const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDb database
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database connected!!!");
  } catch (err) {
    console.log("Database not connected!!!");
  }
};

module.exports = connectToMongo;
