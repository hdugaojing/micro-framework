// micro1-server.js
import path from 'path';
import express from 'express';
import ejs from "ejs";
import config from './config.js';
const { port, host, __dirname } = config;

const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  res.render("micro1", {
    mainUrl:  `http://${host}:${port.main}`
  });
});

// 启动 Node 服务
app.listen(port.micro1, host);
console.log(`server start at http://${host}:${port.micro1}/`);