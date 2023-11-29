require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const { log } = require("console");

const App = express();
App.use(cors());
App.use(express.json());

// Connecting Routes
App.use("/organizers", require("./routes/organizers"));
App.use("/settings", require("./routes/settings"));

App.get("/", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// Error Handler Middleware
App.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = App.listen(PORT, () => console.log(`Running on port ${PORT}`));
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged error: ${err}`);
  server.close(() => process.exit(1));
});
