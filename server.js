const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/public", express.static(__dirname + "/"));
// app.use("")

const server = app.listen(8000, function () {
  console.log("server is listening on PORT 8000");
});
