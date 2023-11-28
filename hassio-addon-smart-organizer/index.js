const path = require("path");
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

console.log('Hello World from Smart Organizer project');

app.use(express.static(path.join(__dirname, "client")));
// app.get('/', (req, res) => {
//   res.send('Hello World from Smart Organizer project');
// });

// start express server
app.listen(port, () => {
  console.log(`server started on dynamic port ${port}`);
});