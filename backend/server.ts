import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import * as data from "./data/database";
import cors from "cors";
import { Auction } from "./data/auction";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));

io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);

  const query = socket.handshake.query;
  const roomName = query.roomName as string;
  socket.join(roomName);
  socket.emit("joined", roomName);

  socket.on("placeBid", (auction: Auction) => {
    console.log("placeBid", auction);
    data.auctions.map((a) => {
      if (a.id === auction.id) {
        a.currentBid = auction.currentBid;
        a.highestBidder = auction.highestBidder;
      }
    });

    io.to(roomName).emit("newBid", auction);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/api/auctions", (req, res) => {
  res.json(data.auctions);
});

app.get("/api/auctions/:id", (req, res) => {
  res.json(data.auctions.filter((auction) => auction.id === req.params.id)[0]);
});

data.Init();
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
