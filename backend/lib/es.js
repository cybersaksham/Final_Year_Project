// Required Modules
const es = require("elasticsearch");
const { v4 } = require("uuid");

// Configuring environment variables
require("dotenv").config();

// Creating a new elastic search client
let client = new es.Client({
  host: process.env.ES_URI,
  // log: "trace",
});

module.exports = {
  client,
  // Function to add document in elastic search
  addDocument: async (body, id = null) => {
    let timestamp = new Date().toISOString();
    if (body.timestamp) {
      timestamp = body.timestamp.toISOString();
      delete body.timestamp;
    }
    client.index({
      index: "ctf",
      id: id || String(v4()),
      body: { ...body, timestamp },
    });
  },
  // Function to clear data from the elastic search
  // Note: This function is not used in APIs
  // This is created just for development purposes
  clearData: async () => {
    await client.indices.delete({ index: "_all" });
  },
};
