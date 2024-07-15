import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };
type Draw = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

io.on("connection", (socket) => {
  socket.on("draw-line", ({ prevPoint, currentPoint, color }: Draw) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
  });
});

server.listen(8000, () => {
  console.log("Server listening at port 8000.");
});
