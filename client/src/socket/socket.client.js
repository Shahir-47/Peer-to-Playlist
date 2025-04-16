import io from "socket.io-client";

// Set the socket URL based on the environment
const SOCKET_URL =
	import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

let socket = null;

// Initialize the socket connection with the server
// This function will be called when the user logs in or signs up
export const initializeSocket = (userId) => {
	// we don't want multiple sockets from one client
	if (socket) {
		socket.disconnect();
	}

	socket = io(SOCKET_URL, {
		auth: { userId },
	});
};

export const getSocket = () => {
	if (!socket) {
		throw new Error("Socket not initialized");
	}
	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
