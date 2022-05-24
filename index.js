const express = require("express");
const fs = require("fs");
const readline = require("readline");
const cors = require("cors");

const filePath = "./w5.txt";
var lineReader = readline.createInterface({
  input: fs.createReadStream(filePath),
});

const words = [];
lineReader.on("line", function (line) {
  words.push(line);
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile("./word5.html", { root: __dirname });
});

app.post("/api", (req, res) => {
  const { known, include, exclude } = req.body;

  //console.log("testing known", known);
  let matches = words.filter((word) => {
    const knownLower = known.map((c) => c.toLowerCase());
    for (var idx = 0; idx < 5; idx++)
      if (knownLower[idx] != "" && knownLower[idx] != word[idx]) return false;
    return true;
  });
  //console.log("matches", matches.length);
  if (include.length) {
    //console.log("testing include", include);
    const includeLower = include.map((c) => c.toLowerCase());
    matches = matches.filter((word) => {
      return includeLower.every((c) => word.includes(c));
    });
    //console.log("matches", matches.length);
  }
  if (exclude.length) {
    // console.log("testing exclude", exclude);
    const excludeLower = exclude.map((c) => c.toLowerCase());
    matches = matches.filter((word) => {
      return !excludeLower.some((c) => word.includes(c));
    });
    // console.log("matches", matches.length);
  }

  res.send(matches);
});

const port = 8081;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
