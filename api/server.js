import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
// database connection
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

initializeSocket(httpServer)

app.use(express.json());
app.use(cookieParser);
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true
	})
)

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB();
});
