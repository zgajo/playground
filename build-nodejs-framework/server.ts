/**
 * 
const express = require('express')
const app = express();
app.get('/products/:id', (req, res) => {
  res.send(`You sent id ${req.params.id}`)
})

app.listen(3000, () => {
  console.log('Server up and running on port 3000')
})
 */
const networkInterfaces = require("os").networkInterfaces();

import myframework from "./myframework";

const app = myframework();

app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.use((req, res, next) => {
  console.log("middleware 2");
  next();
});

app.get("/", (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("hello world /");
});

app.get("/seloneveselo/:id", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("hello world from " + JSON.stringify(req.params));
});

app.get("/products/:testid", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("hello world from " + JSON.stringify(req.params));
});

app.get("/products/:testid", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("hello world from " + JSON.stringify(req.params));
});

app.get("/products/:id/student/:studentId", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("hello world from " + JSON.stringify(req.params));
});

app.listen(2000, (port) => {
  console.log(`Listening on adress http://localhost:${port}`);
});
