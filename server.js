const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
require("dotenv").config({ path: "./config.env" })

const connectDB = require("./utilities/connectDb.js")
connectDB();

const PORT = process.env.PORT || 3000;
app.use(express.json());

const { addUser, removeUser } = require("./utilities/socialEvents");
const { loadMessages } = require("./utilities/messageEvents");


io.on("connection", socket => {

  socket.on("join", async ({ userId }) => {

    const users = await addUser(userId, socket.id)

    console.log(users)

    setInterval(() => {
      // sending back all the users every 10 seconds, 
      // except "user" who is logged in
      socket.emit("connectedUsers", {
        users: users.filter(user => user.userId !== userId)
      })
    }, 10000)
  });

  socket.on("loadMessages", async ({ userId, messagesWith }) => {

    const { chat, error } = await loadMessages(userId, messagesWith);

    if (!error) {
      socket.emit("messagesLoaded", { chat });
    }
  });

  // pass client/user's Id and remove it from the array
  socket.on("disconnect", () => removeUser(socket.id));
});

nextApp.prepare().then(() => {

  app.use("/api/signup", require("./api/signup"));
  app.use("/api/authorization", require("./api/authorization"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/notifications", require("./api/notifications"));
  app.use("/api/chats", require("./api/chats"))
  app.all("*", (req, res) => handle(req, res));

  httpServer.listen(PORT, err => {
    if (err) throw err;
    console.log(`Express server running on ${PORT}`)
  });
});