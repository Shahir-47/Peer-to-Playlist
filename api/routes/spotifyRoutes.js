import express from "express";
import {
	spotifyLogin,
	spotifyCallback,
} from "../controllers/spotifyController.js";

const router = express.Router();

// build the Spotify auth URL and send it to the client
router.get("/login", spotifyLogin);

// Spotify will redirect here with a ?code=…; exchange for tokens then postMessage back to opener
router.get("/callback", spotifyCallback);

export default router;
