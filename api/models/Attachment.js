import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
	{
		url: {
			type: String, // the uploaded file’s public URL (e.g. Cloudinary secure_url)
			required: true,
		},
		name: {
			type: String, // original file name (with extension)
			required: true,
		},
		ext: {
			type: String, // extension like "jpg", "pdf", "mp3"…
			required: true,
		},
		category: {
			type: String, // "image" | "video" | "audio" | "pdf" | …
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
