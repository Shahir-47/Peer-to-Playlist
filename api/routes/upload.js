// server/routes/uploads.js
import express from "express";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { protectedRoute } from "../middleware/auth.js";
import s3 from "../config/s3.js";

const router = express.Router();

router.post("/s3/presign", protectedRoute, async (req, res) => {
	const { name, type } = req.body;
	if (!name || !type) {
		return res.status(400).json({ error: "name and type required" });
	}

	const userId = req.user.id;
	const key = `${userId}/chat_attachments/${Date.now()}_${name}`;

	try {
		// generate a presigned PUT URL
		const putCommand = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: key,
			ContentType: type,
			ACL: "private",
		});
		const url = await getSignedUrl(s3, putCommand, { expiresIn: 60 });

		return res.json({ url, key });
	} catch (err) {
		console.error("Presign error:", err);
		return res.status(500).json({ error: "Could not generate presigned URL" });
	}
});

router.post("/s3/presign-download", protectedRoute, async (req, res) => {
	const { key, expiresIn } = req.body;
	if (!key) {
		return res.status(400).json({ error: "key required" });
	}

	// if expiresIn is not a number, default to 60 seconds
	// if expiresIn is greater than 900 seconds, set it to 900 seconds
	const safeExpiresIn = Math.min(Number(expiresIn) || 60, 900);

	try {
		// generate a presigned GET URL
		const getCommand = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: key,
		});
		const url = await getSignedUrl(s3, getCommand, {
			expiresIn: safeExpiresIn,
		});

		return res.json({ url });
	} catch (err) {
		console.error("Presign error:", err);
		return res.status(500).json({ error: "Could not generate presigned URL" });
	}
});

export default router;
