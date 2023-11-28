const path = require("path");
const express = require('express');
const app = express();

console.log('Hello World from Smart Organizer project');

app.use(express.static(path.join(__dirname, "dist")));

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});