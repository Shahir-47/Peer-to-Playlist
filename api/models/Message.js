import mongoose from "mongoose";
import User from "./User.js";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
			required: true,
		},
		content: {
			type: String, //we change to mp3
			required: true,
		},
	},
	{ timestamps: true }
); //createdat and updatedat fields for us

const Message = mongoose.model("Message", messageSchema);

export default Message;
