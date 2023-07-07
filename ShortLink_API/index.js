const express = require("express");
const shortid = require("shortid");
const { createLink, getLink } = require("./controller/link.controller");

const app = express();
const port = 8080;
const url = "mongodb+srv://ivanyukandrei:qqqqq@cluster0.0a8h4kj.mongodb.net/";
const dataBase = "sortedLink";

app.use(express.json());

app.post("/link", createLink);

app.get("/:shortUrl", getLink);

app.listen(port, () => {
  console.log("Server OK");
});
