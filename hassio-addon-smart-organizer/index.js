const path = require("path");
const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

console.log('Hello World from Smart Organizer project');

app.use(express.static(path.join(__dirname, "/index.html")));

// start express server on port 8000
app.listen(port, () => {
  console.log(`server started on dynamic port ${port}`);
});