import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import {
	getConversation,
	sendMessage,
} from "../controllers/messageController.js";

// Create a new Express router instance.
// A router is a mini Express application that can handle its own routes and middleware.
const router = express.Router();

// Apply protectedRoute middleware to all routes in this router.
// This ensures that only authenticated users can access these endpoints.
router.use(protectedRoute);

// Define a POST route for sending a new message.
// When a POST request is made to "/send", the sendMessage controller is executed.
router.post("/send", sendMessage);

// Define a GET route for fetching the conversation with a specific user.
// The :userId parameter specifies the conversation partner's ID.
router.get("/conversation/:userId", getConversation);

export default router;
