const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 4000;

app.use(bodyParser.json());

const itemsDbpath = path.join(__dirname, "items", "db", "items.json");

app.get("/items", getAllItems);
app.get("/items/:id", getAnItem);
app.post("/items", addItem);
app.put("/items/:id", updateItem);
app.delete("/items/:id", deleteItem);

function getAllItems(req, res) {
  fs.readFile(itemsDbpath, (err, items) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "An error occured" });
    }
    res.json(JSON.parse(items));
  });
}
function getAnItem(req, res) {
  fs.readFile(itemsDbpath, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "An error occured" });
    }

    const items = JSON.parse(data);

    const id = req.params.id;

    const foundItem = items.find((items) => {
      return items.id == parseInt(id);
    });

    if (!foundItem) {
      res.status(404).send("item not found");
    }
    res.status(200).json(foundItem);
  });
}
//post
function addItem(req, res) {
  const newItem = req.body;

  fs.readFile(itemsDbpath, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "An error occurred" });
    }
    const items = JSON.parse(data);

    const lastId = items[items.length - 1].id;
    const newId = lastId + 1;

    const postWithId = { ...newItem, id: newId };
    items.push(postWithId);

    fs.writeFile(itemsDbpath, JSON.stringify(items), (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Internal Server Error. Could not save item to database.",
        });
      }

      res.json(newItem);
    });
  });
}
//Put
function updateItem(req, res) {
  fs.readFile(itemsDbpath, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "An error occurred" });
    }
    const items = JSON.parse(data);

    const update = req.body;
    const id = req.params.id;

    const itemIndex = items.findIndex((item) => item.id === parseInt(id));

    if (itemIndex == -1) {
      res.status(404);
      res.end("id not found");
    }
    items[itemIndex] = { ...items[itemIndex], ...update };

    fs.writeFile(itemsDbpath, JSON.stringify(items), (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Internal Server Error. Could not update item in database.",
        });
      }
      res.json(items);
    });
  });
}
//Delete
function deleteItem(req, res) {
  fs.readFile(itemsDbpath, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).JSON({ message: "An error occured" });
    }

    const items = JSON.parse(data);
    const id = req.params.id;

    const itemIndex = items.findIndex((item) => item.id === parseInt(id));

    if (itemIndex == -1) {
      res.status(404).send(`item with ${id} not found`);
    }
    items.splice(itemIndex, 1);
    fs.writeFile(itemsDbpath, JSON.stringify(items), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(`items at id: ${id} successfully deleted`);
      }
      res.json(items);
    });
  });
}

app.listen(4000, () => {
  console.log(`server is runnning on localhost ${PORT}`);
});
