import SpotifyWebApi from "spotify-web-api-node";
import User from "../models/User.js";

export async function makeSpotifyClient(tokens, userId) {
	const client = new SpotifyWebApi({
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		redirectUri: process.env.SPOTIFY_REDIRECT_URI,
	});

	client.setAccessToken(tokens.accessToken);
	client.setRefreshToken(tokens.refreshToken);

	// Refresh if expired
	if (Date.now() > new Date(tokens.expiresAt).getTime()) {
		const { body } = await client.refreshAccessToken();
		client.setAccessToken(body.access_token);

		// Persist new tokens
		const u = await User.findById(userId);
		u.spotify.accessToken = body.access_token;
		u.spotify.expiresAt = new Date(Date.now() + body.expires_in * 1000);
		if (body.refresh_token) u.spotify.refreshToken = body.refresh_token;
		await u.save();
	}

	return client;
}
