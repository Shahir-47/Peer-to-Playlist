import cloudinary from "../config/cloudinary.js";
import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const sendMessage = async (req, res) => {
	try {
		const { content, receiverId, attachments = [] } = req.body;

		const savedAttachments = [];
		for (const att of attachments) {
			if (att.url) {
				savedAttachments.push({
					url: att.url,
					key: att.key,
					name: att.name,
					ext: att.ext,
					category: att.category,
				});
			} else if (typeof att.data === "string" && att.data.startsWith("data:")) {
				const uploadRes = await cloudinary.uploader.upload(att.data, {
					folder: "chat_attachments",
					resource_type: "auto",
				});
				savedAttachments.push({
					url: uploadRes.secure_url,
					key: uploadRes.public_id,
					name: att.name,
					ext: att.ext,
					category: att.category,
				});
			}
		}

		// Create a new message in the DB with sender, receiver, and content
		const newMessage = await Message.create({
			sender: req.user.id,
			receiver: receiverId,
			content,
			attachments: savedAttachments,
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

export const sendPublicKeys = async(req,res) => {
	try {// Get Socket.IO instance and connected users map
	const io = getIO();
	const connectedUsers = getConnectedUsers();
	// Look up the receiver's socket ID (if they're online)
	const receiverSocketId = connectedUsers.get(receiverId);
	const userId = req.user.id;

	//sieve of Eratosthenes 
	//code from https://stackoverflow.com/questions/61700358/generating-random-prime-number
	const getPrimes = (min, max) => {
		const result = Array(max + 1)
		  .fill(0)
		  .map((_, i) => i);
		for (let i = 2; i <= Math.sqrt(max + 1); i++) {
		  for (let j = i ** 2; j < max + 1; j += i) delete result[j];
		}
		return Object.values(result.slice(Math.max(min, 2)));
	  };
	  
	  const getRandNum = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	  };
	  
	  const getRandPrime1 = (min, max) => {
		const primes = getPrimes(min, max);
		return primes[getRandNum(0, primes.length - 1)];
	  };

	  const getRandPrime2 = (min, max) => {
		const primes = getPrimes(min, max);
		return primes[getRandNum(0, primes.length - 1)];
	  };

	  // Create a new message in the DB with sender, receiver, and content
		const newMessage = await Message.create({
			sender: req.user.id,
			receiver: receiverId,
			content: getRandPrime1, getRandPrime2,
			attachments: savedAttachments,
		});
	if (receiverSocketId) {
		io.to(receiverSocketId).emit("newMessage", {
			message: newMessage,
			senderId: req.user.id,
		});
	}
	res.status(201).json({
		success: true,
		message: newMessage,
	});}
	catch (error){
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
