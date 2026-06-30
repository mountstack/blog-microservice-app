import { httpServer } from "../APIs/app"; 
import { Server as SocketServer } from "socket.io"; 

export const io = new SocketServer(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("[WebSocket] User connected: ", socket.id);

  // Join user to their personal room
  const userId = socket.handshake.query.userId as string;

  if (userId) { 
    socket.join(`user:${userId}`); 
    console.log(`[WebSocket] User ${userId} joined room: user:${userId}`); 
  } 

  socket.on("disconnect", () => { 
    console.log("[WebSocket] User disconnected: ", socket.id); 
  }); 
}); 