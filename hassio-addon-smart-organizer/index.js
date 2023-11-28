const path = require("path");
const express = require('express');
const app = express();

console.log('Hello World from Smart Organizer project');

app.use(express.static(path.join(__dirname, "client")));

// start express server on port 8000
app.listen(8000, () => {
  console.log("server started on port 8000");
});