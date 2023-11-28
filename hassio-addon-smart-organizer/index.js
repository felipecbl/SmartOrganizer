const path = require("path");
const express = require('express');

const app = express();
const port = process.env.PORT || 81;

console.log('Hello World from Smart Organizer project');

// app.use(express.static(path.join(__dirname, "client/index.html")));
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, "client/index.html"));
  res.send('Hello World from Smart Organizer project');
});

// start express server on port 8000
app.listen(port, () => {
  console.log(`server started on dynamic port ${port}`);
});