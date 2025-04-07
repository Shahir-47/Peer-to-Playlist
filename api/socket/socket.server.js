import { Server } from 'socket.io';

let io;

const connectedUsers = new Map();

export const initializeSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors:{
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        console.log("User connected with socket id: ${socket.id}");
        connectedUsers.set(socket.userId, socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected with socket id: ${socket.id}");
            connectedUsers.delete(socket.userId);
        })
    })

}