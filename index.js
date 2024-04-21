const path = require("path");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const { log } = require("console");

const App = express();
App.use(cors());
App.use(express.json());

const PORT = process.env.PORT || 8890;

console.log('Starting Smart Organizer...');

// Connecting Routes
App.use("/api/organizers", require("./routes/organizers"));
App.use("/api/settings", require("./routes/settings"));

App.use(express.static(path.join(__dirname, "client/build/")));

// Error Handler Middleware
App.use(errorHandler);

// start express server
const server = App.listen(PORT, () => console.log(`Running on port ${PORT}`));
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged error: ${err}`);
  server.close(() => process.exit(1));
});