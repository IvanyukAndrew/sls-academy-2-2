const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");

const app = express();

app.use(express.json());

const convertToInt = (ip) => {
  const octets = ip.split(".");
  let integerIp = 0;

  for (const octet of octets) {
    integerIp = integerIp * 256 + parseInt(octet, 10);
  }

  return integerIp;
};

const readAndParseCSV = async () => {
  const csv = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream("IP2LOCATION-LITE-DB1.CSV")
      .pipe(csvParser(["a", "b", "short", "country"]))
      .on("data", (data) => csv.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  return csv;
};

app.get("/location", async (req, res) => {
  let result;
  const { ip } = req.body;

  const integer = convertToInt(ip);
  const csv = await readAndParseCSV();

  csv.forEach((item) => {
    if (integer >= item.a && integer <= item.b) {
      result = `${item.country} — ${ip}`;
    }
  });
  if (!result) {
    result = `Sorry, but we did't find a country with this ip — ${ip}`;
  }

  res.json(result);
});

app.listen(8080, () => {
  console.log("Server OK");
});
