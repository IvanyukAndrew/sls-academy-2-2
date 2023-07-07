const { MongoClient } = require("mongodb");
const URL = require("url").URL;
const shortid = require("shortid");

const url = "mongodb+srv://ivanyukandrei:qqqqq@cluster0.0a8h4kj.mongodb.net/";
const dataBase = "sortedLink";

const connectToDB = async () => {
  try {
    const connect = await MongoClient.connect(url);
    return connect.db(dataBase);
  } catch (err) {
    console.log("MongoDB err", err);
  }
};

const isUrl = (link) => {
  try {
    new URL(link);
    return true;
  } catch (err) {
    return false;
  }
};

class shortLinkController {
  async createLink(req, res) {
    try {
      const { origLink } = req.body;
      const isOrigLink = isUrl(origLink);
      const db = await connectToDB();
      const collection = db.collection("links");
      const link = await collection.findOne({ origLink });

      if (!isOrigLink) {
        return res.status(400).json({ error: "Invalid URL" });
      }

      if (link) {
        const shortedUrl = `http://localhost:8080/${link.shortUrl}`;
        return res.json({ shortedUrl });
      }

      const shortUrl = shortid(origLink);
      const newLink = {
        origLink,
        shortUrl,
      };

      await collection.insertOne(newLink);

      res.json(`http://localhost:8080/${shortUrl}`);
    } catch (err) {
      console.log("err", err);
    }
  }

  async getLink(req, res) {
    try {
      const { shortUrl } = req.params;
      const db = await connectToDB();
      const collection = db.collection("links");
      const link = await collection.findOne({ shortUrl });

      if (!link) {
        return res.json({ err: "Link not found" });
      }

      return res.json(link.origLink);
    } catch (err) {
      console.log("err", err);
    }
  }
}

module.exports = new shortLinkController();
