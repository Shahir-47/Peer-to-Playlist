import express from "express"; // To create an Express application
import dotenv from "dotenv"; // To load environment variables from a .env file
import cookieParser from "cookie-parser"; // To parse cookies from the request
import { createServer } from "http"; // To create an HTTP server
import cors from "cors"; // To enable CORS (Cross-Origin Resource Sharing) for the API

// Import route handlers for different parts of the API
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// Import the database connection function
import { connectDB } from "./config/db.js";

// Import the function to initialize the Socket.IO server
import { initializeSocket } from "./socket/socket.server.js";

// Load environment variables from the .env file into process.env
dotenv.config();

const app = express(); // Create an Express application

// Create an HTTP server using the Express app
// Express is built on top of this server, so all Express logic runs here.
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize the Socket.IO server and attach it to the HTTP server.
// This sets up a real-time communication channel alongside our Express API.
// The same HTTP server now handles both regular HTTP requests and WebSocket connections.
initializeSocket(httpServer);

// express.json(): Parses incoming JSON payloads to make them available on req.body.
app.use(express.json());

// cookieParser(): Parses cookies attached to the client request, making them accessible via req.cookies.
app.use(cookieParser());

// This allows the front-end (which might be hosted on a different domain) to make requests to this server.
// 'origin' tells which front-end URL is allowed; 'credentials: true' enables sending cookies with requests.
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

// Match each incoming request to the appropriate route handler.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

// Start the server and listen for incoming requests on the specified port.
httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB(); // Connect to the database when the server starts
});
