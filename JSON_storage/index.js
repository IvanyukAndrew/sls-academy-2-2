const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 8080;
const url = "mongodb+srv://ivanyukandrei:qqqqq@cluster0.0a8h4kj.mongodb.net/";

const connectToDB = async () => {
  try {
    const connect = await MongoClient.connect(url);
    return connect.db("jsonStorage");
  } catch (err) {
    console.log("MongoDB err", err);
  }
};

app.put("/:json_path", async (req, res) => {
  try {
    const jsonPath = req.params.json_path;
    const json = req.body;
    const db = await connectToDB();

    const colection = db.collection("json");
    await colection.updateOne(
      { jsonPath },
      { $set: { json } },
      { upsert: true }
    );

    res.json(json);
  } catch (err) {
    console.log(err);
  }
});

app.get("/:json_path", async (req, res) => {
  try {
    const jsonPath = req.params.json_path;

    const db = await connectToDB();

    const colection = db.collection("json");
    const result = await colection.findOne({ jsonPath });

    res.json({
      message: "success",
      document: result,
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server ok ${port}`);
});
