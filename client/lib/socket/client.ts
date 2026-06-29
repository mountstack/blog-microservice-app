import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8010";

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(WS_URL, {
    query: { userId },
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect_error", (error) => {
    console.error("[WebSocket] Connection error:", error?.message);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onProfileUpdated = (callback: (data: any) => void): void => { 
  if (socket) { 
    socket.on("profile-updated", callback); 
    return; 
  } 

  const checkSocket = setInterval(() => {  
    if (socket) { 
      socket.on("profile-updated", callback); 
      clearInterval(checkSocket); 
    } 
  }, 100); 

  setTimeout(() => { 
    clearInterval(checkSocket); 
  }, 5000); 
}; 

export const offProfileUpdated = (callback: (data: any) => void): void => {
  if (socket) {
    socket.off("profile-updated", callback);
  }
};