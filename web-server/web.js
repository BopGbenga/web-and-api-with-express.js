const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const PORT = 3000;

const app = express();

app.use(express.static("Html-files"));

const homePagePath = path.join(__dirname, "Html-files", "index.html");
const errorPagePath = path.join(__dirname, "Html-files", "error.html");

app.get("/index.html", async (req, res) => {
  const file = await fs.readFile(homePagePath, "utf-8");
  res.status(200).sendFile(file);
});
app.get("*", async (req, res) => {
  const file = await fs.readFile(errorPagePath, "utf-8");
  res.send(file);
});

app.listen(3000, () => {
  console.log(`server is running on ${PORT}`);
});
