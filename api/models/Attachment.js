import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
	{
		url: {
			type: String, // the uploaded file’s public URL (e.g. Cloudinary secure_url)
			required: true,
		},
		key: {
			type: String,
			required: true,
		}, // the file’s key in S3 (e.g. userId/chat_attachments/1234567890_filename)
		name: {
			type: String, // original file name (with extension)
			required: true,
		},
		ext: {
			type: String, // extension like "jpg", "pdf", "mp3"…
			required: true,
		},
		category: {
			type: String,
			enum: [
				"image",
				"video",
				"audio",
				"pdf",
				"spreadsheet",
				"presentation",
				"word",
				"archive",
				"other",
			],
			required: true,
		},
	},
	{ _id: false }
);

export default attachmentSchema;
