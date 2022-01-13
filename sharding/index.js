const app = require("express")();
const { Client } = require("pg");
const crypto = require("crypto");
const HashRing = require("hashring");
const hr = new HashRing();

hr.add("5433");
hr.add("5434");
hr.add("5435");

const clients = {
  5433: new Client({
    host: "localhost",
    port: "5433",
    user: "postgres",
    password: "postgres",
    database: "postgres",
  }),
  5434: new Client({
    host: "localhost",
    port: "5434",
    user: "postgres",
    password: "postgres",
    database: "postgres",
  }),
  5435: new Client({
    host: "localhost",
    port: "5435",
    user: "postgres",
    password: "postgres",
    database: "postgres",
  }),
};

(async () => {
  try {
    await clients[5433].connect();
    await clients[5434].connect();
    await clients[5435].connect();
    console.log("connected");
  } catch (error) {
    console.log("err", error);
  }
})();

app.get("/", (req, res) => {
  res.send("");
});

app.get("/:urlId", async (req, res) => {
  try {
    const urlId = req.params.urlId;

    const server = hr.get(urlId);

    const result = await clients[server].query(
      "select * from url_table where url_id = $1",
      [urlId]
    );

    res.send({
      urlId: urlId,
      result: result.rows,
      server: server,
    });
  } catch (error) {
    console.log("err", error);
  }
});

app.post("/", async (req, res) => {
  try {
    const url = req.query.url;
    //www.wikipedia.com/sharding
    //consistently hash this to get a port!
    const hash = crypto.createHash("sha256").update(url).digest("base64");
    const urlId = hash.substring(0, 5);

    const server = hr.get(urlId);

    await clients[server].query(
      "INSERT INTO URL_TABLE (URL, URL_ID) VALUES ($1,$2)",
      [url, urlId]
    );

    res.send({
      urlId: urlId,
      url: url,
      server: server,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(8081, () => {
  console.log("listening");
});
