import { Server } from "socket.io";

let io;

const connectedUsers = new Map();

/**
 * Initializes and configures the Socket.IO server.
 * This must be called once with the Express HTTP server.
 * @param {http.Server} httpServer - The same HTTP server used by Express
 */
export const initializeSocket = (httpServer) => {
	// Attach Socket.IO to the same server Express uses
	// This allows us to use the same server for both HTTP and WebSocket connections
	io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL, // Only allow connections from the frontend URL
			credentials: true, // Allow credentials (cookies, authorization headers, etc.)
		},
	});

	// Middleware: Run before the socket connection is finalized
	io.use((socket, next) => {
		const userId = socket.handshake.auth.userId; // Get userId from client-provided auth data
		if (!userId) return next(new Error("Invalid user ID"));

		// Attach the userId to the socket object for later use
		socket.userId = userId;
		next(); // Allow the connection to proceed
	});

	//listening for the incoming connections
	//if connection, update map
	//if disconnect, remove from map
	io.on("connection", (socket) => {
		console.log(`User connected with socket id: ${socket.id}`);
		connectedUsers.set(socket.userId, socket.id);

		socket.on("disconnect", () => {
			console.log(`User disconnected with socket id: ${socket.id}`);
			connectedUsers.delete(socket.userId);
		});
	});
};

//return the io
export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};

export const getConnectedUsers = () => connectedUsers;
