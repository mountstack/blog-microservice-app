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
    reconnection: true, 
    reconnectionAttempts: Infinity, 
    reconnectionDelay: 1000, 
    reconnectionDelayMax: 5000 
  }); 

  socket.on("connect_error", (error) => {
    console.error("[WebSocket] Connection error:", error?.message);
  });

  return socket;
};

/**
 * Returns a connected socket, retrying every 2s up to 5 times (10s total).
 * Rejects if it's still not connected after that.
 */ 
// export const getSocket = (): Socket | null => socket; 
export const getSocket = (): Promise<Socket> => { 
  return new Promise((resolve, reject) => { 
    if (socket?.connected) {
      resolve(socket);
      return;
    } 

    let attempts = 0;
    const maxAttempts = 6;

    const interval = setInterval(() => { 
      attempts++; 

      if (socket?.connected) { 
        clearInterval(interval); 
        resolve(socket); 
        return; 
      } 

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        reject(
          new Error(
            `[WebSocket] Failed to connect after ${maxAttempts} attempts (${
              maxAttempts * 2
            }s)`
          )
        );
      }
    }, 2000);  
  }) 
}; 

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 

// Profile Events 
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
