import mongoose from "mongoose";
import User from "./User.js";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			// This stores the ObjectId of the user who sent the message.
			// It's a reference to a document in the User collection (like a foreign key).
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		receiver: {
			// This stores the ObjectId of the user who received the message.
			// Also references a User document, allowing us to populate and get user info if needed.
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		content: {
			type: String, //we change to mp3
			required: true,
		},
	},
	{ timestamps: true } // This option automatically adds createdAt and updatedAt fields to the schema.
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
