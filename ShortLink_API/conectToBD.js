module.exports = function async () {
  try {
    const connect = await MongoClient.connect(url);
    return connect.db(dataBase);
  } catch (err) {
    console.log("MongoDB err", err);
  }
};


