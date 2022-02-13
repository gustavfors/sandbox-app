require("dotenv").config();
const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

let db;
let history;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.REQUEST_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("join", history);

  socket.on("send_message", async (data) => {
    const test = await db.execute(
      "INSERT INTO messages (body, author) VALUES (?, ?)",
      [data.body, data.author]
    );
    const message = {
      id: test[0].insertId,
      body: data.body,
      author: data.author,
    };
    history.push(message);
    io.emit("recieve_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

(async () => {
  db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
  });

  let [rows, _] = await db.execute("SELECT * FROM messages");

  history = rows;

  server.listen(process.env.SERVER_PORT, () => {
    console.log("server running");
  });
})();
