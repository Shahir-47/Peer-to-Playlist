import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const sendMessage = async (req, res) => {
	try {
		const { content, receiverId } = req.body;

		// Create a new message in the DB with sender, receiver, and content
		const newMessage = await Message.create({
			sender: req.user.id,
			receiver: receiverId,
			content,
		});

		// Get Socket.IO instance and connected users map
		const io = getIO();
		const connectedUsers = getConnectedUsers();

		// Look up the receiver's socket ID (if they're online)
		const receiverSocketId = connectedUsers.get(receiverId);

		// If the receiver is connected, emit a "newMessage" event in real-time
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", {
				message: newMessage,
				senderId: req.user.id,
			});
		}

		res.status(201).json({
			success: true,
			message: newMessage,
		});
	} catch (error) {
		console.log("Error in sendMessage: ", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const getConversation = async (req, res) => {
	const { userId } = req.params; // ID of the other user in the conversation

	try {
		const messages = await Message.find({
			// Fetch all messages between the current user and the given user
			$or: [
				{ sender: req.user._id, receiver: userId }, // messages we sent
				{ sender: userId, receiver: req.user._id }, // messages we received
			],
		}).sort("createdAt"); // Sort messages chronologically

		// If no messages exist, respond with 404
		if (!messages) {
			return res.status(404).json({
				success: false,
				message: "No messages found",
			});
		}

		res.status(200).json({
			success: true,
			messages,
		});
	} catch (error) {
		console.log("Error in getConversation: ", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
