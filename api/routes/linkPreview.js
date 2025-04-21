// routes/linkPreview.js
import express from "express";
import { getLinkPreview } from "link-preview-js";
const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { url } = req.body;
		const data = await getLinkPreview(url);
		res.json(data);
	} catch {
		res.status(500).json({ error: "Could not fetch preview" });
	}
});

export default router;
