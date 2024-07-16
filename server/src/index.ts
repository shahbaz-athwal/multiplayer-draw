import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

type Position = {
  x: number;
  y: number;
};

const port = process.env.PORT || 8000;

const users: { [key: string]: Position | null } = {};

const handleMessage = (position: Position, uuid: string, socket: Socket) => {
  users[uuid] = position;
  broadcast(socket);
};

const handleClose = (uuid: string, socket: Socket) => {
  delete users[uuid];
  broadcast(socket);
};

const broadcast = (socket: Socket) => {
  socket.broadcast.emit("update", users);
};

io.on("connection", (socket: Socket) => {
  const uuid = v4();

  socket.on("move-mouse", (position: Position) => {
    handleMessage(position, uuid, socket);
  });

  socket.emit("user-id", uuid);

  socket.on("disconnect", () => handleClose(uuid, socket));

  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", ({ prevPoint, currentPoint, color }: DrawLine) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
  });

  socket.on("clear", () => io.emit("clear"));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
