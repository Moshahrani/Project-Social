const express = require('express');
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev})
const handle = nextApp.getRequestHandler()

require('dotenv').config({path:"./config.env"})

 const connectDB = require('./utilities/connectDb.js')
 connectDB();
 
const PORT = process.env.PORT || 3000;

app.use(express.json());

nextApp.prepare().then(() => {
    app.all("*", (req, res) => handle(req, res));

  httpServer.listen(PORT, err => { 
    if (err) throw err;
    console.log(`Express server running on ${PORT}`)
  });
});