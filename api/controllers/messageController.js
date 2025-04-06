import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
	try {
		const { content, receiverId } = req.body;

		const newMessage = await Message.create({
			sender: req.user.id,
			receiver: receiverId,
			content,

			//SEND THE MESSAGE IN REAL TIME - later
		});
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
	const { userId } = req.params;

	try {
		const messages = await Message.find({
			// find messages sent by us OR received by us
			$or: [
				{ sender: req.user._id, receiver: userId }, // messages sent by us
				{ sender: userId, receiver: req.user._id }, // messages received by us
			],
		}).sort("createdAt"); // see the latest messages first and the oldest messages last

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
